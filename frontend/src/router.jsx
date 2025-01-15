import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/mainpage.jsx';
import NotFoundPage from './pages/errorpage.jsx';
import SettingsPage from './pages/settingsadmin.jsx';
import QuizPage from './pages/quizpage.jsx';

//React router configuration
const router = createBrowserRouter([
    //Path to main page
    {
        path: '/',
        element: <MainPage />,
        errorElement: <NotFoundPage />,
    },
    //Path to settings
    {
        path: '/settings',
        element: <SettingsPage />,
        errorElement: <NotFoundPage />,
    },
    //Path to quiz
    {
        path: '/quiz',
        element: <QuizPage />,
        errorElement: <NotFoundPage />,
    },
    /*In case you went anywhere else, throw the notfoundpage*/
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default router;
