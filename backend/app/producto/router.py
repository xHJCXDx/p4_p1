from typing import List
from fastapi import APIRouter, Depends, status, Query
from sqlmodel import Session
from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.producto.schema import ProductoCreate, ProductoRead, ProductoUpdate
from app.producto import service

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/")
def read_productos(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> ApiResponse:
    productos, total = service.get_all(session, limit, offset)

    return success_response(
        data={
            "items": [ProductoRead.model_validate(p) for p in productos],
            "total": total,
            "limit": limit,
            "offset": offset
        },
        message="Productos obtenidos exitosamente"
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_producto(producto: ProductoCreate, session: Session = Depends(get_session)) -> ApiResponse:
    new_producto = service.create(session, producto)
    return success_response(
        data=ProductoRead.model_validate(new_producto),
        message="Producto creado exitosamente",
        status_code=201
    )

@router.put("/{producto_id}")
def update_producto(producto_id: int, producto: ProductoUpdate, session: Session = Depends(get_session)) -> ApiResponse:
    db_producto = service.get_by_id(session, producto_id)
    if not db_producto:
        return error_response(message="Producto no encontrado", status_code=404)
    updated_producto = service.update(session, db_producto, producto)
    return success_response(
        data=ProductoRead.model_validate(updated_producto),
        message="Producto actualizado exitosamente"
    )

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    db_producto = service.get_by_id(session, producto_id)
    if not db_producto:
        return error_response(message="Producto no encontrado", status_code=404)
    service.delete(session, db_producto)
    return success_response(
        message="Producto eliminado exitosamente",
        status_code=204
    )
