const Room = require('../models/room');
const Booking = require('../models/booking');
const { Op } = require('sequelize');

// Création de la chambre // 
exports.createRoom = async (req, res) => {
    const { room_number, type, price, is_available, hotelId, size, bed_type } = req.body;

    const errorMessage = "Une erreur s'est produite !";

    try {
        // Vérifier si tous les champs nécessaires sont bien remplis
        if (!room_number || !type || !price || !hotelId) {
            return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
        }

        // Vérifier si la chambre existe déjà dans le même hôtel
        const existingRoom = await Room.findOne({ where: { room_number, hotelId } });
        if (existingRoom) {
            return res.status(400).json({ error: "Une chambre avec ce numéro existe déjà dans cet hôtel" });
        }

        const image_url = req.file?.path; // Cloudinary nous donne l'URL de l'image uploadée
        if (!image_url) {
            return res.status(400).json({ error: "L'URL de l'image est requise" });
        }


        // Création de la chambre
        const room = await Room.create({
            room_number,
            type,
            price,
            hotelId,
            is_available: is_available ?? true,
            capacity,
            image_url,
            size,
            bed_type,
        });

        res.status(201).json({
            message: "Création réussie",
            data: {
                room: {
                    id: room.id,
                    room_number: room.room_number,
                    type: room.type,
                    price: room.price,
                    hotelId: room.hotelId,
                    is_available: room.is_available,
                    capacity: room.capacity,
                    image_url: room.image_url,
                    size: room.size,
                    bed_type: room.bed_type,
                }
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorMessage });
    }
};

// Récupération de toutes les chambres
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            attributes: ["id", "room_number", "type", "price", "is_available", "capacity", "image_url", "size", "bed_type"]
        });

        if (rooms.length === 0) {
            return res.status(404).json({ message: "Aucune chambre trouvée" });
        }

        res.status(200).json({
            message: "Les chambres ont été récupérées avec succès",
            data: rooms,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des chambres" });
    }
};

// Récupération d'une chambre par son ID
exports.getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByPk(id, {
            attributes: ["id", "room_number", "type", "price", "is_available", "capacity",  "image_url", "size", "bed_type"]
        });

        if (!room) {
            return res.status(404).json({ message: "Chambre non trouvée" });
        }

        res.status(200).json({
            message: "Chambre récupérée avec succès",
            data: room,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération de la chambre" });
    }
};

// Récupération du prix d'une chambre par son ID
exports.getRoomPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByPk(id, {
      attributes: ['id', 'price']
    });

    if (!room) {
      return res.status(404).json({ error: "Chambre non trouvée" });
    }

    res.status(200).json({
      message: "Prix récupéré avec succès",
      data: { id: room.id, price: room.price }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du prix :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mise à jour d'une chambre
exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { room_number, type, price, is_available, capacity, hotelId, size, bed_type } = req.body;

    try {
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Chambre non trouvée" });
        }

        // Mettre à jour les champs de la chambre
        room.room_number = room_number || room.room_number;
        room.type = type || room.type;
        room.price = price || room.price;
        room.is_available = is_available !== undefined ? is_available : room.is_available;
        room.capacity = capacity || room.capacity;
        room.hotelId = hotelId || room.hotelId;
        room.size = size !== undefined ? size : room.size;
        room.bed_type = bed_type || room.bed_type;

        // Si une nouvelle image est uploadée, mettre à jour l'URL de l'image
        if (req.file) {
            room.image_url = req.file.path; // Cloudinary nous donne l'URL de l'image uploadée
        }

        await room.save();

        res.status(200).json({
            message: "Mise à jour réussie",
            data: {
                id: room.id,
                room_number: room.room_number,
                type: room.type,
                price: room.price,
                is_available: room.is_available,
                capacity: room.capacity,
                hotelId: room.hotelId,
                image_url: room.image_url,
                size: room.size,
                bed_type: room.bed_type,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la chambre" });
    }
};

// Suppression d'une chambre
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Chambre non trouvée" });
        }

        await room.destroy();

        res.status(200).json({ message: "Chambre supprimée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression de la chambre" });
    }
};

// Modifier le prix de la chambre
exports.updateRoomPrice = async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Prix invalide. Fournissez un nombre positif." });
  }

  try {
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ error: "Chambre non trouvée." });
    }

    room.price = price;
    await room.save();

    res.status(200).json({
      message: "Prix de la chambre mis à jour avec succès.",
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du prix de la chambre." });
  }
};


