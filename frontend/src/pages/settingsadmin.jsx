import Editor from '../components/editor.jsx'
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    return (
        <div>
            <h1>Main editor and admin view</h1>
            <h4>Still under construction...</h4>
            <Link to="/">Go back</Link>
            <Editor/>
        </div>
    );
};

export default SettingsPage;