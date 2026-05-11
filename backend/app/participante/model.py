from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, JSON

class ParticipanteBase(SQLModel):
    nombre: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    edad: int = Field(ge=18, le=120)
    pais: str
    modalidad: str  # Presencial, Virtual, Híbrido
    tecnologias: List[str] = Field(default=[], sa_type=JSON)
    nivel: str  # Principiante, Intermedio, Avanzado
    aceptaTerminos: bool = Field(default=False)

class Participante(ParticipanteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
