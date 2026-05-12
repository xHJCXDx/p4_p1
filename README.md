# TP Integrador - Programación IV (U5)

## Proyecto Full Stack: React + TypeScript + FastAPI

## Requisitos Previos

- Python 3.8+
- Node.js 18+
- npm

## Estructura del Proyecto

```
p4_b_tp5/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── core/          # Configuración central (database, response)
│   │   ├── categoria/     # Módulo de categorías (router, service, schema, model)
│   │   ├── producto/      # Módulo de productos (router, service, schema, model)
│   │   ├── ingrediente/   # Módulo de ingredientes (router, service, schema, model)
│   │   └── main.py        # Aplicación principal
│   ├── requirements.txt
│   └── api.http          # Archivo REST Client para pruebas
│
└── frontend/         # Aplicación React + TypeScript
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── pages/        # CategoriasPage, ProductsPage, IngredientesPage
    │   ├── types/        # Tipos TypeScript (Categoria, Producto, Ingrediente)
    │   └── App.tsx       # Router principal con React Router
    ├── package.json
    └── vite.config.ts
```

## Instalación y Ejecución

### Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv .venv

# En macOS/Linux:
source .venv/bin/activate

# En Windows:
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
fastapi dev main.py
```

El servidor estará disponible en `http://localhost:8000`
- Documentación interactiva: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Modelo de Datos (Conforme ERD - Dominio 2)

### **Tabla: Producto**
- `id` (BIGINT, PK)
- `nombre` (VARCHAR(150), NN, Indexed)
- `descripcion` (TEXT)
- `precio_base` (DECIMAL(10,2), NN, CHECK >= 0)
- `imagenes_url` (JSON Array)
- `stock_cantidad` (INTEGER, NN, DEFAULT 0, CHECK >= 0)
- `disponible` (BOOLEAN, NN, DEFAULT true)
- `created_at` (TIMESTAMPTZ, NN)
- `updated_at` (TIMESTAMPTZ, NN)
- `deleted_at` (TIMESTAMPTZ, nullable) ← Soft Delete

### **Tabla: Categoria**
- `id` (BIGINT, PK)
- `parent_id` (BIGINT, FK -> Categoria.id, nullable) ← Jerarquía/Auto-referencia
- `nombre` (VARCHAR(100), NN, UNIQUE)
- `descripcion` (TEXT)
- `imagen_url` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, NN)
- `updated_at` (TIMESTAMPTZ, NN)
- `deleted_at` (TIMESTAMPTZ, nullable) ← Soft Delete

### **Tabla: Ingrediente**
- `id` (BIGINT, PK)
- `nombre` (VARCHAR(100), NN, UNIQUE, Indexed)
- `descripcion` (TEXT)
- `es_alergeno` (BOOLEAN, NN, DEFAULT false)
- `created_at` (TIMESTAMPTZ, NN)
- `updated_at` (TIMESTAMPTZ, NN)

### **Tabla: ProductoCategoria** (Many-to-Many)
- `producto_id` (BIGINT, PK, FK -> Producto.id)
- `categoria_id` (BIGINT, PK, FK -> Categoria.id)
- `es_principal` (BOOLEAN, NN, DEFAULT false)
- `created_at` (TIMESTAMPTZ, NN)

### **Tabla: ProductoIngrediente** (Many-to-Many)
- `producto_id` (BIGINT, PK, FK -> Producto.id)
- `ingrediente_id` (BIGINT, PK, FK -> Ingrediente.id)
- `es_removible` (BOOLEAN, NN, DEFAULT false)

---

## Características Implementadas

### Backend (FastAPI)

✅ **CRUD Categorías**
- `GET /categorias?limit=10&offset=0` - Listar con paginación
- `GET /categorias/{id}` - Obtener por ID
- `POST /categorias` - Crear nueva
- `PUT /categorias/{id}` - Actualizar
- `DELETE /categorias/{id}` - Soft delete

✅ **CRUD Productos**
- `GET /productos?limit=10&offset=0` - Listar con paginación
- `GET /productos/{id}` - Obtener por ID
- `POST /productos` - Crear nuevo
- `PUT /productos/{id}` - Actualizar
- `DELETE /productos/{id}` - Soft delete

✅ **CRUD Ingredientes** _(Nuevo en U5)_
- `GET /ingredientes?limit=10&offset=0` - Listar con paginación
- `GET /ingredientes/{id}` - Obtener por ID
- `POST /ingredientes` - Crear nuevo
- `PUT /ingredientes/{id}` - Actualizar
- `DELETE /ingredientes/{id}` - Hard delete (sin soft delete)

✅ **Catálogos** _(Nuevo en U5)_
- **FormaPago**: MERCADOPAGO, EFECTIVO, TRANSFERENCIA (seed automático)
- **EstadoPedido**: PENDIENTE, CONFIRMADO, EN_PREP, EN_CAMINO, ENTREGADO, CANCELADO (seed automático)

