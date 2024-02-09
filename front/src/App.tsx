import  {  ChangeEvent, FC, useEffect, useState } from "react";
import { DonneeSauvegarder, FilmJeu, TMDBMovieResponse } from "./models/type-data"
import "./styles/App.css";
import { Link } from "react-router-dom";
import { charger, chargerId, isFoundMovie, sauvegarder, sauvegarderId, transformerUnFilmBruteEnFilmJeu } from "./fonctions/function-utils";
import {v4 as uuidv4} from "uuid";



const debutURLaffichagePoster = "https://image.tmdb.org/t/p/w185"; 


function Tests() {
  const [movies, setMovies] = useState<FilmJeu[]>([]);
  const [titleInput, setTitleInput] = useState<string>("")
  const [score, setScore]= useState<number>(0)
  const [filmsFound, setFilmsFound] = useState<string[]>([])
  const [playerId, setPlayerId] = useState<string>(chargerId())
  
  /**
   * identifiaant du joueur
   */
   useEffect(() => {

    if (playerId === ""){
      const newP = uuidv4()
      setPlayerId(newP)
      sauvegarderId(newP)
    }
    console.log("mon iidd : ", playerId)
   }, []) 

  // Importer la clé API depuis le fichier .env
  const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;

  /**
   * récupérer les données du joueur
   */
  useEffect(() => {
    const JoueurDonnees = async () => {
      try{
        const reponse = await fetch(`http://localhost:3100/api/score/${playerId}`);
        if (reponse.status != 200) {
          throw new Error(reponse.status.toString());
        }
        const donnees: DonneeSauvegarder = await reponse.json()
        const scoreJoueur = donnees.scoreUser
        const films = donnees.filmsTrouvesParLeJoueur
        setScore(scoreJoueur)
        setFilmsFound(films)//filmsFound
        console.log("film trouver : ", donnees)
  
      } catch (error) {
        alert(error)
      }
    }
    JoueurDonnees()
  }, [playerId])

  /**
   * récupérer les films
   */
  useEffect(() => {
  const searchMovie = async () => {

    //const loadedFoundMovies = charger();
    //console.log("load : ",loadedFoundMovies)
    // lancer la requete
    try {
      const reponse = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1&api_key=${TMDB_KEY}`
      );

      if (reponse.status != 200) {
        throw new Error(reponse.status.toString());
      }

       const data: TMDBMovieResponse = await reponse.json();
     // si requete reussi; extraire le resultat
      const tableauDesFilmsBruts = data.results; 
      const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerUnFilmBruteEnFilmJeu(movie, filmsFound
      ))

      setMovies(tableauDesFilmsDuJeu)
      //let myId = uuidv4()
      //console.log("mon identifiant : ", myId)
    } catch (error) {
      // si requete echoue; prevenir l'utilisateur
      alert(error);
    }

  };

  searchMovie();
}, []);

useEffect(() => {
  const prochainFilms = movies.map(isFoundMovie(titleInput))
  setMovies(prochainFilms)
},[titleInput])

/** 
 * les films trouvés
 */
useEffect(() =>{
  const filteredMovies = movies.filter((film) => film.aEteTrouve);
  const foundMovies = filteredMovies.map((film) => (film.titreOriginal))
  setFilmsFound(foundMovies)
    //mettre à jour le score du joueur
    setScore(filteredMovies.length )
     if(filteredMovies.length !== 0) {
      //sauvegarder(filmsFound);
    }
  }, [movies])
  
  /**
   * score
   */
useEffect(() =>{
    console.log("vrai score : ", score)
    sendScoreToServer(score, filmsFound, playerId)
    console.log("le score envoyer : ", score)
  }, [score])

  /**
   * récupération titre saisis
   * @param event 
   */
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {

    setTitleInput(event.target.value)
  }

  /**
   * Envoi des information au serveur
   * @param score 
   * @param filmsFound 
   * @param playerId 
   */
  const sendScoreToServer = async (score: number, filmsFound: string[], playerId: string)=> {
    try {
      const response = await fetch("http://localhost:3100/api/score", {
        method: "POST",
        headers:
        {"Content-Type": "application/json",},
        body: JSON.stringify({ score, filmsFound, playerId })
        
      });
      if (!response.ok) {
        throw new Error("Failed to send score to server");
      }
    } catch (error) {
      console.error("Error sending score to server:", error);
    }
  };

  /**
   * bouton recommencer
   */
  const handleClickReset = () =>{
    localStorage.clear()
    //  window.location.reload();
    const resetMovies = movies.map((movie) => ({...movie,aEteTrouve: false}))
    setMovies(resetMovies)
  }
  return (
    <>
      <div className="page-body">
        <h2 className="page-title"> Devine le Film à l'affiche !</h2>
          <div className="score">
              <p>Votre score est : {score} / {movies.length}</p>
            </div>
        <div className="searchMovie">
          <input type="text" className="search-bar" placeholder="Devine le Film à l'affiche !"
          value={titleInput}
          onChange={handleInputChange}
          ></input>
          <button className="btn-restart" onClick={handleClickReset}>recommencer</button>
        </div>

        <div className="film-container">
          {movies.map((film) =>(
          <MovieComponent key={film.id} film={film} />
          ))}
        </div>
      </div>
    </>)
  ;
}

type MovieComponentProps = {
      film: FilmJeu
    }

    const MovieComponent: FC<MovieComponentProps> = ({film}) => {
      // Construire l'URL complet du poster en utilisant le chemin du poster du film
  const posterUrl = `${debutURLaffichagePoster}${film.posterURL}`;

      const posterStyle =  film.aEteTrouve ?  
           "poster" : "poster blur"

       return  (
       <>
        <div className="grid-item">
          <div className="post-blurred">
            {film.aEteTrouve ?(
                <Link to={`/movie/${film.id}`}>
                <img src={posterUrl} className={posterStyle} alt={film.titreOriginal}  /> 
                </Link>
                ):(
                  <img src={posterUrl} className={posterStyle} alt={film.titreOriginal} /> )}
          </div>
          <div className="movie-title">
            {film.aEteTrouve ?  
            (<p className="show-title">{film.titreOriginal}</p>
            ):(
            <p className="hide-title">{film.titreCache}</p>)  }
          </div>
        </div>

        </>)
    }

export default Tests;

