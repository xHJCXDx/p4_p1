"""Router para Autenticación y Usuario."""

from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session

from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.core.security import (
    create_access_token,
    get_current_user,
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.usuario.schema import UsuarioCreate, UsuarioLogin, UsuarioRead, UsuarioUpdate
from app.usuario.model import Usuario
from app.usuario import service

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    user_data: UsuarioCreate,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """
    Registra un nuevo usuario y le asigna automáticamente el rol CLIENT.
    """
    try:
        new_user = service.register_user(session, user_data)
        return success_response(
            data=UsuarioRead(
                id=new_user.id,
                nombre=new_user.nombre,
                email=new_user.email,
                roles=[{"codigo": role.codigo, "descripcion": role.descripcion} for role in new_user.roles],
                created_at=new_user.created_at.isoformat()
            ),
            message="Usuario registrado exitosamente",
            status_code=201
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400)
    except Exception as e:
        return error_response(message=f"Error al registrar usuario: {str(e)}", status_code=400)


@router.post("/login")
def login(
    credentials: UsuarioLogin,
    response: Response,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """
    Autentica un usuario y retorna un JWT en una cookie httpOnly.
    """
    user = service.login_user(session, credentials.email, credentials.password)

    if not user:
        return error_response(
            message="Email o contraseña inválidos",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    # Crear JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )

    # Establecer cookie httpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Cambiar a True en producción con HTTPS
        samesite="lax",
        max_age=60 * ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return success_response(
        data=UsuarioRead(
            id=user.id,
            nombre=user.nombre,
            email=user.email,
            roles=[{"codigo": role.codigo, "descripcion": role.descripcion} for role in user.roles],
            created_at=user.created_at.isoformat()
        ),
        message="Autenticación exitosa"
    )


@router.get("/me")
def get_me(current_user: Usuario = Depends(get_current_user)) -> ApiResponse:
    """
    Retorna los datos del usuario autenticado.
    """
    return success_response(
        data=UsuarioRead(
            id=current_user.id,
            nombre=current_user.nombre,
            email=current_user.email,
            roles=[{"codigo": role.codigo, "descripcion": role.descripcion} for role in current_user.roles],
            created_at=current_user.created_at.isoformat()
        ),
        message="Datos del usuario obtenidos"
    )


@router.post("/logout")
def logout(response: Response) -> ApiResponse:
    """
    Cierra la sesión borrando la cookie de acceso.
    """
    response.delete_cookie(key="access_token")
    return success_response(message="Sesión cerrada exitosamente")
