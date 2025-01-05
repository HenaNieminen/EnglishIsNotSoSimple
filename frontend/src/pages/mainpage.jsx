import { Link } from 'react-router-dom';
import "../styles/main.css"

const MainPage = () => {
    return (
        <>
        <h1>
            Hola hola
        </h1>
            <Link class="navButton" to="/settings">Admin/settings</Link>
        </>
    );
};

export default MainPage;