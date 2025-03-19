# CheckTricks API

## Description

Ceci est une API back-end pour l'application CheckTricks permettant aux utilisateurs d'apprendre et de suivre leur progression sur des tricks de skateboard. Chaque utilisateur peut sélectionner des tricks, les marquer comme "En cours" ou "Maîtrisé", et progresser à travers plusieurs niveaux : Débutant, Confirmé et Expert.

## Installation

1. **Cloner le projet**
   ```sh
   git clone https://github.com/tonrepo/checktricks.git
   cd checktricks
   ```
2. **Installer les dépendances**
   ```sh
   npm install
   ```
3. **Configurer les variables d'environnement** Créer un fichier `.env` à la racine du projet avec les informations suivantes :
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. **Démarrer le serveur**
   ```sh
   npm start
   ```
   Ou avec Nodemon (pour le développement) :
   ```sh
   npm run dev
   ```

## Structure du projet

```
checktricks/
├── models/
│   ├── User.js
│   ├── Trick.js
├── controllers/
│   ├── userController.js
│   ├── trickController.js
├── routes/
│   ├── userRoutes.js
│   ├── trickRoutes.js
├── middleware/
│   ├── authMiddleware.js
├── config/
│   ├── db.js (optionnel pour connexion MongoDB)
├── .env
├── server.js
├── package.json
```

## API Endpoints

### 1. Utilisateurs (Auth)

#### Inscription

```http
POST /api/users/register
```

**Body:**

```json
{
  "username": "Theo",
  "email": "theo@theo.com",
  "password": "coucou123"
}
```

**Réponse:**

```json
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
```

#### Connexion

```http
POST /api/users/login
```

**Body:**

```json
{
  "email": "theo@theo.com",
  "password": "coucou123"
}
```

**Réponse:**

```json
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
```

### 2. Tricks

#### Récupérer les tricks par niveau

```http
GET /api/tricks/:level
```

**Exemple:**

```http
GET /api/tricks/Debutant
```

**Réponse:**

```json
[
  { "_id": "...", "name": "Kickflip", "difficulty": "Moyen", "level": "Débutant" },
  { "_id": "...", "name": "Ollie", "difficulty": "Facile", "level": "Débutant" }
]
```

#### Mettre à jour le statut d'un trick

```http
PUT /api/tricks/update
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Body:**

```json
{
  "trickId": "...",
  "status": "Maîtrisé",
  "stance": "Regular"
}
```

**Réponse:**

```json
{
  "message": "Mise à jour réussie",
  "user": { "_id": "...", "tricks": [...] }
}
```

## Tester l'API avec Insomnia

1. Ouvrir **Insomnia**
2. Créer une **Nouvelle requête**
3. **Tester l'inscription** :
   - Type : `POST`
   - URL : `http://localhost:5000/api/users/register`
   - Body : JSON avec `username`, `email`, `password`
4. **Tester la connexion** :
   - Type : `POST`
   - URL : `http://localhost:5000/api/users/login`
5. **Récupérer les tricks** :
   - Type : `GET`
   - URL : `http://localhost:5000/api/tricks/Debutant`
6. **Mettre à jour un trick** :
   - Type : `PUT`
   - URL : `http://localhost:5000/api/tricks/update`
   - Headers : `Authorization: Bearer [jwt_token]`
   - Body : JSON avec `trickId`, `status`, `stance`

## Remarque

- Assurez-vous que MongoDB est en cours d'exécution sur votre serveur node.
---

Projet CheckTricks - 2025 🚀

