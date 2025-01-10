import { Link } from 'react-router-dom';
import "../styles/main.css"

export default function NotFoundPage() {
    //Returns an error element for the router
    return (
        <div className='mainContainer'>
            <h1>Something went wrong</h1>
            <div className='navBar'>
                <Link className="navButton" to="/"> Return to main menu </Link>
            </div>
        </div>
    );
};
