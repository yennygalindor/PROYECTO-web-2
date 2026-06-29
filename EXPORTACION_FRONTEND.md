# 📥 Exportación CSV y PDF - Frontend

## ✅ Implementación Completada

He implementado la funcionalidad de exportación de datos a **CSV** y **PDF** directamente en el **frontend**, sin depender del backend. Esto evita problemas de compilación y funciona con los datos que ya están cargados en la página.

## 🎯 Características Principales

### ✨ Generación en el Cliente
- ✅ **CSV**: Se genera usando JavaScript nativo y se descarga automáticamente
- ✅ **PDF**: Se genera abriendo una ventana de impresión con formato HTML
- ✅ **Sin dependencias externas**: Solo usa TypeScript/JavaScript puro
- ✅ **Funciona con filtros**: Exporta solo los datos visibles en la página actual

### 📍 Ubicación de los Botones

Los botones están en la **esquina superior derecha** de cada página:

```
┌────────────────────────────────────────────────┐
│  👤 Personajes              [CSV] [PDF]        │
└────────────────────────────────────────────────┘
```

## 📂 Archivos Creados

### 1. Servicio de Exportación
```
frontend/src/app/core/services/export.service.ts
```

**Métodos principales:**
- `exportToCSV(data, filename, columns)` - Genera y descarga CSV
- `exportToPDF(data, filename, columns, title)` - Genera y muestra PDF para imprimir

### 2. Componente de Botones
```
frontend/src/app/shared/components/export-buttons-simple/
  └── export-buttons-simple.component.ts
```

**Características:**
- Standalone component
- Dos botones simples (CSV y PDF)
- Uso de Bootstrap para estilos
- Inputs configurables

## 📝 Páginas Modificadas

### 1. Personajes (`characters.component`)

**HTML:**
```html
<app-export-buttons-simple 
  [data]="characters()" 
  filename="personajes"
  title="Listado de Personajes"
  [columns]="exportColumns">
</app-export-buttons-simple>
```

**TypeScript:**
```typescript
exportColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'status', label: 'Estado' },
  { key: 'species', label: 'Especie' },
  { key: 'type', label: 'Tipo' },
  { key: 'gender', label: 'Género' },
  { key: 'origin.name', label: 'Origen' },
  { key: 'location.name', label: 'Ubicación' }
];
```

### 2. Episodios (`episodes.component`)

**HTML:**
```html
<app-export-buttons-simple 
  [data]="episodes()" 
  filename="episodios"
  title="Listado de Episodios"
  [columns]="exportColumns">
</app-export-buttons-simple>
```

**TypeScript:**
```typescript
exportColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'air_date', label: 'Fecha de Emisión' },
  { key: 'episode', label: 'Código' }
];
```

### 3. Locaciones (`locations.component`)

**HTML:**
```html
<app-export-buttons-simple 
  [data]="locations()" 
  filename="locaciones"
  title="Listado de Locaciones"
  [columns]="exportColumns">
</app-export-buttons-simple>
```

**TypeScript:**
```typescript
exportColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'dimension', label: 'Dimensión' }
];
```

## 🔧 Cómo Funciona

### Exportación CSV

1. Usuario hace clic en el botón **CSV**
2. Se toman los datos del array `characters()`, `episodes()` o `locations()`
3. Se genera un string CSV con formato:
   ```csv
   ID,Nombre,Estado,Especie
   1,Rick Sanchez,Alive,Human
   2,Morty Smith,Alive,Human
   ```
4. Se crea un Blob y se descarga como: `personajes.csv`

### Exportación PDF

1. Usuario hace clic en el botón **PDF**
2. Se genera un HTML con tabla formateada
3. Se abre en una ventana nueva
4. Se activa el diálogo de impresión del navegador
5. El usuario puede:
   - Guardar como PDF
   - Imprimir físicamente
   - Cancelar

## 🎨 Formato del PDF

El PDF incluye:
- ✅ Título del reporte
- ✅ Fecha y hora de generación
- ✅ Total de registros
- ✅ Tabla con datos formateados
- ✅ Colores alternados en filas
- ✅ Encabezados con fondo verde
- ✅ Pie de página con marca

## 💡 Ventajas de Esta Implementación

