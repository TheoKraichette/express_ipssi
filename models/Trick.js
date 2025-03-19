const mongoose = require('mongoose');

const trickSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Facile', 'Moyen', 'Difficile'], required: true },
    level: { type: String, enum: ['Débutant', 'Confirmé', 'Expert'], required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Trick', trickSchema);