exports.updateRoomImage = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ error: "Chambre non trouvée." });
    }

    // Si une nouvelle image est uploadée, mettre à jour l'URL de l'image
    if (req.file && req.file.path) {
      room.image_url = req.file.path; // Cloudinary nous donne l'URL de l'image
      await room.save();

      return res.status(200).json({
        message: "Image de la chambre mise à jour avec succès.",
        data: room
      });
    } else {
      return res.status(400).json({ error: "Aucune image uploadée." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'image de la chambre." });
  }
};

// Récupération des chambres par hotelId
/**
 * Récupère les chambres d'un hôtel.
 * Si start & end sont fournis en query, renvoie uniquement les chambres disponibles sur cette période.
 */


// controllers/roomController.js
exports.getRoomsByHotelId = async (req, res) => {
  const { hotelId } = req.params;
  const { start, end, type, maxPrice, sort } = req.query;

  try {
    let whereClause = { hotelId };

    // Filtre par type si fourni
    if (type && type !== 'all') {
      whereClause.type = type;
    }

    // Filtre par prix max si fourni
    if (maxPrice) {
      whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    // Récupérer toutes les chambres de l'hôtel avec filtres de base
    let rooms = await Room.findAll({ where: whereClause });

    // Filtrage par disponibilité sur les dates
    if (start && end) {
      const booked = await Booking.findAll({
        where: {
          roomId: rooms.map(r => r.id),
          status: 'confirmed',
          [Op.or]: [
            { check_in_date: { [Op.between]: [start, end] } },
            { check_out: { [Op.between]: [start, end] } },
            { check_in_date: { [Op.lte]: start }, check_out: { [Op.gte]: end } },
          ],
        },
        attributes: ['roomId'],
      });

      const bookedIds = booked.map(b => b.roomId);
      rooms = rooms.filter(r => !bookedIds.includes(r.id));
    }

    // Tri par prix si demandé
    if (sort === 'price_asc') {
      rooms.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      rooms.sort((a, b) => b.price - a.price);
    }

    res.json({
      data: rooms,
      count: rooms.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des chambres.' });
  }
};



// GETroomsByHotel
exports.getRoomsByHotel = async (req, res) => {
  try {
    const { id: hotelId } = req.params;
    const { start, end, type, maxPrice } = req.query;

    const where = { hotelId };
    if (type && type !== 'all') where.type = type;
    if (maxPrice) where.price = { [Op.lte]: Number(maxPrice) };

    // ✅ Si on reçoit des dates, on filtre les chambres non disponibles
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // On récupère les chambres ayant une réservation sur ces dates
      const bookedRooms = await Booking.findAll({
        attributes: ['roomId'],
        where: {
          [Op.or]: [
            { check_in_date: { [Op.between]: [startDate, endDate] } },
            { check_out: { [Op.between]: [startDate, endDate] } },
            {
              check_in_date: { [Op.lte]: startDate },
              check_out: { [Op.gte]: endDate },
            },
          ],
          status: { [Op.in]: ['confirmed', 'paid', 'pending'] },
          [Op.or]: [
            { expires_at: null },
            { expires_at: { [Op.gt]: new Date() } } // ignore réservations expirées
          ],
        },
      });

      const bookedRoomIds = bookedRooms.map(b => b.roomId);

      // On exclut les chambres réservées
      where.id = { [Op.notIn]: bookedRoomIds };
    }

    const rooms = await Room.findAll({ where });

    return res.json({
      data: rooms,
      count: rooms.length
    });

  } catch (error) {
    console.error("Erreur lors du filtrage des chambres :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Vérification de disponibilité d'une chambre
exports.checkRoomAvailability = async (req, res) => {
  const { roomId } = req.params;
  const { start, end } = req.query;

  try {
    // ✅ Vérification des dates
    if (!start || !end || new Date(start) >= new Date(end)) {
      return res.status(400).json({ error: "Dates invalides." });
    }

    // ✅ Vérification que la chambre existe
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Chambre non trouvée." });
    }

    // ✅ Vérifier s'il existe une réservation confirmée qui chevauche la période
    const conflict = await Booking.findOne({
      where: {
        roomId,
        status: "confirmed",
        [Op.or]: [
          // 1️⃣ Le check-in tombe dans l’intervalle demandé
          { check_in_date: { [Op.between]: [start, end] } },
          // 2️⃣ Le check-out tombe dans l’intervalle demandé
          { check_out: { [Op.between]: [start, end] } },
          // 3️⃣ La réservation couvre toute la période demandée
          {
            check_in_date: { [Op.lte]: start },
            check_out: { [Op.gte]: end },
          },
        ],
      },
    });

    return res.status(200).json({
      available: !conflict,
      message: !conflict
        ? "Chambre disponible ✅"
        : "Chambre déjà réservée ❌",
    });
  } catch (error) {
    console.error("Disponibilité erreur:", error);
    return res.status(500).json({ error: "Erreur lors de la vérification." });
  }
};
