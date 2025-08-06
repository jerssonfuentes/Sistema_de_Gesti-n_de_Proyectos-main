// ===========================
// Conexión global a MongoDB
// ===========================

// config/mongoClient.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'; // o tu URI de conexión
const dbName = 'gestor_freelance'; // o el nombre que estés usando
let client;

async function getDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = getDB;