import { Link } from 'react-router-dom';
import "../styles/main.css"

const MainPage = () => {
    return (
        <div className="mainContainer">
            <h1>Hola hola</h1>
            <Link className="navButton" to="/settings">Admin/settings</Link>
        </div>
    );
};

export default MainPage;