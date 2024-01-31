//import express from "express";

const express = require("express");
const app = express();

app.use((req, res) => {
  res.json({ message: "votre requête est passée !" });
});
module.exports = app;

/* // Définition du dossier contenant les fichiers statiques
app.use(express.static('public'));

// Route pour renvoyer le fichier texte
app.get('/fichier-texte', (req, res) => {
  res.sendFile(__dirname + '/public/fichier.txt');
});

// Route par défaut pour les autres requêtes
app.use((req, res) => {
  res.status(404).send("Page non trouvée !");
});*/
