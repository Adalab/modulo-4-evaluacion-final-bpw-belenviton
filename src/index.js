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
  console.log({
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_SCHEMA || 'recetas_db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS,
  });
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

getConnection();

server.get('/api/recetas', async (req, res) => {
  // Connectar con la base de datos

  const conn = await getConnection();

  // Lanzar un SELECT

  const queryGetRecipes = `
  SELECT * FROM recetas_db.recetas;
  `;

  const [results] = await conn.query(queryGetRecipes);

  // Recuperar los datos

  const numberOfElements = results.length;
  // Cerramos la conexion

  conn.close();

  res.json({ info: { 'count': numberOfElements }, results: results });
});
