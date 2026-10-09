# API de Pozos Petroleros 🛢️

## Sumario

- [API de Pozos Petroleros 🛢️](#api-de-pozos-petroleros-️)
  - [Sumario](#sumario)
  - [1. Introducción](#1-introducción)
  - [2. URL base](#2-url-base)
  - [3. Estructura del dato (Pozo)](#3-estructura-del-dato-pozo)
  - [4. Ejemplos de uso](#4-ejemplos-de-uso)
    - [GET /pozos](#get-pozos)
    - [GET /pozos/:id](#get-pozosid)
    - [GET /pozos/nombre/:nombre](#get-pozosnombrenombre)
    - [POST /pozos](#post-pozos)
    - [PUT /pozos/:id](#put-pozosid)
    - [DELETE /pozos/:id](#delete-pozosid)
  - [5. Archivo .env](#5-archivo-env)
  - [6. Tabla general de endpoints](#6-tabla-general-de-endpoints)
  - [7. Códigos de error](#7-códigos-de-error)

## 1. Introducción

API RESTful para la **Gestión de pozos petroleros**.
Permite listar, buscar, crear, actualizar y eliminar pozos en MongoDB.

Cada pozo tiene: `código`, `ubicación`, `estado` (`activo`, `en mantenimiento`, `cerrado`), `fecha de puesta en producción`, más `nombre`, `descripción`, `icono` (emoji) y 2 datos numéricos (`profundidadMts`, `produccionDiaria`).

## 2. URL base

```text
http://localhost:3000
```

## 3. Estructura del dato (Pozo)

Ejemplo de lo que devuelve un GET:

```json
{
  "_id": "68f9c1a2b3c4d5e6f7081920",
  "id": 1,
  "codigo": "YP-001",
  "nombre": "Pozo Vaca Muerta Norte",
  "ubicacion": "Neuquen - Vaca Muerta",
  "estado": "activo",
  "fechaProduccion": "2022-03-15",
  "descripcion": "Pozo de petroleo no convencional de alto rendimiento",
  "icono": "🛢️",
  "profundidadMts": 3200,
  "produccionDiaria": 450
}
```

Campos:

- `id`: número automático (lo crea el servidor)
- `codigo`: texto único. Ej: `"YP-001"`
- `nombre`: texto. Ej: `"Pozo Vaca Muerta Norte"`
- `ubicacion`: texto. Ej: `"Neuquen - Vaca Muerta"`
- `estado`: solo `activo`, `en mantenimiento` o `cerrado`
- `fechaProduccion`: fecha `AAAA-MM-DD`
- `descripcion`: texto libre (opcional)
- `icono`: emoji (opcional). Ej: `"🛢️"`
- `profundidadMts`: número > 0
- `produccionDiaria`: número >= 0 (barriles por día)

## 4. Ejemplos de uso

### GET /pozos

Trae todos los pozos.

```http
GET http://localhost:3000/pozos
```

Respuesta `200 OK`:

```json
[
  {
    "id": 1,
    "codigo": "YP-001",
    "nombre": "Pozo Vaca Muerta Norte",
    "ubicacion": "Neuquen - Vaca Muerta",
    "estado": "activo",
    "fechaProduccion": "2022-03-15",
    "icono": "🛢️",
    "profundidadMts": 3200,
    "produccionDiaria": 450
  }
]
```

### GET /pozos/:id

Trae un pozo por su `id`.

```http
GET http://localhost:3000/pozos/1
```

Si no existe → `404`:

```json
{
  "mensaje": "No se encontro pozo con id 999"
}
```

### GET /pozos/nombre/:nombre

Busca por nombre, código o ubicación (sin importar mayúsculas).

```http
GET http://localhost:3000/pozos/nombre/vaca
```

Respuesta `200 OK`: array con los que coincidan.

### POST /pozos

Crea un pozo. El `id` lo pone el servidor.

```http
POST http://localhost:3000/pozos
Content-Type: application/json
```

Body:

```json
{
  "codigo": "YP-005",
  "nombre": "Pozo Nuevo Sur",
  "ubicacion": "Chubut - Golfo San Jorge",
  "estado": "activo",
  "fechaProduccion": "2024-01-20",
  "descripcion": "Pozo nuevo en fase de prueba",
  "icono": "🛢️",
  "profundidadMts": 3000,
  "produccionDiaria": 350
}
```

Respuesta `201 Created`:

```json
{
  "mensaje": "Pozo creado",
  "pozo": {
    "_id": "68f9c1a2b3c4d5e6f7081925",
    "id": 5,
    "codigo": "YP-005",
    "nombre": "Pozo Nuevo Sur",
    "ubicacion": "Chubut - Golfo San Jorge",
    "estado": "activo",
    "fechaProduccion": "2024-01-20",
    "icono": "🛢️",
    "profundidadMts": 3000,
    "produccionDiaria": 350
  }
}
```

Si faltan datos → `400`:

```json
{
  "mensaje": "Datos invalidos",
  "errores": ["estado: invalido. Debe ser uno de: activo, en mantenimiento, cerrado"]
}
```

### PUT /pozos/:id

Actualiza uno o varios campos.

```http
PUT http://localhost:3000/pozos/1
Content-Type: application/json
```

Body:

```json
{
  "estado": "en mantenimiento",
  "produccionDiaria": 0,
  "descripcion": "Parada programada por mantenimiento"
}
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Pozo actualizado",
  "pozo": {
    "id": 1,
    "codigo": "YP-001",
    "estado": "en mantenimiento",
    "produccionDiaria": 0
  }
}
```

### DELETE /pozos/:id

Elimina un pozo.

```http
DELETE http://localhost:3000/pozos/4
```

Respuesta `204 No Content` (sin cuerpo = se borró bien).

Si no existe → `404`.

## 5. Archivo .env

```env
PORT=3000
MONGODB_URI=mongodb+srv://<USUARIO>:<CLAVE>@<CLUSTER>/
MONGODB_DB=ypf_pozos
```

| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | Conexión a tu clúster de MongoDB Atlas |
| `MONGODB_DB` | Nombre de la base de datos (`ypf_pozos`) |

## 6. Tabla general de endpoints

| Método | Endpoint | Ejemplo | Uso |
|---|---|---|---|
| GET | `/` | `http://localhost:3000/` | Bienvenida |
| GET | `/pozos` | `http://localhost:3000/pozos` | Trae todos |
| GET | `/pozos/nombre/:nombre` | `http://localhost:3000/pozos/nombre/vaca` | Busca por nombre/código/ubicación |
| GET | `/pozos/:id` | `http://localhost:3000/pozos/1` | Trae uno por id |
| POST | `/pozos` | `http://localhost:3000/pozos` | Crea un pozo |
| PUT | `/pozos/:id` | `http://localhost:3000/pozos/1` | Actualiza un pozo |
| DELETE | `/pozos/:id` | `http://localhost:3000/pozos/4` | Elimina un pozo |

## 7. Códigos de error

| Código | Cuándo pasa |
|---|---|
| `200` | GET o PUT ok |
| `201` | POST ok (creado) |
| `204` | DELETE ok (sin cuerpo) |
| `400` | Datos mal enviados o id con formato inválido |
| `404` | Pozo o ruta no existe |
| `500` | Error de servidor / no conecta a MongoDB |
