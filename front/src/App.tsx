import  {  ChangeEvent, FC, useEffect, useState } from "react";
import { FilmJeu, TMDBMovieResponse } from "./models/type-data"
import "./styles/App.css";
import { Link } from "react-router-dom";
import { charger, isFoundMovie, sauvegarder, transformerUnFilmBruteEnFilmJeu } from "./fonctions/function-utils";


const debutURLaffichagePoster = "https://image.tmdb.org/t/p/w185"; 

function Tests() {
  const [movies, setMovies] = useState<FilmJeu[]>([]);
  const [titleInput, setTitleInput] = useState<string>("")

  // Importer la clé API depuis le fichier .env
  const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;

  useEffect(() => {
  const searchMovie = async () => {

    const loadedFoundMovies = charger();
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
    } catch (error) {
      // si requete echoue; prevenir l'utilisateur
      alert(error);
    }
  };

  searchMovie();
}, []);

useEffect(() => {
  const _prochainFilms = movies.map(isFoundMovie(titleInput))
  setMovies(_prochainFilms)

   // Filtrer les films déjà trouvés
    const filteredMovies = _prochainFilms.filter((film) => film.aEteTrouve);
    const foundMovies = filteredMovies.map((film) => (film.titreOriginal))
    if(_prochainFilms.length !== 0) {
      sauvegarder(foundMovies);
    }
},[titleInput])

const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {

  setTitleInput(event.target.value)
  console.log(event.target.value)
}
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