✅ **CRUD Pedidos** _(Nuevo en U5)_
- `GET /pedidos?limit=10&offset=0` - Listar con paginación
- `GET /pedidos/{id}` - Obtener por ID
- `POST /pedidos` - Crear nuevo pedido
- `PUT /pedidos/{id}` - Actualizar pedido (notas, costo_envio, etc)
- `DELETE /pedidos/{id}` - Soft delete
- `POST /pedidos/{id}/transition-estado` - Transicionar estado (con validación FSM)
- `GET /pedidos/{id}/detalles` - Obtener detalles del pedido
- `POST /pedidos/{id}/detalles` - Agregar detalle a pedido
- `GET /pedidos/{id}/pagos` - Obtener pagos
- `POST /pedidos/{id}/pagos` - Registrar pago (MercadoPago)
- `PUT /pedidos/{id}/pagos/{pago_id}` - Actualizar pago

✅ **Características Técnicas**
- **Paginación**: Query params `limit` (1-100, default 10) y `offset` (default 0)
- **Respuestas estandarizadas**: `{ success, message, data, status_code }`
- **Soft Delete**: Registros marcados con `deleted_at` en lugar de borrados (excepto Ingredientes)
- **Auditoría**: `created_at`, `updated_at`, `deleted_at` en todas las tablas
- **Relaciones**: Many-to-Many (Producto ↔ Categoría, Producto ↔ Ingrediente), Auto-referencia (Categoría)
- **CORS**: Configurado para localhost:5173
- **Docs automáticos**: Swagger en /docs
- **FSM (Finite State Machine)**: Validación automática de transiciones de estado en Pedidos
- **Snapshots**: Copias immutables de precio y nombre en DetallePedido para integridad histórica
- **Seed automático**: FormaPago y EstadoPedido se crean al iniciar la aplicación

### Frontend (React + TypeScript)

**Routing con React Router**
- `/categorias` - Página de Categorías
- `/productos` - Página de Productos
- `/ingredientes` - Página de Ingredientes _(Nuevo en U5)_
- `/pedidos` - Página de Pedidos _(Nuevo en U5)_
- Redirección automática `/` → `/categorias`

**CategoriasPage**
- useState para estado local (categorías, modal, selección)
- useEffect para cargar datos al montar
- Fetch nativo con paginación
- Modal para crear/editar
- Lista con botones editar/eliminar
- Manejo de errores y loading

**ProductsPage**
- Estructura similar a CategoriasPage
- Grid responsivo de productos
- Formulario integrado en modal
- Campos: nombre, descripción, precio, imágenes (array), stock, disponibilidad

**IngredientesPage** _(Nuevo en U5)_
- Grid responsivo de ingredientes
- Indicadores visuales para alergenos (⚠️ o ✓)
- CRUD completo con modal
- Manejo de propiedades: es_alergeno

**PedidosPage** _(Nuevo en U5)_
- Tabla responsiva con listado de pedidos
- Badges de estado con colores distintivos (PENDIENTE, CONFIRMADO, EN_PREP, etc)
- Información: usuario, estado, total, forma de pago
- Modal para crear nuevo pedido
- Manejo de paginación

**Navbar actualizado**
- Links de navegación (Categorías / Productos / Ingredientes / Pedidos)
- Título actualizado: "TP Programación IV - U5"
- Estilos hover y animaciones

**Diseño con Tailwind CSS**
- Componentes responsivos
- Tema profesional blue/gray
- Validación en formularios

---

## Estructura de Respuestas

### Respuesta exitosa con paginación:
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": {
    "items": [...],
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
  "message": "Categoría no encontrada",
  "data": null,
  "status_code": 404
}
```

---

## Pruebas de la API

Usa el archivo `backend/api.http` para probar los endpoints con:
- **Visual Studio Code**: Extensión "REST Client" (REST Client Extension)
- **Postman**: Importar y ejecutar
- **Insomnia**: Importar y ejecutar

Incluye ejemplos de:
- CRUD de Categorías (con parent_id para subcategorías)
- CRUD de Productos (con imagenes_url array y stock_cantidad)
- Paginación (limit y offset)
- Soft deletes

---

## Notas Importantes

### Base de Datos
- SQLite en memoria (desarrollo)
- Fácilmente configurable a PostgreSQL en `app/core/database.py`

### Frontend
- Conecta automáticamente a `http://localhost:8000`
- Manejo de respuestas estandarizadas con paginación
- HMR (Hot Module Reload) habilitado con Vite

### Backend
- FastAPI dev mode con auto-reload
- Validación con Pydantic
- Documentación automática en `/docs`

### Auditoría y Soft Deletes
- Los registros **nunca se borran físicamente**
- El campo `deleted_at` marca la eliminación lógica
- Todas las queries filtran automáticamente `deleted_at IS NULL`
- Útil para reportes y auditoría

### Jerarquía de Categorías
- Campo `parent_id` permite categorías padre/hijas
- Auto-referencia en la tabla Categoria
- Ejemplo: "Alimentos" (padre) → "Bebidas" (hija)

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | FastAPI | 0.100+ |
| **BD** | SQLModel / SQLAlchemy | 2.0+ |
| **Frontend** | React | 18.2+ |
| **Router** | React Router | 6.20+ |
| **Tipos** | TypeScript | 5.2+ |
| **Estilos** | Tailwind CSS | 3.4+ |
| **Build** | Vite | 8.0+ |

