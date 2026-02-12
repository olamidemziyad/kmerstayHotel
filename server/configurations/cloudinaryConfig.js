// // File: server/configurations/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kmerstay', // 📁 Nom du dossier dans Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  },
});

const upload = require('multer')({ storage });
 
module.exports = { cloudinary, upload };
// Note: Ensure that the environment variables CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET are set in your .env file.