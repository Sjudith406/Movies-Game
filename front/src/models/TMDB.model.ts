import { FilmBrute } from './Movie.model'

export type TMDBResponse<T> = {
    page: number
    results: T[]
}

export type TMDBMovieResponse = TMDBResponse<FilmBrute> & {
    dates: {
        maximum: string
        minimum: string
    }
}
