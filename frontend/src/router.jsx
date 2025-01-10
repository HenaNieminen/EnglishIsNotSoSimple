import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/mainpage.jsx';
import NotFoundPage from './pages/errorpage.jsx';
import SettingsPage from './pages/settingsadmin.jsx';
import QuizPage from './pages/quizpage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <NotFoundPage />,
    },
    {
        path: '/settings',
        element: <SettingsPage />,
        errorElement: <NotFoundPage />,
    },
    {
        path: '/quiz',
        element: <QuizPage />,
        errorElement: <NotFoundPage />,
    },
    /*In case you went directly to the quiz page, this will
    redirect you back to the main page*/
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default router;