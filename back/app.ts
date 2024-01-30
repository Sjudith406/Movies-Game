//import express from "express";

const express = require("express");
const app = express();

app.use((req, res) => {
  res.json({ message: "votre requête est passée !" });
});
module.exports = app;
