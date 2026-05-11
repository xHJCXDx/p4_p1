import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL database configuration
database_url = os.environ["DATABASE_URL"]

engine = create_engine(
    database_url,
    echo=False
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