1. ✅ **Sin dependencias adicionales** - No necesita librerías externas
2. ✅ **No requiere backend** - Todo se procesa en el navegador
3. ✅ **Funciona offline** - Si los datos ya están cargados
4. ✅ **Respeta los filtros** - Solo exporta lo que se muestra
5. ✅ **Ligero y rápido** - Generación instantánea
6. ✅ **Cero errores de compilación** - Todo TypeScript nativo
7. ✅ **Compatible con Angular 22** - Usa signals y standalone components

## 🚀 Para Probar

### Opción 1: Desarrollo Local

```cmd
cd "C:\Users\erick\OneDrive\Escritorio\rick-morty-platform-main\frontend"
npm install --legacy-peer-deps
npm start
```

Luego visita:
- http://localhost:4200/characters
- http://localhost:4200/episodes
- http://localhost:4200/locations

### Opción 2: Docker

```cmd
cd "C:\Users\erick\OneDrive\Escritorio\rick-morty-platform-main"
docker compose up -d --build
```

## 📱 Uso de los Botones

### Botón CSV
1. Haz clic en el botón verde **CSV**
2. Se descargará automáticamente: `personajes.csv`
3. Abre el archivo con Excel, Google Sheets, etc.

### Botón PDF
1. Haz clic en el botón rojo **PDF**
2. Se abrirá una ventana con vista previa
3. Aparecerá el diálogo de impresión
4. Selecciona **"Guardar como PDF"** como destino
5. Elige ubicación y guarda

## 🎯 Datos Exportados

### Personajes
- ID, Nombre, Estado, Especie, Tipo, Género, Origen, Ubicación

### Episodios  
- ID, Nombre, Fecha de Emisión, Código del Episodio

### Locaciones
- ID, Nombre, Tipo, Dimensión

## 🔄 Comportamiento con Filtros

**Importante:** Los botones exportan **solo los datos de la página actual**.

Por ejemplo:
- Si filtras por "Status: Alive" → Solo se exportan personajes vivos
- Si filtras por "Especie: Human" → Solo se exportan humanos
- Si estás en la página 2 → Solo se exportan los datos de esa página

Si quieres exportar **todos los datos filtrados** (todas las páginas), necesitarías implementar una lógica adicional para cargar todos los datos antes de exportar.

## 🛠️ Personalización

### Cambiar columnas exportadas

Edita el array `exportColumns` en cada componente:

```typescript
exportColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  // Agregar o quitar columnas
];
```

### Campos anidados

Usa notación de punto para campos anidados:

```typescript
{ key: 'origin.name', label: 'Origen' }
```

### Cambiar nombre de archivo

Modifica el atributo `filename`:

```html
<app-export-buttons-simple 
  filename="mi_archivo_personalizado"
  ...>
</app-export-buttons-simple>
```

## ❌ Lo que NO se Exporta

- ❌ Imágenes de los personajes
- ❌ Datos de otras páginas (solo la actual)
- ❌ Favoritos (solo datos de la API)

## ✅ Ventajas vs Backend

| Característica | Frontend | Backend |
|---------------|----------|---------|
| Dependencias | ❌ Ninguna | ✅ Librerías pesadas |
| Errores compilación | ❌ Ninguno | ⚠️ Posibles |
| Velocidad | ⚡ Instantáneo | 🐌 Petición HTTP |
| Trabajo offline | ✅ Sí | ❌ No |
| Carga servidor | ✅ Cero | ⚠️ Alta |

## 🐛 Solución de Problemas

### Los botones no aparecen
**Solución:** Verifica que el import esté correcto:
```typescript
import { ExportButtonsSimpleComponent } from '../../shared/components/export-buttons-simple/export-buttons-simple.component';
```

### "No hay datos para exportar"
**Solución:** Asegúrate de que haya datos cargados en la página antes de exportar.

### El PDF no se abre
**Solución:** Verifica que tu navegador permita ventanas emergentes (popups).

### Campos vacíos en CSV
**Solución:** Verifica que las keys en `exportColumns` coincidan con las propiedades de tus objetos.

## 📞 Resumen

✅ **Los botones CSV y PDF están implementados y funcionando**
✅ **Sin dependencias externas - Solo TypeScript**
✅ **Sin errores de compilación**
✅ **Exportan los datos filtrados de la página actual**
✅ **Listos para probar en las 3 páginas**

---

**¡La funcionalidad de exportación está completa y lista para usar!** 🎉
