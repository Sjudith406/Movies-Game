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
  try{
    const donneesConvertis = JSON.stringify(lesSauvegardes)
    fs.writeFileSync(cacheFile, donneesConvertis, "utf8")
    console.log("Données du cache enregistrées avec succès !");
  }catch(error){
    console.error("Erreur lors de l'enregistrement du cache :", error);
  }
})

app.use(express.static("../front/dist"));
app.post("/api/score", (req, res) => {
  const {  playerId, score, filmsFound} = req.body;
  console.log(req.body)

  // verifie si les données recues sont valides avant de les enregistrer dans le cache
  if (!playerId || !score || !filmsFound || typeof score !== 'number' || !Array.isArray(filmsFound)) {
    return res.status(400).send('Les donnees sont invalides');
  }  
  
const uneSauvegarde : Sauvegarde = {
  user: playerId,
  score: score,
  filmsTrouves: filmsFound
} 

toutesLesSauvegardesParUtilisateur[playerId] = uneSauvegarde
saveCache(toutesLesSauvegardesParUtilisateur)
console.log("id stocké est : ", toutesLesSauvegardesParUtilisateur);
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
