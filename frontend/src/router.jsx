import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/mainpage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/settings',
    },
]);

export default router;