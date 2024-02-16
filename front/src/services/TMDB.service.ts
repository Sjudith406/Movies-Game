import { transformerUnFilmBruteEnFilmJeu } from '../fonctions/function-utils'
import { TMDBMovieResponse } from '../models/TMDB.model'
import { loadGame } from './Save.service'
import { TMDB_KEY } from './TMDB.constants'

export const fetchGameData = async (playerId: string) => {
        // Récupérer les films depuis l'API TMDB
        const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1&api_key=${TMDB_KEY}`
        )
        if (tmdbResponse.status !== 200) {
            console.log("je n'ai pas eu de reponse de TMDB !!")
            throw new Error(tmdbResponse.status.toString())
        }
        const tmdbData: TMDBMovieResponse = await tmdbResponse.json()
        const tableauDesFilmsBruts = tmdbData.results

        const joueurData = await loadGame(playerId)
        const scoreJoueur = joueurData.score
        const films = joueurData.filmsTrouves

        const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) =>
            transformerUnFilmBruteEnFilmJeu(movie, films)
        )
        return {
            score: scoreJoueur,
            films,
            jeu: tableauDesFilmsDuJeu,
        }
        /*
const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerFilmBruteEnFilmJeu(movie));
const tableauDesFilmsDuJeu = tableauDesFilmsBruts.map((movie) => transformerUnFilmBruteEnFilmJeu(movie, films));
*/

}
