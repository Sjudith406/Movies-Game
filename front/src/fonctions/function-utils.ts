import {FilmBrute, FilmJeu} from "../models/type-data"
import { FilmJeuDetails, TMDBMovieDetailsResponse } from "../models/type-data"

const debutURLaffichagePoster = "https://image.tmdb.org/t/p/w185";
const debutURLaffichagePosterDetails = "https://image.tmdb.org/t/p/w342";

export function TextHidden(titreDuFilm: string){

  let charOTitle = "" 
  for(let i = 0; i< titreDuFilm.length; i++){
    if(titreDuFilm[i] !== " "){
      charOTitle += "*"
    }else{
      charOTitle += " "
    }
  }
  return charOTitle
}

export const isFoundMovie = (uneProposition:string)=> (unFilmJeu:FilmJeu):FilmJeu =>{
  
  if(unFilmJeu.aEteTrouve){
    return unFilmJeu
  }
  const filmDevine = unFilmJeu.titreOriginal.toLowerCase() === uneProposition.toLowerCase()
  return {
    id:unFilmJeu.id,
    titreOriginal:unFilmJeu.titreOriginal,
    posterURL: unFilmJeu.posterURL,
    titreCache: unFilmJeu.titreCache,
    aEteTrouve: filmDevine
  }
}

export function transformerUnFilmBruteEnFilmJeu(unFilmBrute:FilmBrute, unLoadedFoundMovies:string[]): FilmJeu {
  const unTitreCache = TextHidden(unFilmBrute.title)
  const unPosterURL = `${debutURLaffichagePoster}${unFilmBrute.poster_path}`
    const filmCharger = unLoadedFoundMovies.find((loadedFilm) => loadedFilm === unFilmBrute.title);
  return {
    id: unFilmBrute.id,
    titreCache: unTitreCache,
    titreOriginal: unFilmBrute.title,
    posterURL: unPosterURL,
    aEteTrouve: filmCharger ? true : false
  }
} 

//brouillon

export function transformerFilmBruteEnFilmJeu(unFilmBrute:FilmBrute): FilmJeu {
  const unTitreCache = TextHidden(unFilmBrute.title)
  const unPosterURL = `${debutURLaffichagePoster}${unFilmBrute.poster_path}`
  return {
    id: unFilmBrute.id,
    titreCache: unTitreCache,
    titreOriginal: unFilmBrute.title,
    posterURL: unPosterURL,
    aEteTrouve: false
  }
} 

/*export const sauvegarder = (filmsTrouves: string[]): void => {
  
  localStorage.setItem("FILMS", JSON.stringify(filmsTrouves))
}
export const charger = (): string[] => {
  const value = localStorage.getItem("FILMS")
  if (value === null){
    return []
  }
  else {
    return JSON.parse(value)
  }
}*/

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
export function transformerUnTMDBMovieDetailsResponseEnFilmJeuDetails(unTMDBDetails:TMDBMovieDetailsResponse): FilmJeuDetails {
  
  const unPosterURL = `${debutURLaffichagePosterDetails}${unTMDBDetails.poster_path}`
  return {
    id: unTMDBDetails.id,
    title: unTMDBDetails.title,
    original_title: unTMDBDetails.original_title,
    original_language: unTMDBDetails.original_language,
    poster_path: unPosterURL,
    release_date: unTMDBDetails.release_date,
    runtime: unTMDBDetails.runtime,
    genres: unTMDBDetails.genres,
    overview: unTMDBDetails.overview,
    production_companies: unTMDBDetails.production_companies
  }
} 


