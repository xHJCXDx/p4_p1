from typing import List, Optional, Tuple
from datetime import datetime
from sqlmodel import Session
from app.participante.model import Participante
from app.participante.schema import ParticipanteCreate, ParticipanteUpdate
from app.participante.unit_of_work import ParticipanteUnitOfWork


def get_all(session: Session, limit: int = 100, offset: int = 0) -> Tuple[List[Participante], int]:
    """Get all participantes (excluding soft-deleted) with pagination"""
    uow = ParticipanteUnitOfWork(session)
    return uow.participantes.get_all(limit, offset)


def get_by_id(session: Session, participante_id: int) -> Optional[Participante]:
    """Get participante by ID (returns None if soft-deleted)"""
    uow = ParticipanteUnitOfWork(session)
    return uow.participantes.get_by_id(participante_id)


def get_by_email(session: Session, email: str) -> Optional[Participante]:
    """Get participante by email"""
    uow = ParticipanteUnitOfWork(session)
    return uow.participantes.get_by_email(email)


def create(session: Session, participante_data: ParticipanteCreate) -> Participante:
    """Create a new participante"""
    uow = ParticipanteUnitOfWork(session)
    db_participante = Participante.model_validate(participante_data)
    participante = uow.participantes.create(db_participante)
    uow.commit()
    session.refresh(participante)
    return participante


def update(session: Session, db_participante: Participante, participante_data: ParticipanteUpdate) -> Participante:
    """Update a participante"""
    uow = ParticipanteUnitOfWork(session)
    participante_dict = participante_data.model_dump(exclude_unset=True)

    # Actualizar timestamp
    participante_dict["updated_at"] = datetime.utcnow()

    updated = uow.participantes.update(db_participante, participante_dict)
    uow.commit()
    session.refresh(updated)
    return updated


def delete(session: Session, db_participante: Participante):
    """Soft delete a participante"""
    uow = ParticipanteUnitOfWork(session)
    uow.participantes.delete(db_participante)
    uow.commit()
