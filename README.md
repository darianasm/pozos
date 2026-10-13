# Documentación de la API REST - Gestión de Pozos Petroleros 🛢️

## Sumario
1. [Introducción](#introducción)
2. [Tabla de Endpoints](#tabla-de-endpoints)
3. [Ejemplos de Estructuras de Datos](#ejemplos-de-estructuras-de-datos)
   - [Estructura de Consulta (GET)](#1-estructura-de-consulta-get)
   - [Estructura para Agregar / Modificar (POST / PUT)](#2-estructura-para-agregar--modificar-post--put)

---

## Introducción
Esta API RESTful permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una base de datos en MongoDB enfocada en el control y gestión de **pozos petroleros**.

---

## Tabla de Endpoints

| Método | Endpoint | Descripción | Código de Éxito | Códigos de Error |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/pozos` | Obtiene la lista completa de todos los pozos | 200 OK | 500 Error interno |
| **GET** | `/pozos/:id` | Obtiene un pozo específico buscando por su ID | 200 OK | 400 ID inválido, 404 No encontrado |
| **GET** | `/pozos/buscar` | Busca pozos por código o estado (Query params) | 200 OK | 400 Sin parámetros, 404 No encontrado |
| **POST** | `/pozos` | Da de alta un nuevo pozo petrolero | 201 Created | 400 Faltan datos, 500 Error interno |
| **PUT** | `/pozos/:id` | Modifica los datos de un pozo existente por ID | 200 OK | 400 ID inválido, 404 No encontrado |
| **DELETE** | `/pozos/:id` | Elimina un pozo del sistema por su ID | 200 OK | 400 ID inválido, 404 No encontrado |

---

## Ejemplos de Estructuras de Datos

### 1. Estructura de Consulta (GET - Respuesta de un pozo)
```json
{
  "_id": "64a2f1b2c9e77b0012345678",
  "codigo": "POZO-NQN-042",
  "ubicacion": "Cuenca Neuquina, Loma Campana",
  "estado": "activo",
  "fechaPuestaProduccion": "2023-05-15T00:00:00.000Z"
}