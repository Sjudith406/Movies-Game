import express from "express";
// import apiRoute from './routes/api.Route'
import fs from "fs"
import cors from "cors";

 
type Sauvegarde = {
  user : string
  score : number
  filmsTrouves : string[]
}

const app = express();
const cacheFile = "./cache.json"


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

/**
 * charger les donnees du cache depuis lefichier lors du demarrage du serveur
 */
const Chager = (() =>{
  try{
    const cacheData = fs.readFileSync(cacheFile, "utf8")
  return JSON.parse(cacheData)
  }catch (error) {
    console.error(" erreur lors du chargement du cache : ", error)
    return {}
  }
  
})
const toutesLesSauvegardesParUtilisateur : Record<string, Sauvegarde> = Chager()

/**
 * sauvegarder les donnees du cache dans le fichier
 * @param lesSauvegardes 
 */
const saveCache = ((lesSauvegardes : Record<string, Sauvegarde>) => {
  const donneesConvertis = JSON.stringify(lesSauvegardes)
  fs.writeFileSync(cacheFile, donneesConvertis, "utf8")
})

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
//const lesSauvegardesParUtilisateur = toutesLesSauvegardesParUtilisateur[playerId]
saveCache(toutesLesSauvegardesParUtilisateur)
console.log("id stocké est : ", toutesLesSauvegardesParUtilisateur);
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
