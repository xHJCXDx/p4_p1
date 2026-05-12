from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from app.core.database import create_db_and_tables, engine
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router
from app.ingrediente.router import router as ingrediente_router
from app.venta.router import router as venta_router
from app.catalogo.service import seed_catalogos

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # Seed catálogos (FormaPago, EstadoPedido)
    with Session(engine) as session:
        seed_catalogos(session)
    yield

app = FastAPI(lifespan=lifespan)

# Configuración de CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)
app.include_router(venta_router)

@app.get("/")
def read_root():
    return {"message": "API de Productos y Categorías"}
