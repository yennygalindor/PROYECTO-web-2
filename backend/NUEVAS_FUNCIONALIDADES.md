# 🚀 Nuevas Funcionalidades Implementadas

## 📋 Resumen

Se han agregado las siguientes funcionalidades avanzadas al proyecto Rick & Morty Platform:

### ✅ Implementadas

1. **Búsqueda avanzada con múltiples filtros**
2. **Ordenamiento por diferentes campos**
3. **Paginación de resultados**
4. **Exportación de información a CSV y Excel**
5. **Validación completa de datos recibidos**
6. **Variables de configuración mediante archivos .env**
7. **Uso de middlewares personalizados**
8. **Implementación de CORS y compresión HTTP**
9. **Manejo de archivos (subida y descarga)**

---

## 🔍 1. Búsqueda Avanzada con Múltiples Filtros

### Módulo de Personajes (Characters)
**Endpoint:** `GET /api/characters`

**Filtros disponibles:**
- `name` - Buscar por nombre
- `status` - Filtrar por estado (alive, dead, unknown)
- `species` - Filtrar por especie
- `type` - Filtrar por tipo
- `gender` - Filtrar por género (female, male, genderless, unknown)
- `sort` - Ordenar resultados (campo o -campo para descendente)

**Ejemplo:**
```bash
GET /api/characters?status=alive&species=Human&gender=female&sort=-name
```

### Módulo de Favoritos
**Endpoint:** `GET /api/favorites`

**Filtros disponibles:**
- `resourceType` - Filtrar por tipo (character, location, episode)
- `page` - Número de página
- `limit` - Resultados por página
- `sort` - Ordenar por campo

**Búsqueda de texto:**
```bash
GET /api/favorites/search?q=rick
```

### Módulo de Archivos
**Endpoint:** `GET /api/files`

**Filtros disponibles:**
- `category` - Filtrar por categoría
- `mimetype` - Filtrar por tipo MIME
- `page` - Número de página
- `limit` - Resultados por página

**Búsqueda:**
```bash
GET /api/files/search?q=documento
```

---

## 🔀 2. Ordenamiento por Diferentes Campos

### Sintaxis de ordenamiento:
- Campo ascendente: `?sort=name`
- Campo descendente: `?sort=-name`
- Múltiples campos: `?sort=status,-name`

### Ejemplos:
```bash
# Ordenar personajes por nombre
GET /api/characters?sort=name

# Ordenar favoritos por fecha de creación (más reciente primero)
GET /api/favorites?sort=-createdAt

# Ordenar archivos por tamaño
GET /api/files?sort=-size
```

---

## 📄 3. Paginación de Resultados

### Middleware de Paginación
Implementado en: `src/common/middlewares/pagination.js`

**Parámetros:**
- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10, max: 100)

**Respuesta paginada:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### Ejemplo de uso:
```bash
GET /api/favorites?page=2&limit=20
```

---

## 📊 4. Exportación de Información

### Formatos soportados:
- JSON (default)
- CSV
- Excel (.xlsx)

### Endpoints de exportación:

#### Exportar Personajes
```bash
GET /api/characters/export?format=csv
GET /api/characters/export?format=excel&status=alive
```

#### Exportar Favoritos
```bash
GET /api/favorites/export?format=xlsx
GET /api/favorites/export?format=csv
```

### Columnas exportadas:

**Personajes:**
- ID, Nombre, Estado, Especie, Tipo, Género, Origen, Ubicación

**Favoritos:**
- ID, Tipo, ID del Recurso, Notas, Fecha de Creación

**Archivos:**
- ID, Nombre Original, Categoría, Tipo MIME, Tamaño, Fecha de Subida

---

## ✔️ 5. Validación Completa de Datos

### Middlewares de Validación
- `validateSchema` - Validación con Joi
- `validate` - Validación con express-validator

### Esquemas de validación implementados:
Ubicación: `src/common/validation/schemas.js`

**Esquemas disponibles:**
- `paginationSchema` - Validar paginación
- `characterFiltersSchema` - Validar filtros de personajes
- `locationFiltersSchema` - Validar filtros de ubicaciones
- `episodeFiltersSchema` - Validar filtros de episodios
- `favoriteSchema` - Validar creación de favoritos
- `updateFavoriteSchema` - Validar actualización
- `mongoIdSchema` - Validar IDs de MongoDB
- `fileUploadSchema` - Validar subida de archivos
- `exportSchema` - Validar parámetros de exportación

### Ejemplo de validación:
```javascript
router.post(
  '/api/favorites',
  validateSchema(favoriteSchema),
  addFavorite
);
```

### Respuesta de error de validación:
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "resourceType",
      "message": "resourceType debe ser character, location o episode",
      "type": "any.only"
    }
  ]
}
```

---

## ⚙️ 6. Variables de Configuración (.env)

### Nuevas variables agregadas:

```env
# Paginación
DEFAULT_PAGE=1
DEFAULT_LIMIT=10
MAX_LIMIT=100

