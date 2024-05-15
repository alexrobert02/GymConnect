import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import '../index.css';
import LoginPage from "../pages/Authentication/Login";
import HomePage from "../pages/Home/Home";
import RegisterPage from "../pages/Authentication/Register";
import LoginProtectedRoute from "./loginProtectedRoute";
import ProfilePage from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import WorkoutPage from "../pages/Workout/Workout";
import Exercises from "../pages/Exercises/Exercises";
import ExerciseDetails from "../pages/ExerciseDetails/ExerciseDetails";

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
    path: "*",
    element: <NotFound />,
  },
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
      },
      {
        path: "/workout",
        element: <PrivateRouteComponent component={WorkoutPage} path={"/workout"} />
      },
      {
        path: "/exercises",
        element: <PrivateRouteComponent component={Exercises} path={"/exercises"} />
      },
      {
        path: "/exercise/:id",
        element: <PrivateRouteComponent component={ExerciseDetails} path={"/exercise/:id"} /> // Add this line
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