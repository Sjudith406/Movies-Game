import { FC } from "react";
import { MovieComponentProps } from "../models/type-data";
import { Link } from "react-router-dom";

const debutURLaffichagePoster = "https://image.tmdb.org/t/p/w185";

// Movie Item
export const MovieComponent: FC<MovieComponentProps> = ({film}) => {
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