# Archivos
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# CORS
CORS_ORIGINS=http://localhost:4200,http://localhost:3000

# Compresión
COMPRESSION_ENABLED=true
COMPRESSION_THRESHOLD=1024
```

### Cómo usar:
```javascript
const maxLimit = parseInt(process.env.MAX_LIMIT) || 100;
```

---

## 🛡️ 7. Middlewares Personalizados

### Lista de middlewares implementados:

#### `pagination.js`
- Procesa parámetros de paginación
- Calcula offset automáticamente
- Agrega `req.pagination` con metadata

#### `validation.js`
- Valida datos con Joi o express-validator
- Retorna errores formateados
- Sanitiza inputs

#### `fileUpload.js`
- Configura Multer para subida de archivos
- Valida tipo y tamaño de archivo
- Maneja errores de subida

#### `rateLimiter.js`
- Limita requests por IP usando Redis
- Configurable por tiempo y cantidad
- Retorna headers `X-RateLimit-*`

**Ejemplo de uso:**
```javascript
const { rateLimit } = require('./common/middlewares/rateLimiter');

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de requests
}));
```

---

## 🌐 8. CORS y Compresión HTTP

### CORS Configurado
Ubicación: `src/app.js`

**Características:**
- Orígenes configurables desde .env
- Métodos permitidos: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Credenciales habilitadas
- Cache de preflight: 24 horas

```javascript
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  maxAge: 86400
}));
```

### Compresión HTTP
**Configuración:**
```javascript
app.use(compression({
  threshold: 1024, // Comprimir respuestas > 1KB
  level: 6 // Nivel de compresión (1-9)
}));
```

**Beneficios:**
- Reduce tamaño de respuestas en ~70%
- Mejora tiempos de carga
- Ahorra ancho de banda

---

## 📁 9. Manejo de Archivos

### Endpoints implementados:

#### Subir un archivo
```bash
POST /api/files/upload
Content-Type: multipart/form-data

file: [archivo]
description: "Descripción opcional"
category: "documentos"
```

#### Subir múltiples archivos
```bash
POST /api/files/upload-multiple
Content-Type: multipart/form-data

files: [archivo1, archivo2, ...]
category: "imagenes"
```

#### Listar archivos
```bash
GET /api/files?page=1&limit=10&category=imagenes
```

#### Buscar archivos
```bash
GET /api/files/search?q=documento
```

#### Descargar archivo
```bash
GET /api/files/:id/download
```

#### Eliminar archivo
```bash
DELETE /api/files/:id
```

#### Estadísticas de archivos
```bash
GET /api/files/stats
```

**Respuesta de estadísticas:**
```json
{
  "success": true,
  "data": {
    "general": {
      "totalFiles": 45,
      "totalSize": 15728640,
      "avgSize": 349524,
      "totalDownloads": 127
    },
    "byCategory": {
      "documentos": { "count": 20, "totalSize": 8388608 },
      "imagenes": { "count": 25, "totalSize": 7340032 }
    },
    "byType": {
      "image/jpeg": 15,
      "application/pdf": 20,
      "image/png": 10
    }
  }
}
```

### Validaciones de archivos:
- Tipos permitidos configurables
- Tamaño máximo configurable (default: 5MB)
- Nombres únicos automáticos

---

## 🗂️ Estructura de Archivos Creados

```
backend/
├── src/
│   ├── common/
│   │   ├── middlewares/
│   │   │   ├── pagination.js          ✨ NUEVO
│   │   │   ├── validation.js          ✨ NUEVO
│   │   │   ├── fileUpload.js         ✨ NUEVO
│   │   │   └── rateLimiter.js        ✨ NUEVO
│   │   ├── utils/
│   │   │   ├── queryBuilder.js       ✨ NUEVO
│   │   │   └── exportData.js         ✨ NUEVO
│   │   └── validation/
│   │       └── schemas.js            ✨ NUEVO
│   ├── modules/
│   │   ├── files/                    ✨ NUEVO MÓDULO
│   │   │   ├── file.model.js
│   │   │   ├── file.service.js
│   │   │   ├── file.controller.js
│   │   │   └── file.routes.js
│   │   ├── favorites/                📝 MEJORADO
│   │   │   ├── favorite.model.js     (actualizado)
│   │   │   ├── favorite.service.js   (actualizado)
│   │   │   ├── favorite.controller.js(actualizado)
│   │   │   └── favorite.routes.js    (actualizado)
│   │   └── characters/               📝 MEJORADO
│   │       ├── character.service.js  (actualizado)
│   │       ├── character.controller.js (actualizado)
│   │       └── character.routes.js   (actualizado)
│   └── app.js                        📝 MEJORADO
├── uploads/                          ✨ NUEVO (auto-creado)
├── .env                              📝 ACTUALIZADO
├── package.json                      📝 ACTUALIZADO
└── NUEVAS_FUNCIONALIDADES.md        ✨ ESTE ARCHIVO
```

---

## 📦 Dependencias Nuevas

```json
{
  "compression": "^1.7.4",
  "express-validator": "^7.0.1",
  "exceljs": "^4.4.0",
  "joi": "^17.13.3",
  "multer": "^1.4.5-lts.1"
}
```

### Instalar dependencias:
```bash
npm install
```

---

## 🚀 Cómo Usar

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar .env
Asegúrate de tener todas las variables configuradas en `.env`

### 3. Iniciar servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### 4. Probar endpoints
Usa Postman, Thunder Client o curl para probar los endpoints.

**Documentación Swagger:**
```
http://localhost:3000/api/docs
```

---

## 📝 Ejemplos de Uso Completos

### Ejemplo 1: Buscar y exportar personajes
```bash
# 1. Buscar personajes vivos de especie Human
GET /api/characters?status=alive&species=Human&page=1&limit=20

