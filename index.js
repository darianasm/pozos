require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'ypf_pozos';

app.use(express.json());

let db;


// Función para leer el JSON e insertarlo en MongoDB si está vacío
async function importarDatosIniciales() {
  try {
    const count = await db.collection('pozos').countDocuments();
    if (count === 0) {
      console.log('La colección está vacía. Leyendo pozos.json...');
      
      // Leemos el archivo pozos.json de forma sincrónica
      const archivoData = fs.readFileSync('./pozos.json', 'utf-8');
      const pozosJson = JSON.parse(archivoData);

      // Limpiamos los campos 'id' numéricos del JSON si queremos usar solo el _id de Mongo, 
      // o los guardamos tal cual. Insertamos los datos:
      await db.collection('pozos').insertMany(pozosJson);
      console.log('¡Datos de pozos.json importados exitosamente a MongoDB!');
    } else {
      console.log('La base de datos ya tiene pozos cargados. Omitiendo importación.');
    }
  } catch (error) {
    console.error('Error al importar el archivo pozos.json:', error.message);
  }
}


// Función principal para iniciar la base de datos y el servidor de forma secuencial
async function iniciarServidor() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Conectado exitosamente a MongoDB');

    await importarDatosIniciales();

    // El servidor solo arranca una vez que la base de datos está conectada y asignada
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

// Ejecutamos la función de inicio
iniciarServidor();

// Ruta base para probar que el servidor anda
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de pozos petroleros 🛢️ - base lista' });
});

app.get('/pozos', async (req, res) => {
  try {
    const pozos = await db.collection('pozos').find({}).toArray();
    res.status(200).json(pozos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pozos petroleros', detalle: error.message });
  }
});

app.get('/pozos/buscar', async (req, res) => {
  try {
    const { codigo, estado } = req.query;
    let filtro = {};

    if (codigo) {
      filtro.codigo = { $regex: codigo, $options: 'i' };
    } else if (estado) {
      filtro.estado = { $regex: estado, $options: 'i' };
    } else {
      return res.status(400).json({ error: 'Debe proporcionar un parámetro de búsqueda (codigo o estado)' });
    }

    const pozos = await db.collection('pozos').find(filtro).toArray();
    if (pozos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron pozos con los criterios indicados' });
    }

    res.status(200).json(pozos);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda', detalle: error.message });
  }
});

app.get('/pozos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El ID proporcionado no es válido' });
    }

    const pozo = await db.collection('pozos').findOne({ _id: new ObjectId(id) });
    if (!pozo) {
      return res.status(404).json({ error: 'Pozo no encontrado' });
    }

    res.status(200).json(pozo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el pozo', detalle: error.message });
  }
});

app.post('/pozos', async (req, res) => {
  try {
    const { codigo, nombre, ubicacion, estado, fechaPuestaProduccion, fechaProduccion, descripcion, icono, profundidadMts, produccionDiaria } = req.body;

    if (!codigo || !ubicacion || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (codigo, ubicacion, estado)' });
    }

    const fecha = fechaPuestaProduccion || fechaProduccion;
    const nuevoPozo = {
      codigo,
      ubicacion,
      estado,
      fechaPuestaProduccion: fecha ? new Date(fecha) : new Date()
    };

    if (nombre) nuevoPozo.nombre = nombre;
    if (descripcion) nuevoPozo.descripcion = descripcion;
    if (icono) nuevoPozo.icono = icono;
    if (profundidadMts !== undefined) nuevoPozo.profundidadMts = Number(profundidadMts);
    if (produccionDiaria !== undefined) nuevoPozo.produccionDiaria = Number(produccionDiaria);

    const resultado = await db.collection('pozos').insertOne(nuevoPozo);
    res.status(201).json({
      mensaje: 'Pozo creado exitosamente',
      id: resultado.insertedId,
      pozo: nuevoPozo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pozo', detalle: error.message });
  }
});

app.put('/pozos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El ID proporcionado no es válido' });
    }

    const { codigo, nombre, ubicacion, estado, fechaPuestaProduccion, fechaProduccion, descripcion, icono, profundidadMts, produccionDiaria } = req.body;
    const datosActualizados = {};

    if (codigo) datosActualizados.codigo = codigo;
    if (nombre) datosActualizados.nombre = nombre;
    if (ubicacion) datosActualizados.ubicacion = ubicacion;
    if (estado) datosActualizados.estado = estado;
    if (descripcion) datosActualizados.descripcion = descripcion;
    if (icono) datosActualizados.icono = icono;
    if (profundidadMts !== undefined) datosActualizados.profundidadMts = Number(profundidadMts);
    if (produccionDiaria !== undefined) datosActualizados.produccionDiaria = Number(produccionDiaria);
    const fecha = fechaPuestaProduccion || fechaProduccion;
    if (fecha) datosActualizados.fechaPuestaProduccion = new Date(fecha);

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    const resultado = await db.collection('pozos').updateOne(
      { _id: new ObjectId(id) },
      { $set: datosActualizados }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Pozo no encontrado para actualizar' });
    }

    res.status(200).json({ mensaje: 'Pozo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pozo', detalle: error.message });
  }
});

app.delete('/pozos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El ID proporcionado no es válido' });
    }

    const resultado = await db.collection('pozos').deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Pozo no encontrado para eliminar' });
    }

    res.status(200).json({ mensaje: 'Pozo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pozo', detalle: error.message });
  }
});