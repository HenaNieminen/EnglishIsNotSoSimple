import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from './context/datacontext.jsx';
import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
        <ToastContainer>
            <RouterProvider router={router} />
        </ToastContainer>
    </DataProvider>
  </StrictMode>,
)
