// Importe les composants nécessaires de la bibliothèque React Router DOM
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importe le composant 'Tests' depuis le fichier './App.tsx'
import Tests from './features/App/App.tsx';
import  MovieDetails from './MovieDetails.tsx'


// Définit un composant fonctionnel AppRouter qui
// Renvoie une structure de routage basée sur React Router
const AppRouter = () => {
  return (
    <Router>
       <Routes>
        {/* Définit qui spécifie le composant à rendre lorsque l'URL correspond au chemin spécifié  */}
        {/* <Route path='/' element={<PopUpName />} /> */}
        <Route path="/" element={<Tests />} />
        <Route path="/movie/:movieID" element={<MovieDetails />} />
       </Routes>
    </Router>
  );
};

// Exporte le composant AppRouter pour pouvoir l'utiliser ailleurs dans l'application
export default AppRouter;