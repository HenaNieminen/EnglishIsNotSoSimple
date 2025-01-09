import { Link } from 'react-router-dom';
import "../styles/main.css"

const MainPage = () => {
    return (
        <div className="mainContainer">
            <h1>Hola hola</h1>
            <div className='navBar'>
                <Link className="navButton" to="/settings">Admin/settings</Link>
                <Link className="navButton" to= "/quiz">Start quiz</Link>
            </div>
        </div>
    );
};

export default MainPage;