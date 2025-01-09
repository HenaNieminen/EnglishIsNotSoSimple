import { Link } from 'react-router-dom';
import "../styles/main.css"

const MainPage = () => {
    return (
        <div className="mainContainer">
            <h1>Welcome!</h1>
            <div className='navBar'>
                <Link className="navButton" to="/settings">Admin/settings</Link>
                <Link className="navButton" to= "/quiz">To quiz</Link>
            </div>
        </div>
    );
};

export default MainPage;