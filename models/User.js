const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tricks: [{
        trickId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trick' },
        status: { type: String, enum: ['En cours', 'Maîtrisé'], default: 'En cours' },
        stance: { type: String },
        updatedAt: { type: Date }
    }],
    level: { type: String, enum: ['Débutant', 'Confirmé', 'Expert'], default: 'Débutant' },  // Champ pour le niveau
}, {
    timestamps: true,
});

// Méthode pour hasher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
