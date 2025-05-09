import { Link } from 'react-router-dom';
import "../styles/main.css"

const MainPage = () => {
    //Just includes navigation to settings and to page where users can start the quiz
    return (
        <div className="mainContainer">
            <h1>English is not so simple</h1>
            <div className='navBar'>
                <Link className="navButton" to="/settings">Admin/settings</Link>
                <Link className="navButton" to= "/quiz">To quiz</Link>
            </div>
        </div>
    );
};

export default MainPage;
