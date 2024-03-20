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
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_SCHEMA,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
  });

  await connection.connect();

  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );

  return connection;
}