# 2. Exportar resultados a Excel
GET /api/characters/export?format=excel&status=alive&species=Human
```

### Ejemplo 2: Gestionar favoritos con paginación
```bash
# 1. Agregar a favoritos
POST /api/favorites
{
  "resourceType": "character",
  "resourceId": 1,
  "notes": "Rick es mi personaje favorito"
}

# 2. Listar favoritos de tipo character
GET /api/favorites?resourceType=character&page=1&limit=10&sort=-createdAt

# 3. Buscar en favoritos
GET /api/favorites/search?q=rick

# 4. Exportar a CSV
GET /api/favorites/export?format=csv
```

### Ejemplo 3: Subir y gestionar archivos
```bash
# 1. Subir archivo
POST /api/files/upload
Content-Type: multipart/form-data
file: [seleccionar archivo]
category: "avatars"
description: "Avatar de usuario"

# 2. Listar archivos de categoría
GET /api/files?category=avatars&sort=-createdAt

# 3. Obtener estadísticas
GET /api/files/stats

# 4. Descargar archivo
GET /api/files/{id}/download
```

---

## 🔒 Seguridad

### Validaciones implementadas:
✅ Validación de tipos de datos
✅ Sanitización de inputs
✅ Límite de tamaño de archivos
✅ Validación de tipos MIME
✅ Rate limiting por IP
✅ CORS configurado
✅ Validación de IDs de MongoDB

### Mejores prácticas:
- Todos los endpoints requieren autenticación
- Los usuarios solo pueden acceder a sus propios datos
- Archivos almacenados fuera del código fuente
- Configuración sensible en variables de entorno

---

## 🧪 Testing

### Endpoints para testing manual:

#### Health Check
```bash
GET /api/health
```

#### Personajes
```bash
# Listar con filtros
GET /api/characters?status=alive&gender=female

# Buscar
GET /api/characters/search?q=morty

# Estadísticas
GET /api/characters/stats

# Exportar
GET /api/characters/export?format=csv
```

#### Favoritos
```bash
# CRUD completo
POST /api/favorites
GET /api/favorites
GET /api/favorites/:id
PATCH /api/favorites/:id
DELETE /api/favorites/:id

# Búsqueda y exportación
GET /api/favorites/search?q=rick
GET /api/favorites/stats
GET /api/favorites/export?format=excel
```

#### Archivos
```bash
# Gestión completa
POST /api/files/upload
GET /api/files
GET /api/files/:id/download
DELETE /api/files/:id
GET /api/files/stats
```

---

## 📚 Recursos Adicionales

### Documentación de APIs:
- Swagger UI: `http://localhost:3000/api/docs`
- Swagger JSON: `http://localhost:3000/api/docs.json`

### Middlewares personalizados:
- Ver código en `src/common/middlewares/`

### Utilidades:
- QueryBuilder: `src/common/utils/queryBuilder.js`
- Exportación: `src/common/utils/exportData.js`

---

## 🎯 Próximos Pasos Recomendados

1. ✅ Probar todos los endpoints con Postman
2. ✅ Configurar variables de entorno para producción
3. ✅ Implementar tests unitarios
4. ✅ Agregar documentación de API con Swagger
5. ✅ Configurar logging avanzado
6. ✅ Implementar caché adicional
7. ✅ Agregar métricas y monitoreo

---

## 🐛 Troubleshooting

### Error: "No se pudo crear carpeta uploads"
```bash
mkdir uploads
```

### Error: "Tipo de archivo no permitido"
Verifica `ALLOWED_FILE_TYPES` en `.env`

### Error: "Demasiadas solicitudes"
El rate limiter está activo. Espera 15 minutos o ajusta la configuración.

### Error de validación
Revisa que los datos enviados cumplan con los esquemas en `schemas.js`

---

## 👨‍💻 Contacto y Soporte

Para dudas o problemas:
1. Revisa la documentación de Swagger
2. Consulta este archivo
3. Revisa los logs del servidor
4. Verifica las variables de entorno

---

**¡Todas las funcionalidades están listas para usar! 🎉**
