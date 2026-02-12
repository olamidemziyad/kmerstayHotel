// Basic Import and Setup for Express Server
const express = require("express");
const app = express();
const cors = require('cors');
// Importing Sequelize instance
const sequelize = require('./configurations/database');   
const PORT = process.env.PORT || 3000;

// Importing Strip

//Routes 
const hotel = require('./routes/hotelRoutes'); 
const room = require('./routes/roomRoutes');
const booking = require('./routes/bookingRoutes'); 
const user = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const testRoutes = require("./routes/testRoutes");
app.use(cors({
  origin: "https://kmerstay-hotelmanagement.vercel.app", 
}));
// Middleware pour le webhook Stripe (AVANT express.json())
app.use('/api/payments/webhook', express.raw({type: 'application/json'}));
// Middleware to parse JSON request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// Middleware to parse URL-encoded data

// Route for TEST associations
app.use("/api", testRoutes);


// Routes
//Hotel, Room, Booking and User routes
app.use('/api/hotels', hotel);  
app.use('/api/rooms', room);  
app.use('/api/bookings', booking);
app.use('/api/users', user);
app.use('/api/favorites', favoriteRoutes); 
app.use('/api/payments', paymentRoutes);
// Route for TEST
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API KmerStay");  
});
 

//Tester la connexion depuis la base de donnée
sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données réussie.'))
    .catch(error => console.error('Erreur de connexion à la base de données:', error));

//Synchroniser les modeles
    sequelize.sync(/*{force: true}*/ ) //mettre a jour les données dans la base /*force : true qui efface completement */
        .then(() => console.log('Les tables ont été créées ou synchronisées avec succès.'))
        .catch(error => console.error('Erreur de synchronisation des tables:', error));

// Server Configuration
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en cours sur le port ${PORT}`);
});

