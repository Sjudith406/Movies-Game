export type TMDBMovieResponse = {
    dates: {
        "maximum": string,
        "minimum": string
    },
    page: 1,
    results: FilmBrute[]
}

export type FilmBrute =  {
            "adult": boolean,
            "backdrop_path": string,
            "genre_ids": number[],
            "id": number,
            "original_language": string,
            "original_title": string,
            "overview": string,
            "popularity": number,
            "poster_path": string,
            "release_date": string,
            "title": string,
            "video": boolean,
            "vote_average": number,
            "vote_count": number
        }
        
export type FilmJeu = {
    id:number
    posterURL: string
    titreOriginal:string
    titreCache: string
    aEteTrouve: boolean
}

export type company =   {
            "id": number,
            "logo_path": string,
            "name": string,
            "origin_country": string
        }

type unGenre = {
    "id": number,
    "name": string
}

export type TMDBMovieDetailsResponse = {
    
    "adult": boolean,
    "backdrop_path": string,
    "belongs_to_collection": null,
    "budget": number,
    "genres": unGenre[],
    "homepage": string,
    "id": number,
    "imdb_id": string,
    "original_language": string,
    "original_title": string,
    "overview": string,
    "popularity": number,
    "poster_path": string,
    "production_companies": company[],
    "release_date": string,
    "revenue": number,
    "runtime": number,
    "spoken_languages": string[],
    "status": string,
    "tagline": string,
    "title": string,
    "video": boolean,
    "vote_average": number,
    "vote_count": number
}

export type FilmJeuDetails = {
    id: number,
    title: string,
    original_title: string,
    original_language: string,
    poster_path: string,
    release_date: string,
    runtime: number,
    genres: unGenre[],
    overview: string,
    production_companies: company[]

}

export type DonneeSauvegarder = {
    user : string
    score : number
    filmsTrouves : string[]
  }
  
export type MovieComponentProps = {
    film: FilmJeu
  }