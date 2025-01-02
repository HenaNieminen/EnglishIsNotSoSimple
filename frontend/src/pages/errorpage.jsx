import { Link } from 'react-router-dom';
import "../styles/main.css"

export default function NotFoundPage() {
    //Returns an error element for the router
    return (
        <div className="windowColumn">
            <h1>404: Not found</h1>
            <div>
                <Link className="navButton" to="/">Go back to the main page</Link>
            </div>
        </div>
    );
};
