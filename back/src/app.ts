import express from "express";
// import apiRoute from './routes/api.Route'

import cors from "cors";
 
type Sauvegarde = {
  user : string
  score : number
  filmsTrouves : string[]
}

const app = express();
const toutesLesSauvegardesParUtilisateur : Record<string, Sauvegarde> = {}

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(express.static("../front/dist"));
app.post("/api/score", (req, res) => {
  const {  playerId, score, filmsFound} = req.body;
  console.log(req.body)
const uneSauvegarde : Sauvegarde = {
  user: playerId,
  score: score,
  filmsTrouves: filmsFound
} 

toutesLesSauvegardesParUtilisateur[playerId] = uneSauvegarde
  //console.log("Score stocké est : ", score);
  //console.log("film stocké est : ", films_found);
  //console.log("id stocké est : ", playerId);
  res.status(200).send("reponse recu ");
});

app.get("/api/score/:userID", (req, res) => {
const laSauvegarde = toutesLesSauvegardesParUtilisateur[req.params.userID]
if (!laSauvegarde) {
  return res.status(400).send('PTDR T KI')
}

  res.status(200).json(laSauvegarde);
});

app.listen(3100, () => {
  console.log("server started");
});
