import React from 'react'
import './SearchMoviePanel.css'

type SearchMoviePanelProps = {
    text: string
    disabled: boolean
    onReset: () => void
    onTextChange: (text: string) => void
}

const SearchMoviePanel = (props: SearchMoviePanelProps) => {
    return (
        <>
            <input
                type='text'
                className='search-bar'
                placeholder="Devine le Film à l'affiche !"
                value={props.text}
                disabled={props.disabled}
                onChange={(event) => props.onTextChange(event.target.value)}
            />
            <button
                className='btn-restart'
                onClick={props.onReset}
            >
                recommencer
            </button>
        </>
    )
}

export default SearchMoviePanel
