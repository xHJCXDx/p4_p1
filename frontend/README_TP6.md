# TP6 - Navegación con React Router + CRUD multipantalla

## Descripción General

Este proyecto implementa un sistema de gestión de participantes con navegación multipágina usando **React Router v6**, manteniendo la funcionalidad CRUD del TP5.

## Características Implementadas

### ✅ Navegación con React Router
- **Rutas implementadas:**
  - `/` → Listado de participantes (ListaPage)
  - `/nuevo` → Formulario para crear nuevo participante (FormularioPage)
  - `/editar/:id` → Edición de participante existente (EditarPage)

### ✅ Componentes por Página

#### 1. **NavBar** (Componente nuevo)
- Navegación superior responsive
- Menú burger para dispositivos móviles
- Enlaces a Listado y Nuevo Participante
- Animaciones suave en el menú

#### 2. **ListaPage** (`/`)
- Listado de todos los participantes
- Sistema de filtros (por nombre, modalidad, nivel)
- Tarjetas de participantes con botones:
  - **Editar**: navega a `/editar/:id`
  - **Eliminar**: elimina el participante directamente
- Contador de participantes filtrados
- Botón para resetear base de datos

#### 3. **FormularioPage** (`/nuevo`)
- Formulario para registrar nuevo participante
- Campos: nombre, email, edad, país, modalidad, tecnologías, nivel, términos
- Redirecciona a `/` después de guardar exitosamente
- Integrado con el contexto de participantes

#### 4. **EditarPage** (`/editar/:id`)
- Carga automáticamente los datos del participante
- Formulario pre-rellenado con datos existentes
- Permite modificar todos los campos
- Redirecciona a `/` después de actualizar
- Maneja errores si el participante no existe

### ✅ Menú Burger Responsive
- **Desktop (md+)**: Muestra botones alineados en la navbar
- **Mobile (< md)**: Menú hamburguesa que se expande/contrae
- Icono hamburguesa animado
- Se cierra automáticamente al hacer click en un enlace

### ✅ CRUD Funcional
- **Create**: Formulario en `/nuevo`
- **Read**: Listado y detalle en `/`
- **Update**: Edición en `/editar/:id`
- **Delete**: Botón eliminar en las tarjetas
- Integración con API REST en `http://localhost:3000/participantes`

## Cambios Respecto a TP5

| Aspecto | TP5 | TP6 |
|--------|-----|-----|
| **Estructura** | Todo en una sola página (Home) | Dividido en 3 páginas |
| **Navegación** | No hay navegación entre vistas | React Router con 3 rutas |
| **Edición** | Modal/inline en la misma página | Página dedicada `/editar/:id` |
| **NavBar** | No existe | Menú burger responsive |
| **Context** | ParticipantesContext básico | Agregado `participanteSeleccionado` y `seleccionar()` |
| **Componentes** | ParticipanteCard con props `onEdit`/`onDelete` | ParticipanteCard con `useNavigate` integrado |

## Stack Tecnológico

```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^6.x",
    "tailwindcss": "^4.2.2"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.4",
    "eslint": "^9.39.4"
  }
}
```

## Estructura de Carpetas

```
src/
├── components/
│   ├── NavBar.tsx (NUEVO)
│   ├── ParticipanteCard.tsx (modificado)
│   ├── Formulario.tsx (modificado)
│   └── Filtros.tsx
├── pages/
│   ├── ListaPage.tsx (NUEVO - reemplaza Home)
│   ├── FormularioPage.tsx (NUEVO)
│   ├── EditarPage.tsx (NUEVO)
│   └── Home.tsx (antiguo, no usado)
├── context/
│   └── ParticipantesContext.tsx (modificado)
├── models/
│   └── Participante.ts
├── App.tsx (modificado - ahora define rutas)
├── main.tsx (modificado - BrowserRouter + ParticipantesProvider)
└── index.css
```

## Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar ESLint
npm run lint

# Preview de build producción
npm run preview
```

## Cómo Usar

### Instalar dependencias
```bash
cd frontend
npm install
```

### Ejecutar en desarrollo
```bash
npm run dev
```
El proyecto estará disponible en `http://localhost:5173`

### Asegurar que el backend esté corriendo
```bash
# En otra terminal, en la carpeta backend
npm run dev
```
El backend debe escuchar en `http://localhost:3000`

## Funcionalidades Clave

### 1. Navegación Entre Vistas
```tsx
// NavBar usa Link
<Link to="/nuevo">Nuevo Participante</Link>

// ParticipanteCard usa navigate
navigate(`/editar/${participante.id}`)
```

### 2. Parámetros en URL
```tsx
// EditarPage extrae el id de la URL
const { id } = useParams<{ id: string }>()
```

### 3. Selección de Participante
```tsx
// Context ahora mantiene participanteSeleccionado
const { participanteSeleccionado, seleccionar } = useParticipantes()

// Al entrar a /editar/:id, se selecciona automáticamente
useEffect(() => {
  const participante = participantes.find(p => p.id === Number(id))
  if (participante) {
    seleccionar(participante)
  }
}, [id])
```

### 4. Callback onSuccess
```tsx
// Las páginas redirigen después de guardar
<Formulario 
  onAgregar={agregar}
  onSuccess={() => navigate("/")}
/>
```

## Notas Importantes

- ✅ **TypeScript Strict**: Proyecto con `strict: true`
- ✅ **ESLint**: Validación automática de código
- ✅ **Tailwind CSS**: Diseño responsive
- ✅ **React 19**: Última versión de React
- ✅ **Vite**: Fast refresh HMR activo durante desarrollo
- ⚠️ **API Rest requerida**: Backend en `http://localhost:3000`

## Próximos Pasos (TP7)

Posibles mejoras para trabajos futuros:
- Agregar paginación al listado
- Implementar búsqueda en tiempo real
- Agregar validación de formularios mejorada
- Implementar notificaciones toast
- Agregar loading states y skeletons
- Implementar lazy loading de rutas
- Testing E2E con Cypress/Playwright
