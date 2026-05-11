from typing import List
from fastapi import APIRouter, Depends, status, Query, Path
from fastapi.responses import JSONResponse
from sqlmodel import Session
from pydantic import BaseModel
from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.participante.schema import ParticipanteCreate, ParticipanteRead, ParticipanteUpdate
from app.participante import service

router = APIRouter(tags=["Participantes"])

# Modelos para login
class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    rol: str

class LoginResponse(BaseModel):
    token: str
    user: User


# Hardcoded credentials for demo (in production, use a real database)
VALID_USERS = {
    "admin": {"password": "admin123", "id": 1, "rol": "ADMIN"},
    "user": {"password": "user123", "id": 2, "rol": "CONSULTA"}
}


@router.post("/login")
def login(request: LoginRequest):
    """Login endpoint"""
    user_data = VALID_USERS.get(request.username)

    if not user_data or user_data["password"] != request.password:
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": "Usuario o contraseña inválidos",
                "token": None,
                "user": None,
                "status_code": 401
            }
        )

    # In production, generate a real JWT token
    token = f"bearer_{request.username}_{user_data['id']}"

    return {
        "success": True,
        "message": "Login exitoso",
        "token": token,
        "user": {
            "id": user_data["id"],
            "username": request.username,
            "rol": user_data["rol"]
        },
        "status_code": 200
    }


@router.get("/participantes")
def read_participantes(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> ApiResponse:
    participantes, total = service.get_all(session, limit, offset)

    return success_response(
        data={
            "items": [ParticipanteRead.model_validate(p) for p in participantes],
            "total": total,
            "limit": limit,
            "offset": offset
        },
        message="Participantes obtenidos exitosamente"
    )


@router.get("/participantes/{participante_id}")
def get_participante(
    participante_id: int = Path(..., gt=0, description="ID del participante"),
    session: Session = Depends(get_session)
) -> ApiResponse:
    db_participante = service.get_by_id(session, participante_id)
    if not db_participante:
        return error_response(message="Participante no encontrado", status_code=404)
    return success_response(
        data=ParticipanteRead.model_validate(db_participante),
        message="Participante obtenido exitosamente"
    )


@router.post("/participantes", status_code=status.HTTP_201_CREATED)
def create_participante(participante: ParticipanteCreate, session: Session = Depends(get_session)) -> ApiResponse:
    # Check if email already exists
    existing = service.get_by_email(session, participante.email)
    if existing:
        return error_response(message="El email ya está registrado", status_code=400)

    new_participante = service.create(session, participante)
    return success_response(
        data=ParticipanteRead.model_validate(new_participante),
        message="Participante creado exitosamente",
        status_code=201
    )


@router.put("/participantes/{participante_id}")
def update_participante(participante_id: int, participante: ParticipanteUpdate, session: Session = Depends(get_session)) -> ApiResponse:
    db_participante = service.get_by_id(session, participante_id)
    if not db_participante:
        return error_response(message="Participante no encontrado", status_code=404)

    # Check if new email is already taken by another participante
    if participante.email and participante.email != db_participante.email:
        existing = service.get_by_email(session, participante.email)
        if existing:
            return error_response(message="El email ya está registrado", status_code=400)

    updated_participante = service.update(session, db_participante, participante)
    return success_response(
        data=ParticipanteRead.model_validate(updated_participante),
        message="Participante actualizado exitosamente"
    )


@router.delete("/participantes/{participante_id}")
def delete_participante(participante_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    db_participante = service.get_by_id(session, participante_id)
    if not db_participante:
        return error_response(message="Participante no encontrado", status_code=404)
    service.delete(session, db_participante)
    return success_response(
        message="Participante eliminado exitosamente",
        status_code=204
    )


@router.delete("/participantes")
def delete_all_participantes(session: Session = Depends(get_session)) -> ApiResponse:
    """Delete all participantes (soft delete)"""
    participantes, _ = service.get_all(session, limit=10000)
    for p in participantes:
        service.delete(session, p)
    return success_response(
        message="Todos los participantes eliminados exitosamente",
        status_code=204
    )
