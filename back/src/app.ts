import express from "express";
// import apiRoute from './routes/api.Route'
import fs from "fs";
import cors from "cors";
import { Sauvegarde } from "./models/typeData";

const app = express();
const cacheFile = "./cache.json";

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

/**
 * charger les donnees du cache depuis le fichier lors du demarrage du serveur
 */
const Charger = () => {
  try {
    const cacheData = fs.readFileSync(cacheFile, "utf8");
    return JSON.parse(cacheData);
  } catch (error) {
    console.error(" erreur lors du chargement du cache : ", error);
    return {};
  }
};
const toutesLesSauvegardesParUtilisateur: Record<string, Sauvegarde> =
  Charger();

/**
 * sauvegarder les donnees du cache dans le fichier
 * @param lesSauvegardes
 */
const saveCache = (lesSauvegardes: Record<string, Sauvegarde>) => {
  try {
    const donneesConvertis = JSON.stringify(lesSauvegardes, null, 4);
    fs.writeFileSync(cacheFile, donneesConvertis, "utf8");
    console.log("Données du cache enregistrées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du cache :", error);
  }
};

app.use(express.static("../front/dist"));

/**
 * donnee recu du client
 */
app.post("/api/donnees", (req, res) => {
  const { playerId, userName, score, filmsFound } = req.body;
  //console.log("coco: ", req.body);

  // verifie si les données recues sont valides avant de les enregistrer dans le cache
  if (
    !playerId ||
    !userName ||
    !score ||
    !filmsFound ||
    typeof score !== "number" ||
    !Array.isArray(filmsFound)
  ) {
    return res.status(400).send("Les donnees envoyees sont invalides");
  }

  const uneSauvegarde: Sauvegarde = {
    user: playerId,
    name: userName,
    score: score,
    filmsTrouves: filmsFound,
  };

  toutesLesSauvegardesParUtilisateur[playerId] = uneSauvegarde;

  // Vérifier si un pseudo est déjà enregistré pour cet UUID
  // const existingSave = toutesLesSauvegardesParUtilisateur[playerId];
  // if (existingSave && existingSave.name !== "") {
  //   return res
  //     .status(400)
  //     .send(`Un pseudo est déjà enregistré pour ${playerId}`);
  // }

  saveCache(toutesLesSauvegardesParUtilisateur);
  //console.log("id stocké est : ", toutesLesSauvegardesParUtilisateur);
  res.status(200).send("reponse recu !!");
});

/**
 * reponse envoyer au client
 */
app.get("/api/donnees/:userID", (req, res) => {
  const userID = req.params.userID;
  const laSauvegarde = toutesLesSauvegardesParUtilisateur[userID];
  if (!laSauvegarde) {
    // Si ID n'existe pas je renvoi ca
    const noData: Sauvegarde = {
      user: userID,
      name: "",
      score: 0,
      filmsTrouves: [],
    };
    //return res.status(400).send('PTDR T KI')
    return res.status(200).json(noData);
  }
  res.status(200).json(laSauvegarde);
});

/**
 * supprimer les donnees du joueur
 */
app.delete("/api/donnees/:userID", (req, res) => {
  const userId = req.params.userID;
  const sauvegardeDuJoueur = toutesLesSauvegardesParUtilisateur[userId];
  //Je verifie si l'utilisateur existe et s'il a une sauvegarde enrégistrer
  if (!sauvegardeDuJoueur) {
    return res.status(400).send("Le joueur n'a aucune sauvegarde !!!");
  }
  //si l'utilisateur a bien une sauvegarde je le supprime
  delete toutesLesSauvegardesParUtilisateur[userId];

  //j'enrégistre la nouvelle mis à jour des données
  saveCache(toutesLesSauvegardesParUtilisateur);
  res
    .status(200)
    .send(`La sauvegarde du joueur ${userId} a bien été supprimée !!`);
});

app.listen(3100, () => {
  console.log("server started");
});
