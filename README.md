# UniclouD – Sistema de Gestión de Material Académico

## Descripción General

UniclouD es una plataforma web moderna diseñada para facilitar la organización, distribución y gestión de material académico en instituciones educativas. El sistema implementa un control de acceso basado en roles (admin / usuario normal) con una interfaz intuitiva y responsiva.

---

## 📋 Características Principales

### 1. **Interfaz Principal Rediseñada**

El dashboard ha sido rediseñado como un **panel central dinámico** que funciona sin recargas de página:

- **Header Fijo**: Contiene el logo de UniclouD, indicador del rol actual del usuario y selector de rol (para pruebas).
- **Sidebar Lateral**: Menú de navegación dinámico que muestra opciones según el rol del usuario.
  - En móvil: menú colapsable con botón hamburguesa.
  - En escritorio: sidebar fijo visible.
- **Área Central**: Contenido que cambia dinámicamente al seleccionar opciones del menú sin recargar la página.
- **Footer Fijo**: Con información del sistema.

### 2. **Diferenciación por Roles**

La aplicación adapta completamente la interfaz según el rol del usuario:

#### **Rol: Administrador (admin)**
Acceso a todas las funciones:
- **Universidades**: Crear, editar, eliminar y consultar universidades.
- **Profesores**: Registrar, editar, eliminar y consultar profesores.
- **Asignaturas**: Gestionar, editar y eliminar asignaturas.
- **Subir Material**: Cargar material académico con metadatos (título, año, universidad, asignatura, profesor).
- **Buscar Material**: Consultar, filtrar y descargar material; con panel admin visible.

#### **Rol: Usuario (user)**
Funciones limitadas de lectura y consulta:
- **Buscar Material**: Consultar, filtrar y descargar material académico.
- **Asignaturas**: Visualizar listado (solo lectura).
- **Profesores**: Visualizar listado (solo lectura).
- Opciones administrativas (crear, editar, eliminar) ocultas.
- Formulario de subida de archivos no disponible.

### 3. **Búsqueda y Filtrado Mejorados**

En la sección **Buscar Material Académico**:

- **Barra de Búsqueda Visible**: Campo de texto con icono de lupa en la parte superior del contenido.
- **Botón Filtros**: Despliega un modal lateral (FilterModal) con opciones de filtrado:
  - Universidad
  - Asignatura
  - Profesor
  - Año
- **Actualización en Tiempo Real**: Los resultados se actualizan sin refrescar la página completa.
- **Indicador Admin**: Los administradores ven un badge "Panel Admin" indicando opciones adicionales de gestión.

### 4. **Colores Institucionales**

El sistema utiliza una paleta de colores institucionales:

- **Rojo Primario** (`bg-red-700`): Header, sidebar, botones principales, footer.
- **Amarillo Secundario** (`bg-yellow-500`): Botones de acción secundaria, acentos visuales.
- **Gris Neutro** (`bg-gray-900`, `bg-gray-50`): Fondos y contrastes.

---

## 🏗️ Estructura de Componentes

### Componentes Nuevos

```
src/
├── components/
│   ├── Sidebar.jsx           # Menú lateral dinámico
│   ├── SearchBar.jsx          # Barra de búsqueda con icono
│   ├── FilterModal.jsx        # Modal flotante de filtros
│   ├── Alert.jsx              # Alertas (success, error, info)
│   └── DashboardCard.jsx      # Tarjetas del dashboard
├── pages/
│   ├── Dashboard.jsx          # Panel principal mejorado
│   ├── UniversidadesPage.jsx  # Gestión de universidades
│   ├── ProfesoresPage.jsx     # Gestión de profesores
│   ├── AsignaturasPage.jsx    # Gestión de asignaturas
│   ├── SubirMaterialPage.jsx  # Subida de material (admin)
│   └── BuscarMaterialPage.jsx # Búsqueda y filtrado
├── services/
│   ├── universidadService.js
│   ├── profesorService.js
│   ├── asignaturaService.js
│   └── materialService.js
└── App.jsx                    # Layout principal con Sidebar
```

---

## 🎨 Diseño y Responsividad

- **Tailwind CSS**: Framework CSS utilizado para todos los estilos.
- **Responsive**: 
  - **Móvil**: Sidebar colapsable, grid 1 columna.
  - **Tablet**: Grid 2 columnas, sidebar fijo.
  - **Escritorio**: Layout de 3+ columnas, navegación óptima.
- **Accesibilidad**: Etiquetas semánticas, iconos de lucide-react para mejor UX.

---

## 🔒 Lógica de Control de Acceso

### Implementación en Cliente

1. **Estado Global**: `userRole` manejado en `App.jsx`.
2. **Propagación de Props**: `userRole` pasado a todas las páginas.
3. **Renderizado Condicional**: Cada página valida `userRole` para mostrar/ocultar componentes.
4. **Mensajes Informativos**: Los usuarios sin permisos ven avisos indicando restricciones.

### Ejemplo de Implementación

```jsx
{userRole === 'admin' ? (
  <div className="admin-form">
    {/* Formulario de creación */}
  </div>
) : (
  <div className="info-message">
    Modo lectura: No tienes permisos para crear.
  </div>
)}
```

---

## 🚀 Cómo Usar

### Instalación

```bash
npm install
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5173` en tu navegador.

### Selector de Rol

En el header, utiliza el dropdown "Rol" para cambiar entre:
- **Administrador**: Acceso completo.
- **Usuario**: Acceso limitado.

Navega por el sidebar para explorar las diferentes secciones.

### Búsqueda de Material

1. Selecciona **"Buscar Material"** en el sidebar.
2. Ingresa un término en la barra de búsqueda o haz clic en **"Filtros"**.
3. En el modal de filtros, selecciona los criterios deseados.
4. Los resultados aparecen automáticamente sin recargar la página.

---

## 🔧 Tecnologías Utilizadas

- **React 19**: Framework principal.
- **Vite**: Build tool y servidor de desarrollo.
- **Tailwind CSS 4**: Framework de estilos.
- **lucide-react**: Librería de iconos.
- **JavaScript ES6+**: Lenguaje base.

---

## 📦 Dependencias

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.554.0",
    "tailwindcss": "^4.1.17"
  }
}
```

---

## 🎯 Próximas Mejoras Propuestas

- [ ] Integración de autenticación real (JWT, OAuth).
- [ ] Endpoints protegidos en backend con validación de roles.
- [ ] Persistencia de estado en `localStorage`.
- [ ] Paginación en listados.
- [ ] Notificaciones en tiempo real.
- [ ] Exportación de reportes (PDF, Excel).
- [ ] Sistema de valoraciones y comentarios en materiales.
- [ ] Panel de administración con métricas y estadísticas.

---

## 📝 Notas Importantes

1. **Mock de Roles**: Actualmente el rol se cambia desde el selector en el header. En producción, debe obtenerse del token JWT o sesión.
2. **Servicios Backend**: Los servicios en `src/services/` realizan llamadas a la API. Asegúrate de que el backend esté activo.
3. **Diseño Limpio**: El código está organizado para facilitar mantenimiento y escalabilidad.

---

## 📧 Soporte

Para reportar issues o sugerencias, por favor contacta al equipo de desarrollo.

---

**UniclouD © 2025** - Sistema de Gestión de Material Académico
