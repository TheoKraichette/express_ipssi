const Trick = require('../models/Trick');
const User = require('../models/User');

// Ajouter plusieurs tricks d'un coup
exports.addTricks = async (req, res) => {
    try {
        // Ajout des tricks dans la base de données
        const tricks = await Trick.insertMany(req.body);
        res.status(201).json({ message: 'Tricks ajoutés avec succès', tricks });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout des tricks', error });
    }
};

// Récupérer tous les tricks par niveau (niveau de l'utilisateur connecté)
exports.getTricksByLevel = async (req, res) => {
    const level = req.user.level; // Récupérer le niveau de l'utilisateur connecté
    try {
        // Trouver les tricks correspondant au niveau de l'utilisateur
        const tricks = await Trick.find({ level }).sort({ difficulty: 1 });
        res.json(tricks); // Retourner les tricks triés par difficulté
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tricks', error });
    }
};

// Fonction pour obtenir le prochain niveau
const getNextLevel = (currentLevel) => {
    const levels = ['Débutant', 'Confirmé', 'Expert']; // Liste des niveaux disponibles
    const currentIndex = levels.indexOf(currentLevel); // Index du niveau actuel
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel; // Retourner le prochain niveau si possible
};

// Marquer un trick comme maîtrisé ou en cours (POST ou PUT)
exports.updateTrickStatus = async (req, res) => {
    const { trickId, status, stance } = req.body;
    const userId = req.user.id;

    try {
        // Trouver l'utilisateur dans la base de données
        const user = await User.findById(userId);

        // Vérifier si le trick existe déjà dans les tricks de l'utilisateur
        const trickIndex = user.tricks.findIndex(trick => trick.trickId.toString() === trickId);

        if (req.method === 'POST') {
            // Si c'est un POST, on ajoute un nouveau trick
            if (trickIndex !== -1) {
                return res.status(400).json({ message: 'Ce trick est déjà enregistré. Utilisez PUT pour le mettre à jour.' });
            }

            // Ajouter un nouveau trick
            user.tricks.push({
                trickId,
                status,
                stance,
                updatedAt: Date.now()
            });
        } else if (req.method === 'PUT') {
            // Si c'est un PUT, on met à jour un trick existant
            if (trickIndex === -1) {
                return res.status(400).json({ message: 'Trick non trouvé dans les tricks de l\'utilisateur. Utilisez POST pour l\'ajouter.' });
            }

            // Mise à jour du statut et de la stance
            user.tricks[trickIndex].status = status;
            user.tricks[trickIndex].stance = stance;
            user.tricks[trickIndex].updatedAt = Date.now();
        }

        // Sauvegarder les changements dans la base de données
        await user.save();

        // Vérification pour passer au niveau suivant si l'utilisateur a maîtrisé 50% des tricks
        const totalTricks = user.tricks.length;
        const masteredTricks = user.tricks.filter(trick => trick.status === 'Maîtrisé').length;

        // Si l'utilisateur a maîtrisé 50% des tricks, on le fait passer au niveau suivant
        if (masteredTricks / totalTricks >= 0.5) {
            const nextLevel = getNextLevel(user.level); // Obtenir le prochain niveau
            if (user.level !== nextLevel) {
                user.level = nextLevel; // Mettre à jour le niveau de l'utilisateur
                await user.save(); // Sauvegarder les changements
                return res.json({ message: `Félicitations, vous êtes maintenant ${nextLevel}!`, user }); // Répondre avec message de félicitations
            }
        }

        // Retourner l'utilisateur mis à jour avec ses tricks
        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du trick', error);
        res.status(500).json({ error: error.message, message: 'Erreur lors de la mise à jour du trick' });
    }
};

// Supprimer un trick d'un utilisateur
exports.deleteTrick = async (req, res) => {
    const { trickId } = req.params; // ID du trick à supprimer
    const userId = req.user.id;

    try {
        // Trouver l'utilisateur dans la base de données
        const user = await User.findById(userId);

        // Vérifier si le trick existe dans les tricks de l'utilisateur
        const trickIndex = user.tricks.findIndex(trick => trick.trickId.toString() === trickId);

        if (trickIndex === -1) {
            return res.status(400).json({ message: 'Le trick n\'existe pas dans vos tricks.' });
        }

        // Supprimer le trick de la liste des tricks de l'utilisateur
        user.tricks.splice(trickIndex, 1);

        // Sauvegarder les changements dans la base de données
        await user.save();

        // Retourner un message de succès
        res.json({ message: 'Trick supprimé avec succès.', user });
    } catch (error) {
        console.error('Erreur lors de la suppression du trick', error);
        res.status(500).json({ error: error.message, message: 'Erreur lors de la suppression du trick' });
    }
};
