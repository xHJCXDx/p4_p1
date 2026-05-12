from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.categoria.schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/")
def read_categorias(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> ApiResponse:
    categorias, total = service.get_all(session, limit, offset)

    return success_response(
        data={
            "items": [CategoriaRead.model_validate(c) for c in categorias],
            "total": total,
            "limit": limit,
            "offset": offset
        },
        message="Categorías obtenidas exitosamente"
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_categoria(categoria: CategoriaCreate, session: Session = Depends(get_session)) -> ApiResponse:
    new_categoria = service.create(session, categoria)
    return success_response(
        data=CategoriaRead.model_validate(new_categoria),
        message="Categoría creada exitosamente",
        status_code=201
    )

@router.put("/{categoria_id}")
def update_categoria(categoria_id: int, categoria: CategoriaUpdate, session: Session = Depends(get_session)) -> ApiResponse:
    db_categoria = service.get_by_id(session, categoria_id)
    if not db_categoria:
        return error_response(message="Categoría no encontrada", status_code=404)
    updated_categoria = service.update(session, db_categoria, categoria)
    return success_response(
        data=CategoriaRead.model_validate(updated_categoria),
        message="Categoría actualizada exitosamente"
    )

@router.delete("/{categoria_id}")
def delete_categoria(categoria_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    db_categoria = service.get_by_id(session, categoria_id)
    if not db_categoria:
        return error_response(message="Categoría no encontrada", status_code=404)
    service.delete(session, db_categoria)
    return success_response(
        message="Categoría eliminada exitosamente",
        status_code=204
    )
