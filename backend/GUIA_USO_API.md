# 🚀 Guía de Uso - Rick & Morty Platform API

## 📋 Índice

1. [Inicio Rápido](#inicio-rápido)
2. [Búsqueda y Filtros](#búsqueda-y-filtros)
3. [Ordenamiento](#ordenamiento)
4. [Paginación](#paginación)
5. [Exportación de Datos](#exportación-de-datos)
6. [Manejo de Archivos](#manejo-de-archivos)
7. [Ejemplos Completos](#ejemplos-completos)

---

## 🏁 Inicio Rápido

### Instalación y Arranque

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm run dev
```

### URLs Base

- **API:** `http://localhost:3000/api`
- **Documentación Swagger:** `http://localhost:3000/api/docs`
- **Health Check:** `http://localhost:3000/api/health`

### Autenticación

Todas las peticiones requieren un token JWT de Auth0:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔍 Búsqueda y Filtros

### Personajes (Characters)

#### Filtros Disponibles

| Parámetro | Tipo | Valores | Ejemplo |
|-----------|------|---------|---------|
| `name` | string | Cualquier texto | `Rick` |
| `status` | enum | `alive`, `dead`, `unknown` | `alive` |
| `species` | string | Cualquier especie | `Human` |
| `type` | string | Cualquier tipo | `Genetic experiment` |
| `gender` | enum | `male`, `female`, `genderless`, `unknown` | `male` |
| `search` | string | Búsqueda de texto | `rick sanchez` |

#### Ejemplos

```bash
# Buscar por nombre
GET /api/characters?name=Rick

# Filtrar por estado y especie
GET /api/characters?status=alive&species=Human

# Búsqueda combinada
GET /api/characters?status=alive&gender=male&species=Human

# Búsqueda de texto libre
GET /api/characters/search?q=morty
```

### Locaciones (Locations)

#### Filtros Disponibles

| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `name` | string | `Earth` |
| `type` | string | `Planet` |
| `dimension` | string | `C-137` |

#### Ejemplos

```bash
# Buscar por tipo
GET /api/locations?type=Planet

# Filtrar por dimensión
GET /api/locations?dimension=C-137

# Búsqueda combinada
GET /api/locations?type=Planet&dimension=Replacement%20Dimension

# Búsqueda de texto
GET /api/locations/search?q=citadel
```

### Episodios (Episodes)

#### Filtros Disponibles

| Parámetro | Tipo | Formato | Ejemplo |
|-----------|------|---------|---------|
| `name` | string | Cualquier texto | `Pilot` |
| `episode` | string | `S##E##` | `S01E01` |

#### Ejemplos

```bash
# Buscar por nombre
GET /api/episodes?name=Pilot

# Filtrar por código de episodio
GET /api/episodes?episode=S01E01

# Buscar todos los episodios de una temporada
GET /api/episodes?episode=S01

# Búsqueda de texto
GET /api/episodes/search?q=pickle
```

### Archivos (Files)

#### Filtros Disponibles

| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `category` | string | `images`, `documents` |
| `mimetype` | string | `image/jpeg`, `application/pdf` |

#### Ejemplos

```bash
# Listar imágenes
GET /api/files?category=images

# Filtrar por tipo MIME
GET /api/files?mimetype=image/jpeg

# Búsqueda de texto
GET /api/files/search?q=avatar
```

---

## 📊 Ordenamiento

### Sintaxis

- **Ascendente:** `?sort=campo`
- **Descendente:** `?sort=-campo`
- **Múltiples campos:** `?sort=campo1,-campo2`

### Ejemplos por Recurso

#### Personajes

```bash
# Ordenar por nombre (A-Z)
GET /api/characters?sort=name

# Ordenar por nombre descendente (Z-A)
GET /api/characters?sort=-name

# Ordenar por estado y luego por nombre
GET /api/characters?sort=status,-name

# Combinar filtros y ordenamiento
GET /api/characters?status=alive&species=Human&sort=-name
```

#### Locaciones

```bash
# Ordenar por nombre
GET /api/locations?sort=name

# Ordenar por tipo descendente
GET /api/locations?sort=-type

# Ordenar por tipo y nombre
GET /api/locations?sort=type,name
```

#### Episodios

```bash
# Ordenar por código de episodio
GET /api/episodes?sort=episode

# Ordenar por fecha de emisión descendente
GET /api/episodes?sort=-air_date

# Ordenar por nombre
GET /api/episodes?sort=name
```

#### Archivos

```bash
# Ordenar por fecha de subida (más recientes primero)
GET /api/files?sort=-createdAt

# Ordenar por nombre
GET /api/files?sort=filename

# Ordenar por tamaño descendente
GET /api/files?sort=-size
```

---

## 📄 Paginación

### Parámetros

| Parámetro | Tipo | Por defecto | Máximo | Descripción |
|-----------|------|-------------|--------|-------------|
| `page` | integer | 1 | - | Número de página |
| `limit` | integer | 10 | 100 | Resultados por página |

### Respuesta

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": true,
    "nextPage": 3,
    "prevPage": 1
  }
}
```

### Ejemplos

```bash
# Primera página con 10 resultados (por defecto)
GET /api/characters

# Página 2 con 20 resultados
GET /api/characters?page=2&limit=20

# Página 5 con 50 resultados
GET /api/characters?page=5&limit=50

# Máximo de resultados por página (100)
GET /api/characters?limit=100

# Combinar con filtros y ordenamiento
GET /api/characters?status=alive&page=3&limit=25&sort=name
```

---

## 📥 Exportación de Datos

### Formatos Soportados

- `json` - JSON (por defecto)
- `csv` - Comma Separated Values
- `excel` / `xlsx` - Microsoft Excel

### Endpoints de Exportación

#### Personajes

```bash
# Exportar como JSON
GET /api/characters/export

# Exportar como CSV
GET /api/characters/export?format=csv

# Exportar como Excel
GET /api/characters/export?format=excel

# Exportar con filtros
GET /api/characters/export?format=excel&status=alive&species=Human
```

**Columnas incluidas:**
- ID
- Nombre
- Estado
- Especie
- Tipo
- Género
- Origen
- Ubicación

#### Locaciones

```bash
# Exportar todas las locaciones
GET /api/locations/export?format=csv

# Exportar planetas únicamente
GET /api/locations/export?format=excel&type=Planet

# Exportar por dimensión
GET /api/locations/export?format=csv&dimension=C-137
```

**Columnas incluidas:**
- ID
- Nombre
- Tipo
- Dimensión

#### Episodios

```bash
# Exportar todos los episodios
GET /api/episodes/export?format=excel

# Exportar temporada específica
GET /api/episodes/export?format=csv&episode=S01

# Exportar episodio específico
GET /api/episodes/export?format=json&episode=S03E07
```

**Columnas incluidas:**
- ID
- Nombre
- Código
- Fecha de Emisión

### Ejemplos con cURL

```bash
# Descargar CSV de personajes vivos
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/characters/export?format=csv&status=alive" \
  -o characters.csv

# Descargar Excel de locaciones
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/locations/export?format=excel" \
  -o locations.xlsx
```

### Ejemplo con JavaScript/Fetch

```javascript
// Exportar y descargar automáticamente
async function exportCharacters() {
  const response = await fetch(
    'http://localhost:3000/api/characters/export?format=excel&status=alive',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'characters.xlsx';
  a.click();
}
```

---

## 📁 Manejo de Archivos

### Configuración de Límites

```env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880                    # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### Subir un Archivo

```bash
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN

# Campos del formulario:
file: [archivo binario]
description: "Mi avatar"
category: "images"
```

#### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "description=Mi avatar" \
  -F "category=images"
```

#### Ejemplo con JavaScript/Fetch

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Mi avatar');
  formData.append('category', 'images');
  
  const response = await fetch('http://localhost:3000/api/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}

// Uso
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await uploadFile(file);
  console.log('Archivo subido:', result);
});
```

#### Respuesta

```json
{
  "success": true,
  "message": "Archivo subido correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "filename": "image-1624567890123-456789.jpg",
    "originalName": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 245678,
    "path": "uploads/image-1624567890123-456789.jpg",
    "description": "Mi avatar",
    "category": "images",
    "downloadCount": 0,
    "createdAt": "2026-06-27T10:30:00.000Z",
    "updatedAt": "2026-06-27T10:30:00.000Z"
  }
}
```

### Subir Múltiples Archivos

```bash
POST /api/files/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN

# Campos del formulario:
files[]: [archivo 1]
files[]: [archivo 2]
files[]: [archivo 3]
description: "Galería de fotos"
category: "gallery"
```

#### Ejemplo con JavaScript

```javascript
async function uploadMultipleFiles(files) {
  const formData = new FormData();
  
  // Agregar múltiples archivos
  files.forEach(file => {
    formData.append('files', file);
  });
  
  formData.append('description', 'Galería de fotos');
  formData.append('category', 'gallery');
  
  const response = await fetch('http://localhost:3000/api/files/upload-multiple', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}
```

### Listar Archivos

```bash
# Listar todos los archivos del usuario
GET /api/files

# Con paginación
GET /api/files?page=1&limit=20

# Filtrar por categoría
GET /api/files?category=images

# Filtrar por tipo MIME
GET /api/files?mimetype=image/jpeg

# Ordenar por fecha (más recientes primero)
GET /api/files?sort=-createdAt
```

### Buscar Archivos

```bash
# Buscar por nombre o descripción
GET /api/files/search?q=avatar

# Con paginación
GET /api/files/search?q=avatar&page=1&limit=10
```

### Descargar Archivo

```bash
GET /api/files/{fileId}/download
Authorization: Bearer YOUR_TOKEN
```

#### Ejemplo con JavaScript

```javascript
async function downloadFile(fileId, filename) {
  const response = await fetch(
    `http://localhost:3000/api/files/${fileId}/download`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

// Uso
downloadFile('507f1f77bcf86cd799439011', 'mi-archivo.jpg');
```

### Eliminar Archivo

```bash
DELETE /api/files/{fileId}
Authorization: Bearer YOUR_TOKEN
```

#### Ejemplo con JavaScript

```javascript
async function deleteFile(fileId) {
  const response = await fetch(
    `http://localhost:3000/api/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
}
```

### Estadísticas de Archivos

```bash
GET /api/files/stats
Authorization: Bearer YOUR_TOKEN
```

#### Respuesta

```json
{
  "success": true,
  "data": {
    "totalFiles": 45,
    "totalSize": 12345678,
    "totalSizeMB": 11.77,
    "byCategory": {
      "images": 30,
      "documents": 10,
      "others": 5
    },
    "byMimetype": {
      "image/jpeg": 20,
      "image/png": 10,
      "application/pdf": 10,
      "image/gif": 5
    }
  }
}
```

---

## 🎯 Ejemplos Completos

### Caso 1: Buscar Personajes Humanos Vivos y Exportar

```bash
# 1. Buscar con filtros
GET /api/characters?status=alive&species=Human&sort=name&page=1&limit=50

# 2. Exportar resultados a Excel
GET /api/characters/export?format=excel&status=alive&species=Human
```

### Caso 2: Gestión Completa de Archivos

```javascript
// 1. Subir imagen
const uploadResponse = await uploadFile(imageFile);
const fileId = uploadResponse.data._id;

// 2. Listar archivos del usuario
const listResponse = await fetch('/api/files?category=images', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const files = await listResponse.json();

// 3. Descargar archivo específico
await downloadFile(fileId, 'mi-imagen.jpg');

// 4. Eliminar archivo
await deleteFile(fileId);
```

### Caso 3: Dashboard con Estadísticas

```javascript
// Obtener todas las estadísticas
const [charStats, locStats, epStats, fileStats] = await Promise.all([
  fetch('/api/characters/stats', { headers }).then(r => r.json()),
  fetch('/api/locations/stats', { headers }).then(r => r.json()),
  fetch('/api/episodes/stats', { headers }).then(r => r.json()),
  fetch('/api/files/stats', { headers }).then(r => r.json())
]);

console.log('Total de personajes:', charStats.data.total);
console.log('Personajes vivos:', charStats.data.alive);
console.log('Total de locaciones:', locStats.data.total);
console.log('Total de episodios:', epStats.data.total);
console.log('Total de archivos:', fileStats.data.totalFiles);
```

### Caso 4: Búsqueda Avanzada con Múltiples Filtros

```bash
# Buscar personajes masculinos humanos vivos, ordenados por nombre, página 2
GET /api/characters?status=alive&species=Human&gender=male&sort=name&page=2&limit=25

# Buscar locaciones tipo "Planet" en dimensión específica
GET /api/locations?type=Planet&dimension=C-137&sort=name

# Buscar episodios de la temporada 3
GET /api/episodes?episode=S03&sort=episode
```

### Caso 5: Aplicación Completa de Galería de Imágenes

```javascript
class ImageGallery {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'http://localhost:3000/api/files';
  }
  
  async uploadImage(file, description, category = 'gallery') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('category', category);
    
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    
    return await response.json();
  }
  
  async getImages(page = 1, limit = 12) {
    const response = await fetch(
      `${this.baseUrl}?category=gallery&page=${page}&limit=${limit}&sort=-createdAt`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    return await response.json();
  }
  
  async searchImages(query, page = 1) {
    const response = await fetch(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    return await response.json();
  }
  
  async downloadImage(fileId, filename) {
    const response = await fetch(
      `${this.baseUrl}/${fileId}/download`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
  
  async deleteImage(fileId) {
    const response = await fetch(
      `${this.baseUrl}/${fileId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    return await response.json();
  }
}

// Uso
const gallery = new ImageGallery(token);

// Subir imagen
await gallery.uploadImage(file, 'Mi foto de perfil', 'avatars');

// Obtener galería
const images = await gallery.getImages(1, 12);

// Buscar imágenes
const results = await gallery.searchImages('avatar');

// Descargar imagen
await gallery.downloadImage(fileId, 'foto.jpg');

// Eliminar imagen
await gallery.deleteImage(fileId);
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Base de datos
MONGODB_URI=mongodb+srv://...

# Autenticación
AUTH0_AUDIENCE=your-audience
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com

# Cache y Mensajería
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost

# Aplicación
PORT=3000
NODE_ENV=development
SWAGGER_ENABLED=true

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

---

## 📚 Recursos Adicionales

- **Swagger UI:** `http://localhost:3000/api/docs`
- **Health Check:** `http://localhost:3000/api/health`
- **Validación del Proyecto:** Ver `VALIDACION_PROYECTO.md`

---

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación Swagger
2. Consulta este documento
3. Revisa los logs del servidor
4. Verifica tu token de autenticación

---

**Versión:** 1.0.0  
**Última actualización:** 27 de Junio de 2026
