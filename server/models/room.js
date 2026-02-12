const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const Hotel = require('./hotel');

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    room_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true  // Pour éviter les doublons, par exemple "101", "102A", etc.
    },
    type: {
        type: DataTypes.STRING, // Ex : "Simple", "Double", "Suite"
        allowNull: false,
        defaultValue: "Simple"
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    hotelId: {  
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Hotel,
            key: 'id'
        }
    },
     capacity: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },

   image_url: {
  type: DataTypes.STRING,
  allowNull: true,
  validate: {
    isUrl: true
  }
}

, 
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Taille de la chambre en m²'
  },
  bed_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type de lit (ex: Lit double, King size, etc.)'
  },

}, { 
    timestamps: true
});

// Association : Un hôtel possède plusieurs chambres
// Hotel.hasMany(Room, { foreignKey: 'hotelId', onDelete: 'CASCADE' });
// Room.belongsTo(Hotel, { foreignKey: 'hotelId' });

module.exports = Room;
