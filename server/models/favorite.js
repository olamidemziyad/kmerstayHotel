const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const { v4: uuidv4 } = require('uuid');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,  // Comme tes autres models
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  hotel_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'date_de_creation',  // Cohérent avec ton style
  },
}, {
  tableName: 'favorites',
  timestamps: false,  // Comme tes autres models
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'hotel_id'],  // Évite les doublons
      name: 'unique_user_hotel_favorite'
    }
  ]
});

// Relations
// Favorite.associate = (models) => {
//   Favorite.belongsTo(models.User, { 
//     foreignKey: 'user_id',
//     as: 'user'
//   });
//   Favorite.belongsTo(models.Hotel, { 
//     foreignKey: 'hotel_id',
//     as: 'hotel'
//   });
// };

module.exports = Favorite;