import express from "express";
// import apiRoute from './routes/api.Route'

import cors from "cors"



const app = express();
let scoreEnregistrer = 0;
let filmsTrouvés = []
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

app.use(express.static("../front/dist"));
app.post("/api/score", (req, res) => {
  const { score, filmsFound } = req.body;
  scoreEnregistrer = score;
  filmsTrouvés = filmsFound;

  //console.log("Score stocké est : ", score);
  //console.log("film stocké est : ", films_found);
  res.status(200).send("reponse recu ")
});

app.get("/api/score", (req, res) =>{
  res.status(200).send("cc me revoilà !!!")
})

app.listen(3100, () => {
  console.log("server started");
});