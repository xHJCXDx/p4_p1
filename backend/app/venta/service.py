from typing import List, Optional, Tuple
from datetime import datetime
from sqlmodel import Session
from app.venta.model import Pedido, DetallePedido, Pago, HistorialEstadoPedido
from app.venta.schema import PedidoCreate, PedidoUpdate, DetallePedidoCreate, PagoCreate
from app.venta.unit_of_work import VentaUnitOfWork
from app.core.constants import TRANSICIONES_PERMITIDAS


# ============ PEDIDO SERVICE ============
def get_all_pedidos(session: Session, limit: int = 10, offset: int = 0) -> Tuple[List[Pedido], int]:
    """Obtiene pedidos con paginación, excluyendo soft-deleted."""
    uow = VentaUnitOfWork(session)
    return uow.pedidos.get_all(limit, offset)


def get_pedido_by_id(session: Session, pedido_id: int) -> Optional[Pedido]:
    """Obtiene un pedido por ID, retorna None si está deleted o no existe."""
    uow = VentaUnitOfWork(session)
    return uow.pedidos.get_by_id(pedido_id)


def create_pedido(session: Session, pedido_data: PedidoCreate) -> Pedido:
    """Crea un nuevo pedido e inserta el primer registro en HistorialEstadoPedido."""
    uow = VentaUnitOfWork(session)
    new_pedido = Pedido.model_validate(pedido_data)
    pedido = uow.pedidos.create(new_pedido)
    uow.pedidos.flush()  # Asegura que get id antes de commit

    # Crear historial inicial (RN-02: estado_desde debe ser NULL en la creación)
    historial = HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado_desde=None,
        estado_hacia=pedido.estado_codigo,
        usuario_id=None,
        motivo=None
    )
    uow.historial.create(historial)
    uow.commit()
    session.refresh(pedido)
    return pedido


def update_pedido(session: Session, db_pedido: Pedido, pedido_data: PedidoUpdate) -> Pedido:
    """Actualiza un pedido (sin cambiar estado; usar transition_estado para eso)."""
    uow = VentaUnitOfWork(session)
    update_dict = pedido_data.model_dump(exclude_unset=True)
    updated = uow.pedidos.update(db_pedido, update_dict)
    uow.commit()
    session.refresh(updated)
    return updated


def delete_pedido(session: Session, db_pedido: Pedido):
    """Soft delete: marca con deleted_at."""
    uow = VentaUnitOfWork(session)
    uow.pedidos.delete(db_pedido)
    uow.commit()


def transition_estado(
    session: Session,
    pedido_id: int,
    nuevo_estado: str,
    usuario_id: Optional[int] = None,
    motivo: Optional[str] = None
) -> Pedido:
    """
    Realiza transición de estado con validaciones de FSM.
    RN-01: Valida si transición es permitida.
    RN-05: Valida motivo obligatorio si el nuevo estado es CANCELADO.
    """
    uow = VentaUnitOfWork(session)
    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise ValueError(f"Pedido {pedido_id} no encontrado")

    estado_actual = pedido.estado_codigo
    transiciones_validas = TRANSICIONES_PERMITIDAS.get(estado_actual, [])

    # Validación de transición
    if nuevo_estado not in transiciones_validas:
        raise ValueError(
            f"Transición no permitida: {estado_actual} → {nuevo_estado}. "
            f"Transiciones permitidas: {transiciones_validas}"
        )

    # RN-05: motivo obligatorio para CANCELADO
    if nuevo_estado == "CANCELADO" and not motivo:
        raise ValueError("Motivo obligatorio para cancelar un pedido")

    # Actualizar estado del pedido
    updated_pedido = uow.pedidos.update_estado(pedido, nuevo_estado)

    # Insertar en historial
    historial = HistorialEstadoPedido(
        pedido_id=pedido_id,
        estado_desde=estado_actual,
        estado_hacia=nuevo_estado,
        usuario_id=usuario_id,
        motivo=motivo
    )
    uow.historial.create(historial)
    uow.commit()
    session.refresh(updated_pedido)
    return updated_pedido


# ============ DETALLE PEDIDO SERVICE ============
def get_detalles_by_pedido(session: Session, pedido_id: int) -> List[DetallePedido]:
    """Obtiene todos los detalles de un pedido."""
    uow = VentaUnitOfWork(session)
    return uow.detalles.get_by_pedido(pedido_id)


def create_detalle_pedido(session: Session, detalle_data: DetallePedidoCreate) -> DetallePedido:
    """Crea un detalle de pedido (immutable después de creación)."""
    uow = VentaUnitOfWork(session)
    new_detalle = DetallePedido.model_validate(detalle_data)
    detalle = uow.detalles.create(new_detalle)
    uow.commit()
    session.refresh(detalle)
    return detalle


# ============ PAGO SERVICE ============
def get_pagos_by_pedido(session: Session, pedido_id: int) -> List[Pago]:
    """Obtiene todos los pagos de un pedido."""
    uow = VentaUnitOfWork(session)
    return uow.pagos.get_by_pedido(pedido_id)


def create_pago(session: Session, pago_data: PagoCreate) -> Pago:
    """Crea un registro de pago."""
    uow = VentaUnitOfWork(session)
    new_pago = Pago.model_validate(pago_data)
    pago = uow.pagos.create(new_pago)
    uow.commit()
    session.refresh(pago)
    return pago


def update_pago(session: Session, db_pago: Pago, pago_data: dict) -> Pago:
    """Actualiza un pago (para cambios de estado MP)."""
    uow = VentaUnitOfWork(session)
    update_dict = {k: v for k, v in pago_data.items() if v is not None}
    updated = uow.pagos.update(db_pago, update_dict)
    uow.commit()
    session.refresh(updated)
    return updated
