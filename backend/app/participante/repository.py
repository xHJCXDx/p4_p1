from typing import List, Optional, Tuple
from datetime import datetime
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.participante.model import Participante


class ParticipanteRepository(BaseRepository[Participante]):
    """Repository for Participante entity with soft delete support"""

    def __init__(self, session: Session):
        super().__init__(session, Participante)

    def get_all(self, limit: int = 100, offset: int = 0) -> Tuple[List[Participante], int]:
        """Get all participantes (excluding soft-deleted) with pagination"""
        statement = select(Participante).where(Participante.deleted_at.is_(None)).offset(offset).limit(limit)
        items = self.session.exec(statement).all()

        # Count total (excluding soft-deleted)
        count_statement = select(Participante).where(Participante.deleted_at.is_(None))
        total = len(self.session.exec(count_statement).all())

        return items, total

    def get_by_id(self, participante_id: int) -> Optional[Participante]:
        """Get participante by ID (returns None if soft-deleted)"""
        participante = self.session.get(Participante, participante_id)
        if participante and participante.deleted_at is not None:
            return None
        return participante

    def get_by_email(self, email: str) -> Optional[Participante]:
        """Get participante by email"""
        statement = select(Participante).where(
            Participante.email == email,
            Participante.deleted_at.is_(None)
        )
        return self.session.exec(statement).first()

    def delete(self, db_participante: Participante) -> None:
        """Soft delete a participante"""
        db_participante.deleted_at = datetime.utcnow()
        self.session.add(db_participante)

    def flush(self) -> None:
        """Flush without committing"""
        self.session.flush()
