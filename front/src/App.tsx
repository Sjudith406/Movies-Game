import  {  ChangeEvent, FC, useEffect, useState } from "react";
import { FilmJeu, TMDBMovieResponse } from "./models/type-data"
import "./styles/App.css";
import { Link } from "react-router-dom";
import { charger, isFoundMovie, sauvegarder, transformerUnFilmBruteEnFilmJeu } from "./fonctions/function-utils";
import {v4 as uuidv4} from "uuid";


const debutURLaffichagePoster = "https://image.tmdb.org/t/p/w185"; 

export const sauvegarderId = (identifiant: string): void => {
  
  localStorage.setItem("idJoueur", identifiant)
}
export const chargerId = (): string => {
  const value = localStorage.getItem("idJoueur")
  if (value === null){
    return ""
  }
  else {
    return value
  }
}


function Tests() {
  const [movies, setMovies] = useState<FilmJeu[]>([]);
  const [titleInput, setTitleInput] = useState<string>("")
  const [score, setScore]= useState<number>(0)
  const [filmsFound, setFilmsFound] = useState<string[]>([])
  const [playerId, setPlayerId] = useState<string>("")


  /*
    useEffect(() => {
    const idFromlocalStorage = localStorage.getItem("playerId")
    if(idFromlocalStorage) {
      setPlayerId(idFromlocalStorage)
    }
    else{
      const newP = uuidv4()
      setPlayerId(newP)
      localStorage.setItem("playerId", newP)
    }
   }, []) 
  */
  
   useEffect(() => {
    const idFromlocalStorage = chargerId()
    if(idFromlocalStorage) {
      setPlayerId(idFromlocalStorage)
    }
    else{
      const newP = uuidv4()
      setPlayerId(newP)
      sauvegarderId(newP)
    }
    console.log("mon iidd : ", playerId)
   }, []) 

  // Importer la clé API depuis le fichier .env
  const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;

  useEffect(() => {
  const searchMovie = async () => {

    const loadedFoundMovies = charger();
    console.log("load : ",loadedFoundMovies)
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
      const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerUnFilmBruteEnFilmJeu(movie, loadedFoundMovies))

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

useEffect(() =>{
  const filteredMovies = movies.filter((film) => film.aEteTrouve);
  const foundMovies = filteredMovies.map((film) => (film.titreOriginal))
  setFilmsFound(foundMovies)
    //mettre à jour le score du joueur
    setScore(filteredMovies.length )
     if(filteredMovies.length !== 0) {
      sauvegarder(foundMovies);
    }
  }, [movies])

useEffect(() =>{
    console.log("vrai score : ", score)
    sendScoreToServer(score, filmsFound, playerId)
    console.log("le score envoyer : ", score)
  }, [score])

  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {

    setTitleInput(event.target.value)
  }
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
                <Link to={`/movie/${film.id} `}>
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

