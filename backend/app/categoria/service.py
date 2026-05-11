from typing import List, Optional, Tuple
from datetime import datetime
from sqlmodel import Session
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate
from app.categoria.unit_of_work import CategoriaUnitOfWork


def get_all(session: Session, limit: int = 100, offset: int = 0) -> Tuple[List[Categoria], int]:
    """Get all categorias (excluding soft-deleted) with pagination"""
    uow = CategoriaUnitOfWork(session)
    return uow.categorias.get_all(limit, offset)


def get_by_id(session: Session, categoria_id: int) -> Optional[Categoria]:
    """Get categoria by ID (returns None if soft-deleted)"""
    uow = CategoriaUnitOfWork(session)
    return uow.categorias.get_by_id(categoria_id)


def create(session: Session, categoria_data: CategoriaCreate) -> Categoria:
    """Create a new categoria"""
    uow = CategoriaUnitOfWork(session)
    db_categoria = Categoria.model_validate(categoria_data)
    categoria = uow.categorias.create(db_categoria)
    uow.commit()
    session.refresh(categoria)
    return categoria


def update(session: Session, db_categoria: Categoria, categoria_data: CategoriaUpdate) -> Categoria:
    """Update a categoria"""
    uow = CategoriaUnitOfWork(session)
    categoria_dict = categoria_data.model_dump(exclude_unset=True)
    # Actualizar timestamp
    categoria_dict["updated_at"] = datetime.utcnow()
    updated = uow.categorias.update(db_categoria, categoria_dict)
    uow.commit()
    session.refresh(updated)
    return updated


def delete(session: Session, db_categoria: Categoria):
    """Soft delete a categoria"""
    uow = CategoriaUnitOfWork(session)
    uow.categorias.delete(db_categoria)
    uow.commit()
