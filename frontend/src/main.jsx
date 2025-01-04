import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer>
        <RouterProvider router={router} />
    </ToastContainer>
  </StrictMode>,
)
