
import './SearchMoviePanel.css'

type SearchMoviePanelProps = {
    text: string
    disabled: boolean
    onSubmit: () => void
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
                className="validerProposition"
                onClick={props.onSubmit}
            >   
                valider

            </button>
        </>
    )
}

export default SearchMoviePanel
