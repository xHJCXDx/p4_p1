# P4_P2 - PROYECTO EN MARCHA ✅

**Fecha**: 2026-05-23  
**Estado**: Sistema operacional - listo para desarrollo

---

## 🚀 ACCESO RÁPIDO

| Servicio | URL | Estado |
|----------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Corriendo |
| **Backend API** | http://localhost:8000 | ✅ Corriendo |
| **API Docs (Swagger)** | http://localhost:8000/docs | ✅ Disponible |
| **ReDoc** | http://localhost:8000/redoc | ✅ Disponible |

---

## 📊 ESTADO DEL SISTEMA

```
✅ Backend:    FastAPI + SQLModel (Python 3.14)
✅ Frontend:   React 18 + TypeScript + Vite (Node 26)
✅ Base Datos: SQLite (desarrollo) / PostgreSQL (producción)
✅ Auth:       JWT + Cookies HttpOnly + Roles
```

### Datos de Seed Iniciales

- **4 Categorías** (Bebidas, Alimentos, etc.)
- **7 Productos** (Coca Cola, Fanta, etc.)
- **10 Ingredientes** (Azúcar, Agua, etc.)

---

## 🔑 AUTENTICACIÓN

### Registrar Usuario

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tu Nombre",
    "email": "tu@email.com",
    "password": "TuPassword123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "tu@email.com",
    "password": "TuPassword123!"
  }'
```

---

## 📡 ENDPOINTS DISPONIBLES

### Categorías
- `GET /api/v1/categorias/` — Listar con paginación
- `GET /api/v1/categorias/{id}` — Obtener por ID
- `POST /api/v1/categorias/` — Crear (requiere auth)
- `PUT /api/v1/categorias/{id}` — Actualizar (requiere auth)
- `DELETE /api/v1/categorias/{id}` — Soft delete (requiere auth)

### Productos
- `GET /api/v1/productos/` — Listar
- `GET /api/v1/productos/{id}` — Obtener
- `POST /api/v1/productos/` — Crear (requiere auth)
- `PUT /api/v1/productos/{id}` — Actualizar (requiere auth)
- `DELETE /api/v1/productos/{id}` — Soft delete (requiere auth)

### Ingredientes
- `GET /api/v1/ingredientes/` — Listar
- `GET /api/v1/ingredientes/{id}` — Obtener
- `POST /api/v1/ingredientes/` — Crear (requiere auth)
- `PUT /api/v1/ingredientes/{id}` — Actualizar (requiere auth)
- `DELETE /api/v1/ingredientes/{id}` — Hard delete (requiere auth)

### Pedidos
- `GET /api/v1/pedidos/` — Listar
- `POST /api/v1/pedidos/` — Crear pedido (requiere auth)
- `PUT /api/v1/pedidos/{id}` — Actualizar
- `POST /api/v1/pedidos/{id}/detalles` — Agregar ítems
- `POST /api/v1/pedidos/{id}/pagos` — Registrar pago
- `POST /api/v1/pedidos/{id}/transition-estado` — Cambiar estado

---

## 🎯 PRÓXIMOS PASOS

1. **Abrir Frontend**
   ```
   http://localhost:5173
   ```
   - Registrarse o login
   - Probar CRUD en UI
   - Navegar entre Categorías, Productos, Ingredientes, Pedidos

2. **Explorar API**
   ```
   http://localhost:8000/docs
   ```
   - Ver documentación interactiva
   - Probar endpoints desde Swagger UI
   - Copiar ejemplos de curl

3. **Revisar Código Backend**
   ```
   backend/app/
   ├── categoria/       # CRUD categorías
   ├── producto/        # CRUD productos
   ├── ingrediente/     # CRUD ingredientes
   ├── venta/          # CRUD pedidos/pagos
   ├── usuario/        # Auth y usuarios
   ├── direccion/      # Direcciones de entrega
   ├── core/           # Config, DB, Security
   └── admin/          # Panel admin
   ```

4. **Revisar Código Frontend**
   ```
   frontend/src/
   ├── pages/          # Páginas completas
   ├── components/     # Componentes reutilizables
   ├── types/          # Tipos TypeScript
   ├── store/          # Estado global (Zustand)
   ├── api/            # Cliente HTTP (Axios)
   └── App.tsx         # Rutas principales
   ```

---

## 🐛 PROBLEMAS CONOCIDOS

**Ninguno identificado en esta sesión.**

El sistema está completamente funcional. Si encuentras algún problema:

1. Revisar logs del backend: `/tmp/backend.log`
2. Revisar logs del frontend: `/tmp/frontend.log`
3. Verificar que los puertos 8000 y 5173 estén libres

---

## 📝 NOTAS IMPORTANTES

- **Soft Deletes**: Productos y Categorías se marcan como eliminados, no se borran (campo `deleted_at`)
- **Auditoría**: Todos los registros tienen `created_at` y `updated_at`
- **Seguridad**: Contraseñas hasheadas con bcrypt (cost factor 12)
- **CORS**: Configurado para localhost:5173
- **JWT**: Token expira en 30 minutos (configurable en `core/database.py`)

---

## 🔗 REFERENCIAS

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [SQLModel](https://sqlmodel.tiangolo.com)
- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)

---

**Última actualización**: 2026-05-23 00:30  
**Proximo paso**: Pruebas desde el frontend
