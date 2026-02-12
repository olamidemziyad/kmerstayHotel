'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};  

// Connexion Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import des modèles
const User = require('./user');
const Room = require('./room');
const Booking = require('./booking');
const Favorite = require('./favorite');
const Hotel = require('./hotel');

db.User = User;
db.Room = Room;
db.Booking = Booking;
db.Favorite = Favorite;
db.Hotel = Hotel;

// Associations
// ------------------- USER -------------------
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ------------------- HOTEL -------------------
Hotel.hasMany(Room, { foreignKey: 'hotelId', as: 'rooms' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Hotel.hasMany(Favorite, { foreignKey: 'hotel_id', as: 'favorites' });
Favorite.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// ------------------- ROOM -------------------
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
