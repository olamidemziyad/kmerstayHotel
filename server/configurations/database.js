const { Sequelize } = require('sequelize');

// Charger les variables d'environnement
require('dotenv').config();

// Configuration de la connexion à la base de données MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,     
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,    
    dialect: 'mysql',            
    port: process.env.DB_PORT,
  }
);
// Exporter l'instance de Sequelize
module.exports = sequelize;