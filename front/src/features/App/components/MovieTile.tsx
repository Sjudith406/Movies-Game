import { FC, useMemo } from 'react'
import { FilmJeu } from '../../../models/Movie.model'
import { Link } from 'react-router-dom'
import './MovieTile.css'

const debutURLaffichagePoster = 'https://image.tmdb.org/t/p/w185'

type MovieTileProps = {
    film: FilmJeu
}

// Movie Item
export const MovieTile: FC<MovieTileProps> = ({ film }) => {
    // Construire l'URL complet du poster en utilisant le chemin du poster du film
    const posterUrl = `${debutURLaffichagePoster}${film.posterURL}`

    const poster = useMemo(() => {
        if (film.aEteTrouve) {
            return (
                <Link to={`/movie/${film.id}`}>
                    <img
                        src={posterUrl}
                        className='poster'
                        alt={film.titreOriginal}
                    />
                </Link>
            )
        } else {
            return (
                <img
                    src={posterUrl}
                    className='poster blur'
                    alt={film.titreOriginal}
                />
            )
        }
    }, [film.aEteTrouve, film.id, posterUrl, film.titreOriginal])

    const title = useMemo(() => {
        const showedTitle = film.aEteTrouve
            ? film.titreOriginal
            : film.titreCache

        return <p className='movie-title'>{showedTitle}</p>
    }, [film.aEteTrouve, film.titreOriginal, film.titreCache])

    return (
        <div className='grid-item'>
            {poster}
            {title}
        </div>
    )
}
