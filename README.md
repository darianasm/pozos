# Documentación de la API REST - Gestión de Pozos Petroleros 🛢️

## Sumario
- [Documentación de la API REST - Gestión de Pozos Petroleros 🛢️](#documentación-de-la-api-rest---gestión-de-pozos-petroleros-️)
  - [Sumario](#sumario)
  - [Introducción](#introducción)
  - [Instalación y configuración](#instalación-y-configuración)
  - [Tabla de Endpoints](#tabla-de-endpoints)
  - [Ejemplos de Estructuras de Datos](#ejemplos-de-estructuras-de-datos)
    - [1. Estructura de Consulta (GET - Respuesta de un pozo)](#1-estructura-de-consulta-get---respuesta-de-un-pozo)
    - [2. Estructura para Agregar (POST)](#2-estructura-para-agregar-post)
    - [3. Estructura para Modificar (PUT)](#3-estructura-para-modificar-put)
    - [4. Eliminar (DELETE)](#4-eliminar-delete)

---

## Introducción
Esta API RESTful permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una base de datos en MongoDB enfocada en el control y gestión de **pozos petroleros**.

Temática elegida: **Gestión de pozos petroleros** (código, ubicación, estado, fecha de puesta en producción).
Cada documento incluye:
- `id` / `_id` (ID)
- `codigo`, `nombre`, `ubicacion`, `descripcion` (texto)
- `icono` (emoji en lugar de imagen)
- `profundidadMts`, `produccionDiaria` (datos numéricos)
- `estado`, `fechaPuestaProduccion`

---

## Instalación y configuración
1. Instalar dependencias: `npm install`
2. Crear archivo `.env` (ver `.env.example`):
   ```
   PORT=3008
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
   MONGODB_DB=ypf_pozos
   ```
3. El archivo `pozos.json` (4 documentos base) se importa automáticamente a MongoDB si la colección `pozos` está vacía.
4. Iniciar: `npm start` o `npm run dev`

---

## Tabla de Endpoints

| Método | Endpoint | Descripción | Código de Éxito | Códigos de Error |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Verifica que la API está en línea | 200 OK | 500 Error interno |
| **GET** | `/pozos` | Obtiene la lista completa de todos los pozos | 200 OK | 500 Error interno |
| **GET** | `/pozos/buscar?codigo=YP&estado=activo` | Busca pozos por código o estado (query params) | 200 OK | 400 Sin parámetros, 404 No encontrado, 500 Error interno |
| **GET** | `/pozos/:id` | Obtiene un pozo específico buscando por su ID de MongoDB | 200 OK | 400 ID inválido, 404 No encontrado, 500 Error interno |
| **POST** | `/pozos` | Da de alta un nuevo pozo petrolero | 201 Created | 400 Faltan datos, 500 Error interno |
| **PUT** | `/pozos/:id` | Modifica los datos de un pozo existente por ID | 200 OK | 400 ID inválido / sin campos, 404 No encontrado, 500 Error interno |
| **DELETE** | `/pozos/:id` | Elimina un pozo del sistema por su ID | 200 OK | 400 ID inválido, 404 No encontrado, 500 Error interno |

> Nota: `/pozos/buscar` debe declararse antes que `/pozos/:id` en el código, si no Express lo interpreta como un ID.

---

## Ejemplos de Estructuras de Datos

### 1. Estructura de Consulta (GET - Respuesta de un pozo)
Respuesta de `GET /pozos/:id`:
```json
{
  "_id": "64a2f1b2c9e77b0012345678",
  "id": 1,
  "codigo": "YP-001",
  "nombre": "Pozo Vaca Muerta Norte",
  "ubicacion": "Neuquen - Vaca Muerta",
  "estado": "activo",
  "fechaPuestaProduccion": "2022-03-15T00:00:00.000Z",
  "descripcion": "Pozo de petroleo no convencional de alto rendimiento",
  "icono": "🛢️",
  "profundidadMts": 3200,
  "produccionDiaria": 450
}
```

Ejemplo de consulta:
```bash
curl http://localhost:3008/pozos
curl http://localhost:3008/pozos/1
curl "http://localhost:3008/pozos/buscar?estado=activo"
```

### 2. Estructura para Agregar (POST)
Petición `POST /pozos` con body JSON:
```json
{
  "codigo": "YP-005",
  "nombre": "Pozo Vaca Muerta Sur",
  "ubicacion": "Neuquen - Vaca Muerta",
  "estado": "activo",
  "fechaPuestaProduccion": "2024-01-20",
  "descripcion": "Nuevo pozo horizontal con fractura hidráulica",
  "icono": "🛢️",
  "profundidadMts": 3100,
  "produccionDiaria": 380
}
```

Ejemplo:
```bash
curl -X POST http://localhost:3008/pozos \
  -H "Content-Type: application/json" \
  -d '{"codigo":"YP-005","nombre":"Pozo Vaca Muerta Sur","ubicacion":"Neuquen - Vaca Muerta","estado":"activo","descripcion":"Nuevo pozo horizontal","icono":"🛢️","profundidadMts":3100,"produccionDiaria":380}'
```
Respuesta exitosa `201 Created`:
```json
{
  "mensaje": "Pozo creado exitosamente",
  "id": 13,
  "_id": "64a2f1b2c9e77b0012345679",
  "pozo": {
    "id": 13,
    "codigo": "YP-005",
    "ubicacion": "Neuquen - Vaca Muerta",
    "estado": "activo",
    "fechaPuestaProduccion": "2024-01-20T00:00:00.000Z",
    "nombre": "Pozo Vaca Muerta Sur",
    "descripcion": "Nuevo pozo horizontal",
    "icono": "🛢️",
    "profundidadMts": 3100,
    "produccionDiaria": 380
  }
}
```

### 3. Estructura para Modificar (PUT)
Petición `PUT /pozos/:id` (solo los campos a cambiar):
```json
{
  "estado": "en mantenimiento",
  "descripcion": "Pozo en parada programada para cambio de bomba",
  "icono": "🔧",
  "produccionDiaria": 0
}
```

Ejemplo:
```bash
curl -X PUT http://localhost:3008/pozos/64a2f1b2c9e77b0012345678 \
  -H "Content-Type: application/json" \
  -d '{"estado":"en mantenimiento","produccionDiaria":0}'
```
Respuesta exitosa `200 OK`:
```json
{
  "mensaje": "Pozo actualizado correctamente"
}
```

### 4. Eliminar (DELETE)
```bash
curl -X DELETE http://localhost:3008/pozos/64a2f1b2c9e77b0012345678
```
Respuesta exitosa `200 OK`:
```json
{
  "mensaje": "Pozo eliminado correctamente"
}
```
