import Editor from '../components/editor.jsx';
import Adder from '../components/adder.jsx';
import { Link } from 'react-router-dom';
import "../styles/main.css";

const SettingsPage = () => {
    //Main wrapper for the settings and summon of adder and editor component
    return (
        <div className="mainContainer">
            <h1>Main editor and admin view</h1>
            <h4>Still under construction...</h4>
            <Link className="navButton"  to="/">Go back</Link>
            <Adder/>
            <Editor/>
        </div>
    );
};

export default SettingsPage;
