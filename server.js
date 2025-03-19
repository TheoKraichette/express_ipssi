const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const trickRoutes = require('./routes/trickRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log('Erreur de connexion à MongoDB', err));

app.use('/api/users', userRoutes);
app.use('/api/tricks', trickRoutes);

app.listen(5000, () => {
    console.log('Serveur démarré sur le port 5000');
});