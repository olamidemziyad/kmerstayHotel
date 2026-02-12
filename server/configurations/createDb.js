const { Sequelize } = require('sequelize');

// Connexion à MySQL sans spécifier de base de données
const sequelize = new Sequelize('', 'root', 'Admin@24', {
  host: 'localhost',
  dialect: 'mysql',
});

const databaseName = 'kmerstay_db'; 

sequelize
  .query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`)
  .then(() => {
    console.log(`Base de données '${databaseName}' créée ou déjà existante.`);
    return sequelize.close();
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la base de données:', error);
  });
