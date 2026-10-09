require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'ypf_pozos';

app.use(express.json());

// Conexion simple a MongoDB
async function conectar() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Conectado a MongoDB');
  return client;
}

// Ruta base para probar que el servidor anda
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de pozos petroleros 🛢️ - base lista' });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
