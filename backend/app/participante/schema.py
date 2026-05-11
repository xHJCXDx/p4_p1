from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel
from app.participante.model import ParticipanteBase

class ParticipanteCreate(ParticipanteBase):
    pass

class ParticipanteRead(ParticipanteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

class ParticipanteUpdate(SQLModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    edad: Optional[int] = None
    pais: Optional[str] = None
    modalidad: Optional[str] = None
    tecnologias: Optional[List[str]] = None
    nivel: Optional[str] = None
    aceptaTerminos: Optional[bool] = None
