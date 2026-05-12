from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.ingrediente.schema import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.ingrediente import service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

@router.get("/")
def read_ingredientes(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> ApiResponse:
    ingredientes, total = service.get_all(session, limit, offset)

    return success_response(
        data={
            "items": [IngredienteRead.model_validate(i) for i in ingredientes],
            "total": total,
            "limit": limit,
            "offset": offset
        },
        message="Ingredientes obtenidos exitosamente"
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_ingrediente(ingrediente: IngredienteCreate, session: Session = Depends(get_session)) -> ApiResponse:
    new_ingrediente = service.create(session, ingrediente)
    return success_response(
        data=IngredienteRead.model_validate(new_ingrediente),
        message="Ingrediente creado exitosamente",
        status_code=201
    )

@router.put("/{ingrediente_id}")
def update_ingrediente(ingrediente_id: int, ingrediente: IngredienteUpdate, session: Session = Depends(get_session)) -> ApiResponse:
    db_ingrediente = service.get_by_id(session, ingrediente_id)
    if not db_ingrediente:
        return error_response(message="Ingrediente no encontrado", status_code=404)
    updated_ingrediente = service.update(session, db_ingrediente, ingrediente)
    return success_response(
        data=IngredienteRead.model_validate(updated_ingrediente),
        message="Ingrediente actualizado exitosamente"
    )

@router.delete("/{ingrediente_id}")
def delete_ingrediente(ingrediente_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    db_ingrediente = service.get_by_id(session, ingrediente_id)
    if not db_ingrediente:
        return error_response(message="Ingrediente no encontrado", status_code=404)
    service.delete(session, db_ingrediente)
    return success_response(
        message="Ingrediente eliminado exitosamente",
        status_code=204
    )
