# P4 Backend + Frontend

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | FastAPI | 0.100+ |
| **BD** | SQLModel / SQLAlchemy | 2.0+ |
| **Frontend** | React | 19.2+ |
| **Router** | React Router | 7.14+ |
| **Tipos** | TypeScript | ~6.0+ |
| **Estilos** | Tailwind CSS | 4.2+ |
| **Build** | Vite | 8.0+ |

## Estructura del Proyecto

```
p4_b_p1/
├── backend/
│   ├── app/
│   │   ├── core/               # Configuración central (database, response)
│   │   ├── categoria/          # CRUD Categorías
│   │   ├── producto/           # CRUD Productos
│   │   ├── ingrediente/        # CRUD Ingredientes
│   │   ├── venta/              # CRUD Ventas/Pedidos
│   │   ├── participante/       # CRUD Participantes + Login
│   │   ├── catalogo/           # Catálogos (FormaPago, EstadoPedido)
│   │   └── main.py             # Aplicación principal (FastAPI)
│   ├── requirements.txt
│   ├── api.http                # Ejemplos REST Client
│   └── database.db             # SQLite (auto-generado)
│
└── frontend/
    ├── src/
    │   ├── components/         # Componentes reutilizables
    │   ├── pages/             # Pages (ListaPage, FormularioPage, EditarPage, LoginPage)
    │   ├── context/           # AuthContext, ParticipantesContext
    │   ├── models/            # Tipos TypeScript (Participante)
    │   ├── reducers/          # Reducers para state management
    │   ├── routes/            # PrivateRoute para proteger rutas
    │   └── App.tsx            # Router principal
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Requisitos Previos

- **Python 3.8+**
- **Node.js 18+**
- **npm** o **yarn**

## Instalación y Ejecución

### 1. Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate

# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor (puerto 8000)
fastapi dev app/main.py
```

 Servidor disponible en: `http://localhost:8000`
-  Documentación interactiva: `http://localhost:8000/docs`

#### Configuración Opcional: PostgreSQL

Por defecto usa SQLite. Para PostgreSQL:

1. **Crear base de datos**:
   ```bash
   psql -U postgres
   CREATE DATABASE p4_p1;
   \q
   ```

2. **Crear archivo `.env`** en `backend/`:
   ```
   USE_POSTGRES=true
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=p4_p1
   ```

3. **Reiniciar servidor**: `fastapi dev app/main.py`

### 2. Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar dev server (puerto 5173)
npm run dev
```

Aplicación disponible en: `http://localhost:5173`

---

## Credenciales de Demo

Usa estas credenciales para hacer login:

| Usuario | Contraseña | Rol    |
|---------|-----------|--------|
| admin   | admin123  | ADMIN  |
| user    | user123   | CONSULTA |

> **Nota**: Las credenciales están hardcodeadas para demo. En producción, usar base de datos + JWT.

---

## API Endpoints

### Autenticación

```
POST /login
  Request: { "username": "admin", "password": "admin123" }
  Response: { "token": "bearer_...", "user": { "id": 1, "username": "admin", "rol": "ADMIN" } }
```

### Participantes

```
GET    /participantes?limit=10&offset=0    # Listar con paginación
GET    /participantes/{id}                 # Obtener por ID
POST   /participantes                      # Crear nuevo
PUT    /participantes/{id}                 # Actualizar
DELETE /participantes/{id}                 # Eliminar (soft delete)
DELETE /participantes                      # Eliminar todos
```

**Campos de Participante**:
- `id`: integer
- `nombre`: string
- `email`: string (único)
- `edad`: integer (18-120)
- `pais`: string
- `modalidad`: "Presencial" | "Virtual" | "Híbrido"
- `tecnologias`: ["React", "Angular", "Vue", "Node", "Python", "Java"] (array)
- `nivel`: "Principiante" | "Intermedio" | "Avanzado"
- `aceptaTerminos`: boolean
- `created_at`, `updated_at`, `deleted_at`: datetime

### Otros Módulos (Existentes)

```
GET    /categorias?limit=10&offset=0
GET    /productos?limit=10&offset=0
GET    /ingredientes?limit=10&offset=0
GET    /ventas?limit=10&offset=0
```

(Misma estructura: GET by ID, POST create, PUT update, DELETE soft-delete)

---

## Estructura de Respuestas API

