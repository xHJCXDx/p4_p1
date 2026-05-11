from sqlmodel import Session
from app.core.unit_of_work import BaseUnitOfWork
from app.participante.repository import ParticipanteRepository


class ParticipanteUnitOfWork(BaseUnitOfWork):
    """Unit of Work for Participante domain"""

    def __init__(self, session: Session):
        super().__init__(session)
        self.participantes = ParticipanteRepository(session)
