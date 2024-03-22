// IMPORTAR BIBLIOTECAS

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

// CREAR VARIABLES

const server = express();
const port = 4000;

// CONFIGURACIÓN

server.use(cors());
server.use(express.json({ limit: '25mb' }));

// CONFIGURACIÓN DE MYSQL

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_SCHEMA || 'recetas_db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS,
  });

  await connection.connect();

  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );

  return connection;
}

// ARRANCAR EL SERVIDOR

server.listen(port, () => {
  console.log(`Servidor iniciado escuchando en http://localhost:${port}`);
});

// ENDPOINTS

server.get('/api/recetas', async (req, res) => {
  // variables

  // Connectar con la base de datos

  const conn = await getConnection();

  // Lanzar un SELECT

  const queryGetRecipes = `
  SELECT * FROM recetas_db.recetas;
  `;

  // Recuperar los datos

  const [results] = await conn.query(queryGetRecipes);

  const numberOfElements = results.length;
  // Cerramos la conexion

  conn.close();

  res.json({ info: { 'count': numberOfElements }, results: results });
});

server.get('/api/recetas/:id', async (req, res) => {
  const conn = await getConnection();
  const selectRecipe = `
   SELECT *
     FROM recetas_db.recetas
            WHERE id = ?;
     `;

  const [resultsRecipe] = await conn.query(selectRecipe, [req.params.id]);

  conn.close();

  res.json({ 'recipes': resultsRecipe });
});

server.post('/api/recetas', async (req, res) => {
  try {
    if (
      req.body.nombre === '' ||
      req.body.ingredientes === '' ||
      req.body.instrucciones === ''
    ) {
      res.json({
        success: false,
        error: 'Todos los campos son obligatorios para completar la receta',
      });

      return;
    }
    const conn = await getConnection();

    const insertRecipe = `
         INSERT INTO recetas (nombre, ingredientes, instrucciones)
         VALUES (?, ?, ?)`;

    const [resultsInsertRecipe] = await conn.execute(insertRecipe, [
      req.body.nombre,
      req.body.ingredientes,
      req.body.instrucciones,
    ]);

    const idNewRecipe = resultsInsertRecipe.insertId;

    conn.close();

    res.json({
      success: true,
      cardURL: `localhost:${port}/api/recetas/${idNewRecipe}`,
    });
  } catch (error) {
    res.json({
      succes: false,
      error: 'Fallo en la bbdd',
    });
  }
});
