// ===========================
// Conexión global a MongoDB
// ===========================

// config/mongoClient.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const dbName = 'gestor_freelance'; 
let client;

async function getDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = getDB;