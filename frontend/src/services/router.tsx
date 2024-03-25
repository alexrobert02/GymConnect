import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import '../index.css';
import LoginPage from "../pages/Authentication/Login";
import HomePage from "../pages/Home/Home";
import RegisterPage from "../pages/Authentication/Register";
import LoginProtectedRoute from "./loginProtectedRoute";
import Home from "../pages/Home/Home";
import ProfilePage from "../pages/Profile/Profile";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

type PrivateRouteProps = {
  component: React.ComponentType<any>;
  path: string;
};

const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <PrivateRouteComponent component={HomePage} path="/home" />,
      },
      {
        path: "/",
        element: <Navigate to={"/login"} />,
      },
      {
        path: "/profile",
        element: <PrivateRouteComponent component={ProfilePage} path="/home" />,
      }
    ],
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