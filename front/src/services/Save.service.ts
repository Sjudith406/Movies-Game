import { DonneeSauvegarder } from "../models/Movie.model";

export const loadGame = async (playerID: string) => {
  // Récupérer les données du joueur
  const joueurResponse = await fetch(
    `http://localhost:3100/api/donnees/${playerID}`
  );
  if (joueurResponse.status !== 200) {
    console.log("je n'ai pas eu de reponse du serveur !!");
    throw new Error(joueurResponse.status.toString());
  }
  const joueurData: DonneeSauvegarder = await joueurResponse.json();
  return joueurData;
};

export const resetGame = async (playerId: string) => {
  const supprimeCache = await fetch(
    `http://localhost:3100/api/donnees/${playerId}`,
    {
      method: "DELETE",
    }
  );
  if (supprimeCache.status !== 200) {
    console.log("je n'ai pas eu de reponse du serveur !!!");
    throw new Error("Failed to send requeste to server");
  }
};

/**
 *
 * @param playerId
 * @param userName
 * @param score
 * @param filmsFound
 */
export const saveGame = async (
  playerId: string,
  userName: string,
  score: number,
  filmsFound: string[]
) => {
  try {
    const response = await fetch("http://localhost:3100/api/donnees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, userName, score, filmsFound }),
    });
    if (!response.ok) {
      throw new Error("Failed to send data to server");
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
};

export const saveName = async (
  userName: string
) => {
  try {
    const response = await fetch("http://localhost:3100/api/donnees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userName}),
    });
    if (!response.ok) {
      throw new Error("Failed to send data to server");
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
};
//si il n'y a aucune des parametre ou s'il n'y a pas de score ni de film ne rien envoyer
