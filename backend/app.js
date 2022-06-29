// Importation des packages

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

// Lancement de Express

const app = express();

// Configuration CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(helmet());



//Connexion à la Base de données MongoDB

mongoose.connect(process.env.SECRET_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Body-parser

app.use(express.json());

// Routes


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/auth/user", userRoutes);
app.use("/posts", postRoutes); 

module.exports = app;