const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const Favorite = require('./favorite');

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accommodation_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
        type: DataTypes.TEXT
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false
    },
    city : {
        type: DataTypes.STRING,
        allowNull: false
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rating : {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
    image_url: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
        
    },

  image_previews: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: false,
  },

    amenities: { 
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
    },
});

module.exports = Hotel;
// Hotel.hasMany(Favorite, { foreignKey: 'hotel_id', as: 'favorites' });