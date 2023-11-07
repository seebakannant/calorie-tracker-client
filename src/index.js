import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import HomePage from "./Pages/HomePage";
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./calories-style.css";

const router = createBrowserRouter([
    {
        path: "/home",
        element: < HomePage />,
    },
    {
        path: "/login",
        element: < LoginPage />,
    },
    {
        path: "/",
        element: < LoginPage />,
    },
    {
        path: "/sign-up",
        element: < SignupPage />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CookiesProvider>
            <RouterProvider router={router} />
        </CookiesProvider>
    </React.StrictMode>
);
