import { useState } from "react";
import { Link } from "react-router-dom";

function PopUpName (){
    const [userName, setUserName] = useState<string>('');

    return (
        <>
            <div className="username-popup">
            <h1>Bienvenue !</h1>
            <p>Veuillez choisir votre pseudo :</p>
                <form >
                <input
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                />
                <Link to={`/game/${userName}`}><button type="submit">Valider</button></Link>
                </form>
            </div>
        </>
    );
}
export default PopUpName