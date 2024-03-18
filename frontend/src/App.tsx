import React from 'react';
import { createBrowserRouter } from 'react-router-dom';


import './index.css';
import LoginPage from "./pages/Authentication/Login";
import HomePage from "./pages/Home/Home";
import RegisterPage from "./pages/Authentication/Register";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    //errorElement: <NotFoundPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    //errorElement: <NotFoundPage />
  },
  {
    path: '/register',
    element: <RegisterPage/>
  }
]);

export default router;