import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { DataProvider } from './context/datacontext.jsx';
import router from './router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <DataProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <RouterProvider router={router} />
        </DataProvider>
    </React.StrictMode>,
);