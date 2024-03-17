import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    chargerId,
    isFoundMovie,
    sauvegarderId,
} from '../../fonctions/function-utils'
import { v4 as uuidv4 } from 'uuid'
import { FilmJeu } from '../../models/Movie.model'
import './App.css'
import { fetchGameData } from '../../services/TMDB.service'
import { resetGame, saveGame } from '../../services/Save.service'
import SearchMoviePanel from './components/SearchMoviePanel'
import { MovieTile } from './components/MovieTile'

function Tests() {
    const [playerId, setPlayerId] = useState<string>(chargerId())
    const [movies, setMovies] = useState<FilmJeu[]>([])
    const [titleInput, setTitleInput] = useState<string>('')
    const [filmsFound, setFilmsFound] = useState<string[]>([])
    const [score, setScore] = useState<number>(0)
    const [scoreState, setScoreState] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [userName, setUserName] = useState<string>('');
    /**
     * identifiaant du joueur
     */

    useEffect(() => {
        if (playerId === '') {
            const newP = uuidv4()
            setPlayerId(newP)
            sauvegarderId(newP)
        }
        console.log('mon uuid : ', playerId)
    }, [playerId])

    useEffect(() => {
        const initGame = async (requestedID: string) => {
            const gameData = await fetchGameData(requestedID)
            setScore(gameData?.score || 0)
            setFilmsFound(gameData?.films || [])
            setMovies(gameData?.jeu || [])
        }
        if (playerId !== '') {
            try {
                initGame(playerId)
            } catch (error) {
                alert(error)
            }
        }
    }, [playerId])

    //met a jour les films chaque fois que le joueur trouve un film(remplis le input)
    /*useEffect(() => {
        setMovies((previousValue) =>
            previousValue.map(isFoundMovie(titleInput))
        )
    }, [titleInput])*/

    /**
     * les films trouvés
     */
    useEffect(() => {
        const filteredMovies = movies.filter((film) => film.aEteTrouve)
        const foundMovies = filteredMovies.map((film) => film.titreOriginal)
        setFilmsFound(foundMovies)
        setScore(filteredMovies.length)

    }, [movies])

    useEffect(() => {
        if (score > 0) {
            setScoreState(true)
        }
    }, [score])

    useEffect(() => {
        //si il n'y a aucune des parametre ou s'il n'y a pas de score ni de film ne rien envoyer
        if (scoreState === true && filmsFound && playerId && userName) {
            saveGame(playerId, userName, score, filmsFound)
        }
    }, [filmsFound, playerId, score, scoreState, userName])

    //bouton recommencer
    const handleClickReset = useCallback(async () => {
        try {
            await resetGame(playerId)
            //met à jour les films
            const resetMovies = movies.map((movie) => ({
                ...movie,
                aEteTrouve: false,
            }))
            setMovies(resetMovies)
            setScore(0)
            setScoreState(false)
        } catch (error) {
            alert(error)
        }
    }, [movies, playerId])

    const handlePopupSubmit = () => {
        // Masquer le popup
        setShowPopup(false);
      };
    /**
     * récupération titre saisis
     * @param event
     */
    const handleInputChange = (inputString: string) =>
        setTitleInput(inputString) 
        
    //bouton valider
    const handleClickSubmit = useCallback(() => {
        //verifie si le le titre correspond a un film
         const filmSaisi = movies.find((movie) => movie.titreOriginal.toLowerCase() === titleInput.toLowerCase());
        if(filmSaisi){
            setMessage('Film trouve !!')
        }else {
            setMessage('Saisi incorrect !')
        }

        setTimeout(() => {
            setMessage('');
        }, 6000);
        setMovies((previousValue) =>
                previousValue.map(isFoundMovie(titleInput))
        )
        setTitleInput('')
    }, [movies, titleInput])

    /*useEffect(() => {
        const timeoutId = setTimeout(() => {
          setMessage('');
        }, 800);
    
        return () => clearTimeout(timeoutId);
      }, [message]);*/

    const movieTiles = useMemo(() => {
        return movies.map((film) => (
            <MovieTile
                key={film.id}
                film={film}
            />
        ))
    }, [movies])

    const scoreDisplay = useMemo(() => {
        return (
            <p>
                Votre score est : {score} / {movies.length}
            </p>
        )
    }, [score, movies.length])

    return (
        <>
            <div className='page-body'>
            <button className='btn-restart' onClick={handleClickReset} disabled={filmsFound.length === 0}>recommencer</button>
                <h2 className='page-title'> Devine le Film à l'affiche !</h2>
                <div className='score'>{scoreDisplay}</div>

                {showPopup && (
                    <div className="popup">
                        <h3>Choisissez votre pseudo :</h3>
                        <input
                       
                        className="pseudo"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        />
                        <button className="validerPseudo" onClick={handlePopupSubmit}>Valider</button>
                    </div>
                )}

                <div className='searchMovie'>
                    <SearchMoviePanel
                        text={titleInput}
                        disabled={movies.length === 0}
                        onSubmit={handleClickSubmit}
                        onTextChange={handleInputChange}
                    />
                </div>
                {<p className='messageAfficher'>{message}</p>}
                <div className='film-container'>{movieTiles}</div>
            </div>
        </>
    )
}

export default Tests
