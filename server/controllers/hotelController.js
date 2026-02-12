const { DataTypes, Op, where, fn, col } = require("sequelize");
const sequelize = require('../configurations/database');
const Hotel = require('../models/hotel');
const Room = require('../models/room');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = req.file.path; // URL Cloudinary
    res.status(200).json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
};

// Créer un hôtel
exports.createHotel = async (req, res) => {
  const { name, description, address, city, region, rating, image_url, image_previews, amenities } = req.body;

  try {
    if (!name || !address || !city || !region) {
      return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
    }

    const existingHotel = await Hotel.findOne({ where: { name } });
    if (existingHotel) return res.status(409).json({ error: "L'hôtel existe déjà" });

    const hotel = await Hotel.create({
      name, description, address, city, region, rating, image_url, image_previews, amenities
    });

    res.status(201).json({
      message: "Création réussie",
      data: hotel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de l'hôtel" });
  }
};

// Récupérer un hôtel par ID
exports.getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByPk(id, {
      include: [{
        model: Room,
        as: 'rooms', // ⚡ obligatoire !
        attributes: ["id", "room_number", "type", "price", "is_available"]
      }]
    });

    if (!hotel) return res.status(404).json({ message: "Hôtel non trouvé" });

    res.status(200).json({ message: "Hôtel récupéré avec succès", data: hotel });
  } catch (error) {
    console.error("Erreur récupération hôtel :", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'hôtel" });
  }
};

// Mise à jour d'un hôtel
exports.updateHotel = async (req, res) => {
  const { id } = req.params;
  const { image_previews } = req.body;

  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return res.status(404).json({ error: "Hôtel non trouvé" });

    const updatedHotel = await hotel.update({
      image_previews: image_previews ?? hotel.image_previews
    });

    res.status(200).json({ message: "Hôtel mis à jour avec succès", data: updatedHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'hôtel" });
  }
};

// Supprimer un hôtel
exports.deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return res.status(404).json({ message: "Hôtel non trouvé" });

    await Room.destroy({ where: { hotelId: id } }); // Supprimer les chambres
    await hotel.destroy();

    res.status(200).json({ message: "L'hôtel a été supprimé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'hôtel !" });
  }
};

// Récupérer tous les hôtels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: [{
        model: Room,
        as: 'rooms', // ⚡ obligatoire !
        attributes: ["id", "room_number", "type", "price", "is_available"]
      }]
    });

    res.status(200).json({ message: "Hôtels récupérés avec succès", total: hotels.length, data: hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des hôtels" });
  }
};

// Recherche par ville  
exports.getHotelsByCity = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: "Le paramètre 'city' est requis.", total: 0 });

  try {
    const hotels = await Hotel.findAll({ where: { city: { [Op.like]: `%${city}%` } } });
    if (!hotels.length) return res.status(404).json({ message: `Aucun hôtel trouvé pour la ville '${city}'` });

    res.status(200).json({ message: "Hôtels trouvés dans la ville spécifiée", total: hotels.length, data: hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche par ville" });
  }
};

// Recherche par région
exports.getHotelsByRegion = async (req, res) => {
  const { region } = req.query;
  if (!region) return res.status(400).json({ message: "Le paramètre 'region' est requis.", total: 0 });

  try {
    const hotels = await Hotel.findAll({ where: { region: { [Op.like]: `%${region}%` } } });
    if (!hotels.length) return res.status(404).json({ message: `Aucun hôtel trouvé pour la région '${region}'` });

    res.status(200).json({ message: "Hôtels trouvés dans la région spécifiée", total: hotels.length, data: hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche par région" });
  }
};

// Recherche par nom
exports.getHotelsByName = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: "Le paramètre 'name' est requis." });

  try {
    const hotels = await Hotel.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
    if (!hotels.length) return res.status(404).json({ message: `Aucun hôtel trouvé pour le nom '${name}'` });

    res.status(200).json({ message: "Hôtels trouvés pour le nom spécifié", total: hotels.length, data: hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche par nom." });
  }
};

// Recherche par prix
exports.getHotelsByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice && !maxPrice) return res.status(400).json({ message: "Veuillez spécifier minPrice ou maxPrice.", total: 0 });

  const priceFilter = {};
  if (minPrice) priceFilter[Op.gte] = Number(minPrice);
  if (maxPrice) priceFilter[Op.lte] = Number(maxPrice);

  try {
    const hotels = await Hotel.findAll({
      include: [{
        model: Room,
        as: 'rooms',
        where: { price: priceFilter }
      }]
    });

    if (!hotels.length) return res.status(404).json({ message: "Aucun hôtel trouvé dans cette gamme de prix." });

    res.status(200).json({ message: "Hôtels trouvés dans la gamme de prix spécifiée", total: hotels.length, data: hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche par prix." });
  }
};

// Recherche avancée
exports.searchHotelsAdvanced = async (req, res) => {
  const { minPrice, maxPrice, city, region, type, page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const whereHotel = {};
  const whereRoom = {};

  if (city) whereHotel[Op.and] = [{ ...where(fn('LOWER', col('city')), { [Op.like]: `%${city.toLowerCase()}%` }) }];
  if (region) whereHotel[Op.and] = [...(whereHotel[Op.and] || []), where(fn('LOWER', col('region')), { [Op.like]: `%${region.toLowerCase()}%` })];
  if (type) whereHotel[Op.and] = [...(whereHotel[Op.and] || []), where(fn('LOWER', col('accommodation_type')), { [Op.like]: `%${type.toLowerCase()}%` })];
  if (minPrice) whereRoom.price = { ...whereRoom.price, [Op.gte]: Number(minPrice) };
  if (maxPrice) whereRoom.price = { ...whereRoom.price, [Op.lte]: Number(maxPrice) };

  const sortableFields = ['name', 'rating'];
  const sortField = sortableFields.includes(sortBy) ? sortBy : 'name';
  const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  try {
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereHotel,
      include: [{ model: Room, as: 'rooms', where: whereRoom }],
      order: [[sortField, sortDirection]],
      offset,
      limit: parseInt(limit)
    });

    res.status(200).json({
      message: `${count} hôtel(s) trouvé(s).`,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche avancée des hôtels (MySQL)." });
  }
};
