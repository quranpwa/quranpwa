import React from 'react'
import ReactDOM from 'react-dom/client'
import Quran from './routes/quran.tsx'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/root.tsx'
import About from './routes/about.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    },
    {
        path: "/quran",
        element: <Quran />
    },
    {
        path: "/about",
        element: <About />
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
