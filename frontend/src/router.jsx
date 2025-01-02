import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/mainpage.jsx';
import NotFoundPage from './pages/errorpage.jsx'
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <NotFoundPage />,
    },
    {
        path: '/settings',
        errorElement: <NotFoundPage />,
    },
]);

export default router;