# 📦 Guía de Instalación - Nuevas Funcionalidades

## ⚡ Instalación Rápida

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Crear carpeta de uploads
```bash
mkdir uploads
```

### 3. Verificar archivo .env
Asegúrate de que tu archivo `.env` contenga todas las variables necesarias. El archivo ya está actualizado con las nuevas configuraciones.

### 4. Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### 5. Verificar instalación
Abre tu navegador y ve a:
- API Health: http://localhost:3000/api/health
- Swagger Docs: http://localhost:3000/api/docs

---

## 📋 Checklist de Instalación

- [ ] Dependencias instaladas (`npm install`)
- [ ] Carpeta `uploads/` creada
- [ ] Archivo `.env` configurado
- [ ] MongoDB conectado
- [ ] Redis conectado
- [ ] RabbitMQ conectado
- [ ] Servidor iniciado sin errores
- [ ] Swagger docs accesible

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "ENOENT: no such file or directory, open 'uploads/...'"
```bash
mkdir uploads
```

### Error: "Redis connection failed"
Verifica que Redis esté corriendo:
```bash
# Windows
redis-server

# O verifica en servicios de Windows
```

### Error: "MongoDB connection failed"
Verifica tu `MONGODB_URI` en `.env`

### Puerto 3000 en uso
Cambia el puerto en `.env`:
```env
PORT=3001
```

---

## 🧪 Probar Funcionalidades

### Opción 1: Usar Swagger UI
1. Ve a http://localhost:3000/api/docs
2. Autoriza con tu token de Auth0
3. Prueba los endpoints directamente

### Opción 2: Usar Thunder Client / REST Client
1. Abre `test-endpoints.http`
2. Reemplaza `YOUR_AUTH_TOKEN_HERE` con tu token
3. Ejecuta las peticiones

### Opción 3: Usar cURL
```bash
# Health check
curl http://localhost:3000/api/health

# Listar personajes (necesitas token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/characters?status=alive"
```

---

## 📦 Nuevas Dependencias Instaladas

Las siguientes dependencias fueron agregadas automáticamente:

```json
{
  "compression": "^1.7.4",
  "express-validator": "^7.0.1",
  "exceljs": "^4.4.0",
  "joi": "^17.13.3",
  "multer": "^1.4.5-lts.1"
}
```

---

## 🚀 Funcionalidades Listas para Usar

### ✅ Inmediatamente disponibles:
- Búsqueda avanzada con filtros
- Ordenamiento por campos
- Paginación automática
- Validación de datos
- CORS configurado
- Compresión HTTP
- Rate limiting

### 📝 Requieren configuración:
- Exportación (automática)
- Subida de archivos (necesitas probar con Postman/Thunder Client)

---

## 📚 Documentación

### Archivos de referencia:
- **NUEVAS_FUNCIONALIDADES.md** - Documentación completa
- **test-endpoints.http** - Ejemplos de peticiones
- **INSTALACION.md** - Esta guía (instalación)

### Swagger Documentation:
```
http://localhost:3000/api/docs
```

---

## 🎯 Próximos Pasos

1. ✅ Probar endpoints con Swagger
2. ✅ Probar exportación a CSV/Excel
3. ✅ Probar subida de archivos
4. ✅ Verificar filtros y búsqueda
5. ✅ Revisar logs del servidor

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa los logs del servidor en la consola
2. Verifica que todas las dependencias estén instaladas
3. Confirma que Redis y MongoDB estén corriendo
4. Revisa el archivo `.env`
5. Consulta `NUEVAS_FUNCIONALIDADES.md` para ejemplos

---

## ✨ Todo está listo!

El proyecto ahora incluye:
- ✅ Búsqueda avanzada con múltiples filtros
- ✅ Ordenamiento por diferentes campos
- ✅ Paginación de resultados
- ✅ Exportación a CSV/Excel
- ✅ Validación completa de datos
- ✅ Variables de configuración en .env
- ✅ Middlewares personalizados
- ✅ CORS y compresión HTTP
- ✅ Manejo de archivos (subida y descarga)

**¡Disfruta las nuevas funcionalidades! 🎉**
