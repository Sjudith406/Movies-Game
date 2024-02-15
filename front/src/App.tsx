import  {ChangeEvent, useEffect, useState } from "react";
import { chargerId, isFoundMovie, sauvegarderId, transformerUnFilmBruteEnFilmJeu } from "./fonctions/function-utils";
import {v4 as uuidv4} from "uuid";
import { DonneeSauvegarder, FilmJeu, TMDBMovieResponse } from "./models/type-data";
import "./styles/App.css"
import { sendScoreToServer } from "./fonctions/function-server";
import { MovieComponent } from "./fonctions/component";


// Importer la clé API depuis le fichier .env
const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;

function Tests(){
    const [playerId, setPlayerId] = useState<string>(chargerId());
    const [movies, setMovies] = useState<FilmJeu[]>([])
    const [titleInput, setTitleInput] = useState<string>("")
    const [filmsFound, setFilmsFound] = useState<string[]>([])
    const [score, setScore]= useState<number>(0)
    const [scoreState, setScoreState] = useState<boolean>(false)

   /**
   * identifiaant du joueur
   */
   useEffect(() => {

    if (playerId === ""){
      const newP = uuidv4()
      setPlayerId(newP)
      sauvegarderId(newP)
    }
    console.log("mon uuid : ", playerId)
   }, [playerId]) 

   useEffect(() =>{
    const fetchData = async () =>{
      try {
              // Récupérer les films depuis l'API TMDB
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1&api_key=${TMDB_KEY}`
        )
        if (tmdbResponse.status !== 200) {
          console.log("je n'ai pas eu de reponse de TMDB !!");
          throw new Error(tmdbResponse.status.toString());
        }
        const tmdbData: TMDBMovieResponse = await tmdbResponse.json();
        const tableauDesFilmsBruts = tmdbData.results;

        // Récupérer les données du joueur
        const joueurResponse = await fetch(`http://localhost:3100/api/score/${playerId}`);
        if (joueurResponse.status !== 200) {
          console.log("je n'ai pas eu de reponse du serveur !!");
          throw new Error(joueurResponse.status.toString());
        }
        const joueurData: DonneeSauvegarder = await joueurResponse.json();
        const scoreJoueur = joueurData.score;
        const films = joueurData.filmsTrouves;

        const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerUnFilmBruteEnFilmJeu(movie, films));
        /*
        const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerFilmBruteEnFilmJeu(movie));
        const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerUnFilmBruteEnFilmJeu(movie, films));
        */
        setScore(scoreJoueur);
        setFilmsFound(films);
        setMovies(tableauDesFilmsDuJeu);
      } catch (error) {
          alert(error)
      }
    } 
    if (playerId !== "") {
      fetchData()
    }
   }, [playerId])

   //met a jour les films chaque fois que le joueur trouve un film(remplis le input)
    useEffect(() => {
        setMovies((previousValue) => previousValue.map(isFoundMovie(titleInput)))
    },[titleInput])

    /**
     * récupération titre saisis
     * @param event 
     */
    const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
        //si il n'y a pas de film on a pas la possibilite d'ecrire dans le input
        setTitleInput(event.target.value)
    }
    //bouton recommencer
    const handleClickReset = async () =>{
      /**
       * await fetch(`http://localhost:3100/api/score/${playerId}`);
       */
      try{
        const supprimeCache = await fetch(`http://localhost:3100/api/score/${playerId}`, {
          method: "DELETE"
        });
        if (supprimeCache.status !== 200) {
          console.log("je n'ai pas eu de reponse du serveur !!!")
          throw new Error("Failed to send requeste to server");
        }

        //met à jour les films 
        const resetMovies = movies.map((movie) => ({...movie,aEteTrouve: false}))
        setMovies(resetMovies)
        setScore(0)
        setScoreState(false)
      }catch (error){
        alert (error)
      }
    }

    /** 
    * les films trouvés
    */
    useEffect(() =>{
        const filteredMovies = movies.filter((film) => film.aEteTrouve);
        const foundMovies = filteredMovies.map((film) => (film.titreOriginal))
        setFilmsFound(foundMovies)
        setScore(filteredMovies.length)

    }, [movies])

    useEffect(() =>{
        if(score > 0){
          setScoreState(true)
        }
    }, [score])

    useEffect(() =>{
        //si il n'y a aucune des parametre ou s'il n'y a pas de score ni de film ne rien envoyer
        if(scoreState === true && filmsFound && playerId){
          sendScoreToServer(score, filmsFound, playerId)
        }
    }, [filmsFound, playerId, score, scoreState])
  
    return (
        <>
          <div className="page-body">
            <h2 className="page-title"> Devine le Film à l'affiche !</h2>
              <div className="score">
                  <p>Votre score est : {score} / {movies.length}</p>
                </div>
            <div className="searchMovie">
              <input type="text" className="search-bar" placeholder="Devine le Film à l'affiche !" 
              value={titleInput} disabled={movies.length === 0} onChange={handleInputChange} ></input>
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

export default Tests;