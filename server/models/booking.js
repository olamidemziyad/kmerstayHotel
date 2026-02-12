//server/models/bookings
const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const Room = require('./room');
const User = require('./user'); 

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    }
  },
  userId: { // 👉 Lien vers l'utilisateur qui a fait la réservation
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  guest_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guest_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  check_in_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_out: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  // 👉 NOUVEAUX CHAMPS PRIX
  price_per_night: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'paid', 'failed'),
    defaultValue: 'pending',
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
  },
  expires_at: {
  type: DataTypes.DATE,
  allowNull: true,
  defaultValue: null
},
});

// Associations
/* Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

User.hasMany(Booking, { foreignKey: 'userId' }); // 👉 un utilisateur peut faire plusieurs réservations
Booking.belongsTo(User, { foreignKey: 'userId' }); // 👉 une réservation appartient à un utilisateur */

module.exports = Booking;
