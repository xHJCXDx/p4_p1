from typing import TypeVar, Generic, List, Optional, Type
from sqlmodel import Session, select

T = TypeVar('T')


class BaseRepository(Generic[T]):
    """Base repository class for all entities"""

    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_all(self, limit: int = 100, offset: int = 0) -> tuple[List[T], int]:
        """Get all entities with pagination"""
        statement = select(self.model).offset(offset).limit(limit)
        items = self.session.exec(statement).all()

        # Count total
        count_statement = select(self.model)
        total = len(self.session.exec(count_statement).all())

        return items, total

    def get_by_id(self, entity_id: int) -> Optional[T]:
        """Get entity by ID"""
        return self.session.get(self.model, entity_id)

    def create(self, obj_in: T) -> T:
        """Create a new entity"""
        self.session.add(obj_in)
        return obj_in

    def update(self, db_obj: T, obj_in: dict) -> T:
        """Update an entity"""
        obj_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        db_obj.sqlmodel_update(obj_data)
        self.session.add(db_obj)
        return db_obj

    def delete(self, db_obj: T) -> None:
        """Delete an entity"""
        self.session.delete(db_obj)

    def commit(self) -> None:
        """Commit transaction"""
        self.session.commit()

    def rollback(self) -> None:
        """Rollback transaction"""
        self.session.rollback()
