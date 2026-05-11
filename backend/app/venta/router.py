from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from app.core.database import get_session
from app.core.response import success_response, error_response, ApiResponse
from app.venta.schema import (
    PedidoCreate, PedidoRead, PedidoUpdate,
    DetallePedidoCreate, DetallePedidoRead,
    PagoCreate, PagoRead, PagoUpdate,
    HistorialEstadoPedidoRead
)
from app.venta.model import Pedido, DetallePedido, Pago
from app.venta import service

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

# ============ PEDIDO ENDPOINTS ============

@router.get("/")
def read_pedidos(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> ApiResponse:
    """Obtiene todos los pedidos con paginación."""
    pedidos, total = service.get_all_pedidos(session, limit, offset)
    return success_response(
        data={
            "items": [PedidoRead.model_validate(p) for p in pedidos],
            "total": total,
            "limit": limit,
            "offset": offset
        },
        message="Pedidos obtenidos exitosamente"
    )

@router.get("/{pedido_id}")
def read_pedido(pedido_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    """Obtiene un pedido por ID."""
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)
    return success_response(
        data=PedidoRead.model_validate(pedido),
        message="Pedido obtenido exitosamente"
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_pedido(pedido: PedidoCreate, session: Session = Depends(get_session)) -> ApiResponse:
    """Crea un nuevo pedido."""
    try:
        new_pedido = service.create_pedido(session, pedido)
        return success_response(
            data=PedidoRead.model_validate(new_pedido),
            message="Pedido creado exitosamente",
            status_code=201
        )
    except Exception as e:
        return error_response(message=f"Error al crear pedido: {str(e)}", status_code=400)

@router.put("/{pedido_id}")
def update_pedido(
    pedido_id: int,
    pedido_update: PedidoUpdate,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """Actualiza un pedido (no cambia estado; usar transition_estado para eso)."""
    db_pedido = service.get_pedido_by_id(session, pedido_id)
    if not db_pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    updated_pedido = service.update_pedido(session, db_pedido, pedido_update)
    return success_response(
        data=PedidoRead.model_validate(updated_pedido),
        message="Pedido actualizado exitosamente"
    )

@router.delete("/{pedido_id}")
def delete_pedido(pedido_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    """Soft delete de un pedido."""
    db_pedido = service.get_pedido_by_id(session, pedido_id)
    if not db_pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    service.delete_pedido(session, db_pedido)
    return success_response(message="Pedido eliminado exitosamente", status_code=204)

# ============ TRANSICIÓN DE ESTADO (FSM) ============

@router.post("/{pedido_id}/transition-estado")
def transition_estado_pedido(
    pedido_id: int,
    nuevo_estado: str = Query(..., description="Nuevo estado del pedido"),
    usuario_id: Optional[int] = Query(None, description="ID del usuario que realiza la transición"),
    motivo: Optional[str] = Query(None, description="Motivo de la transición (obligatorio para CANCELADO)")
) -> ApiResponse:
    """
    Transiciona el estado de un pedido respetando el FSM.
    - Valida que la transición sea permitida
    - Crea un registro en HistorialEstadoPedido
    - RN-05: motivo obligatorio para CANCELADO
    """
    session = Session(next(get_session()))
    try:
        pedido = service.transition_estado(
            session,
            pedido_id,
            nuevo_estado,
            usuario_id=usuario_id,
            motivo=motivo
        )
        return success_response(
            data=PedidoRead.model_validate(pedido),
            message=f"Pedido transicionado a {nuevo_estado} exitosamente"
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400)
    except Exception as e:
        return error_response(message=f"Error en transición: {str(e)}", status_code=500)
    finally:
        session.close()

# ============ DETALLES PEDIDO ENDPOINTS ============

@router.get("/{pedido_id}/detalles")
def read_detalles_pedido(pedido_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    """Obtiene todos los detalles de un pedido."""
    # Verificar que el pedido existe
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    detalles = service.get_detalles_by_pedido(session, pedido_id)
    return success_response(
        data=[DetallePedidoRead.model_validate(d) for d in detalles],
        message="Detalles del pedido obtenidos exitosamente"
    )

@router.post("/{pedido_id}/detalles", status_code=status.HTTP_201_CREATED)
def create_detalle_pedido(
    pedido_id: int,
    detalle: DetallePedidoCreate,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """Crea un detalle de pedido."""
    # Verificar que el pedido existe
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    # Asegurar que el pedido_id coincida
    detalle.pedido_id = pedido_id

    try:
        new_detalle = service.create_detalle_pedido(session, detalle)
        return success_response(
            data=DetallePedidoRead.model_validate(new_detalle),
            message="Detalle del pedido creado exitosamente",
            status_code=201
        )
    except Exception as e:
        return error_response(message=f"Error al crear detalle: {str(e)}", status_code=400)

# ============ PAGO ENDPOINTS ============

@router.get("/{pedido_id}/pagos")
def read_pagos_pedido(pedido_id: int, session: Session = Depends(get_session)) -> ApiResponse:
    """Obtiene todos los pagos de un pedido."""
    # Verificar que el pedido existe
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    pagos = service.get_pagos_by_pedido(session, pedido_id)
    return success_response(
        data=[PagoRead.model_validate(p) for p in pagos],
        message="Pagos del pedido obtenidos exitosamente"
    )

@router.post("/{pedido_id}/pagos", status_code=status.HTTP_201_CREATED)
def create_pago_pedido(
    pedido_id: int,
    pago: PagoCreate,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """Crea un registro de pago para un pedido."""
    # Verificar que el pedido existe
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    # Asegurar que el pedido_id coincida
    pago.pedido_id = pedido_id

    try:
        new_pago = service.create_pago(session, pago)
        return success_response(
            data=PagoRead.model_validate(new_pago),
            message="Pago creado exitosamente",
            status_code=201
        )
    except Exception as e:
        return error_response(message=f"Error al crear pago: {str(e)}", status_code=400)

@router.put("/{pedido_id}/pagos/{pago_id}")
def update_pago_pedido(
    pedido_id: int,
    pago_id: int,
    pago_update: PagoUpdate,
    session: Session = Depends(get_session)
) -> ApiResponse:
    """Actualiza un pago."""
    # Verificar que el pedido existe
    pedido = service.get_pedido_by_id(session, pedido_id)
    if not pedido:
        return error_response(message="Pedido no encontrado", status_code=404)

    # Obtener el pago
    db_pago = session.get(Pago, pago_id)
    if not db_pago or db_pago.pedido_id != pedido_id:
        return error_response(message="Pago no encontrado", status_code=404)

    try:
        updated_pago = service.update_pago(session, db_pago, pago_update.model_dump())
        return success_response(
            data=PagoRead.model_validate(updated_pago),
            message="Pago actualizado exitosamente"
        )
    except Exception as e:
        return error_response(message=f"Error al actualizar pago: {str(e)}", status_code=400)