### Respuesta exitosa:
```json
{
  "success": true,
  "message": "Participantes obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "edad": 25,
        "pais": "Argentina",
        "modalidad": "Virtual",
        "tecnologias": ["React", "Python"],
        "nivel": "Intermedio",
        "aceptaTerminos": true,
        "created_at": "2025-05-03T10:30:00",
        "updated_at": "2025-05-03T10:30:00",
        "deleted_at": null
      }
    ],
    "total": 15,
    "limit": 10,
    "offset": 0
  },
  "status_code": 200
}
```

### Respuesta de error:
```json
{
  "success": false,
  "message": "Participante no encontrado",
  "data": null,
  "status_code": 404
}
```

---

## Frontend: Funcionalidades

### Sistema de Autenticación

- **LoginPage**: Formulario de login con validación
- **AuthContext**: Maneja `user`, `token`, `login()`, `logout()`
- **PrivateRoute**: Componente que protege rutas requiriendo autenticación y rol

### Gestión de Participantes

- **ListaPage**: Tabla de participantes con búsqueda/filtros
- **FormularioPage**: Crear nuevo participante (solo ADMIN)
- **EditarPage**: Editar participante existente (solo ADMIN)
- **ParticipantesContext**: Maneja CRUD con `useReducer`
- **useParticipantes()**: Hook personalizado para acceder al contexto

### Diseño

- **Tailwind CSS 4.2**: Utilidades para estilos responsivos
- **NavBar**: Navegación con links y logout
- **Componentes reutilizables**: Filtros, Formularios, Cards
- **Tema**: Profesional blue/gray con animaciones suaves

---

## Desarrollo

### Agregar un nuevo endpoint

1. **Crear modelo** (`app/nuevo_modulo/model.py`):
   ```python
   from sqlmodel import Field, SQLModel
   
   class Nuevo(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       nombre: str
   ```

2. **Crear schema** (`app/nuevo_modulo/schema.py`):
   ```python
   class NuevoCreate(NuevoBase): pass
   class NuevoRead(NuevoBase): id: int
   ```

3. **Crear repository** (`app/nuevo_modulo/repository.py`)
4. **Crear service** (`app/nuevo_modulo/service.py`)
5. **Crear unit_of_work** (`app/nuevo_modulo/unit_of_work.py`)
6. **Crear router** (`app/nuevo_modulo/router.py`)
7. **Registrar en main.py**:
   ```python
   from app.nuevo_modulo.router import router as nuevo_router
   app.include_router(nuevo_router)
   ```

### Consumir API desde Frontend

```typescript
// Usar el contexto de Participantes
const { participantes, agregar, editar, eliminar } = useParticipantes()

// O usar fetch directo
const response = await fetch('http://localhost:8000/participantes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## CORS Configuration

El CORS está configurado para `localhost:5173` en `app/main.py`:

```python
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
```

**Para producción**, actualizar `origins` a dominios reales.

---

## Troubleshooting

### Frontend no conecta con Backend

Verificar:
- Backend corriendo: `http://localhost:8000/docs`
- CORS configurado correctamente
- DevTools → Network → Ver requests y errores

### Error de base de datos

Solución:
```bash
cd backend
rm database.db
fastapi dev app/main.py
```

### Puertos ocupados

```bash
# Verificar puerto 8000 (backend)
lsof -i :8000        # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Verificar puerto 5173 (frontend)
lsof -i :5173        # macOS/Linux
```

### Módulo no encontrado (Python)

```bash
pip install -r requirements.txt
```

### npm dependencies no instalan

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Notas

### Seguridad (Para Producción)

- Usar **JWT tokens** en lugar de bearer simple
- Hashear contraseñas con **bcrypt**
- Implementar **refresh tokens**
- Validar headers **CORS** estrictamente
- Usar **HTTPS**
- Guardar secrets en variables de entorno (`.env`)

### Base de Datos

- **SQLite**: Perfecta para desarrollo (archivo `database.db`)
- **PostgreSQL**: Recomendado para producción
- Soft deletes: Los registros se marcan con `deleted_at`, nunca se borran

### Deployment

- Backend: Heroku, Railway, DigitalOcean (con Gunicorn)
- Frontend: Vercel, Netlify (build → `npm run build`)

---

## Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Vite Documentation](https://vite.dev)
- [React Router v7](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)

