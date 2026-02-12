const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const { v4: uuidv4 } = require('uuid');

//Champs : id, nom, email, mot de passe (hashé), rôle (client, admin), date de création

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID, // Définit l'ID comme UUID
    defaultValue: uuidv4,  // Génère automatiquement un UUID lors de la création
    primaryKey: true,      // Définit l'ID comme clé primaire
},
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'client',
    validate: {
      isIn: [['client', 'admin']],
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'date_de_creation',
  },
}, {
  tableName: 'users',
  timestamps: false,
});


module.exports = User;

// User.hasMany(require('./favorite'), { foreignKey: 'user_id', as: 'favorites' });
