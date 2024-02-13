import  {ChangeEvent, useEffect, useState } from "react";

import { MovieComponent, chargerId, isFoundMovie, sauvegarderId, transformerFilmBruteEnFilmJeu } from "./fonctions/function-utils";
import {v4 as uuidv4} from "uuid";
import { FilmJeu, TMDBMovieResponse } from "./models/type-data";
import "./styles/App.css"
import { sendScoreToServer } from "./fonctions/function-server";


// Importer la clé API depuis le fichier .env
const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;


function Tests(){
    const [playerId, setPlayerId] = useState<string>(chargerId());
    const [movies, setMovies] = useState<FilmJeu[]>([])
    const [titleInput, setTitleInput] = useState<string>("")
    const [filmsFound, setFilmsFound] = useState<string[]>([])
    const [score, setScore]= useState<number>(0)


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
      const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerFilmBruteEnFilmJeu(movie));
      setMovies(tableauDesFilmsDuJeu);
        } catch (error) {
            alert(error)
        }
    } 
    fetchData()

   }, [])

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
        if(movies.length === 0) {
            return;
        }
        setTitleInput(event.target.value)
    }
    //bouton recommencer
    const handleClickReset = () =>{
        const resetMovies = movies.map((movie) => ({...movie,aEteTrouve: false}))
        setMovies(resetMovies)
      }

    /** 
    * les films trouvés
    */
    useEffect(() =>{
        const filteredMovies = movies.filter((film) => film.aEteTrouve);
        const foundMovies = filteredMovies.map((film) => (film.titreOriginal))
        console.log("foundMovies : ", foundMovies)
        console.log("filteredMovies : ", filteredMovies)
        setFilmsFound(foundMovies)
        setScore(filteredMovies.length)
    }, [movies])

    useEffect(() =>{
        //si il n'y a aucune des parametre ou s'il n'y a pas de score ni de film ne rien envoyer
        sendScoreToServer(score, filmsFound, playerId)
        // console.log("vrai score : ", score)
        // console.log("lesFilmsEnvoyer : ",filmsFound )
        // console.log("le score envoyer : ", score)
      }, [filmsFound, playerId, score])
  
    return (
        <>
          <div className="page-body">
            <h2 className="page-title"> Devine le Film à l'affiche !</h2>
              <div className="score">
                  <p>Votre score est : {score} / {movies.length}</p>
                </div>
            <div className="searchMovie">
              <input type="text" className="search-bar" placeholder="Devine le Film à l'affiche !" 
              value={titleInput} onChange={handleInputChange} ></input>
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