import { FC, useEffect, useState } from 'react'
import { FilmJeuDetails, company, TMDBMovieDetailsResponse } from "./models/type-data"
import "./styles/MovieDetails.css"
import { useParams } from 'react-router-dom';
import { transformerUnTMDBMovieDetailsResponseEnFilmJeuDetails } from './fonctions/function-utils';

const debutURLaffichageImage = "https://image.tmdb.org/t/p/w45";


function MovieDetails() {
// const parametreDeLaRequete = useParams()
const {movieID} = useParams()

    const [moviesDetails, setMoviesDetails] = useState<FilmJeuDetails>();
    const [companiesMovie, setcompaniesMovie] = useState<company[]>([])

     // Importer la clé API depuis le fichier .env
      const TMDB_KEY = import.meta.env.VITE_API_KEY_TMDB;

    useEffect(() => {
      const viewMovie = async () => {
      // lancer la requete
    try {
      const reponse = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=fr-FR&page=1&api_key=${TMDB_KEY}`
      );

      const dataDetails: TMDBMovieDetailsResponse = await reponse.json();
      
      const detailsDuFilm = transformerUnTMDBMovieDetailsResponseEnFilmJeuDetails(dataDetails)
      const LesCompaniesDuFilm  = detailsDuFilm.production_companies.map((companie) => ({
        logo_path: `${debutURLaffichageImage}${companie.logo_path}`,
        name: companie.name,
        id: companie.id,
        origin_country: companie.origin_country
      }
      ))
      setMoviesDetails(detailsDuFilm)
      setcompaniesMovie(LesCompaniesDuFilm)
      console.log(detailsDuFilm)
      console.log(LesCompaniesDuFilm)

    } catch (error) {
      // si requete echoue; prevenir l'utilisateur
      alert(error);
    }
  };

  viewMovie();
}, []);

if(moviesDetails === undefined){
    return null
  }

    return(
        <>
        
            <div className="container">
              <h4 className="titreDuFilm">{moviesDetails.title}</h4>
              <p className=""><span>Titre original:</span>   {moviesDetails.original_title}</p>
              <p className=""><span>Pays:</span>  {moviesDetails.original_language}</p>
              <div className="body-container">
                <div className="image_film">
                  <img src={moviesDetails.poster_path} alt="" />
                </div>
                <div className="details_film">
                  <p className=""><span>Sortie:</span>    {moviesDetails.release_date}</p>
                  <p className=""><span>Durée:</span> {moviesDetails.runtime} minutes</p>
                  <p className="genre-container"><span>Genre:</span> {moviesDetails.genres.map( (genre) => (<span className="genre-item">{genre.name}</span>))}</p>
                  <p className=""><span>Résumé:</span>   {moviesDetails.overview}</p>
                  <div className="acteur-grid">
                    {companiesMovie.map((production) =>(<CompaniesComponent key={production.id} production={production}/> ))}
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}

type CompaniesComponentProps = {
  production:company
}

const CompaniesComponent: FC<CompaniesComponentProps> = ({production}) => {
  return(
    <>
      <div className="acteur-item">
        <div className="companie-image">
          <img src={production.logo_path} alt={production.name} className="acteur" />
        </div>
        <div className="companie-name">
          <p>{production.name}</p>
        </div>

      </div>
    </>
  )
} 

export default MovieDetails;
