import React from 'react';
import {createBrowserRouter, Navigate, RouteObject} from 'react-router-dom';
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
import GenerateWorkout from "../pages/GenerateWorkout/GenerateWorkout";
import ForgotPasswordPage from "../pages/Authentication/ForgotPassword";
import ResetPasswordPage from "../pages/Authentication/ResetPassword";
import AuthRedirect from './authRedirect';

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" replace />;
};

const routes: RouteObject[] = [
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
        element: <PrivateRouteComponent component={ProfilePage} path="/profile" />,
      },
      {
        path: "/workout",
        element: <PrivateRouteComponent component={WorkoutPage} path="/workout" />
      },
      {
        path: "/exercises",
        element: <PrivateRouteComponent component={Exercises} path="/exercises" />
      },
      {
        path: "/exercise/:id",
        element: <PrivateRouteComponent component={ExerciseDetails} path="/exercise/:id" />
      },
      {
        path: "/generate-workout",
        element: <PrivateRouteComponent component={GenerateWorkout} path="/generate-workout" />
      },
    ],
  },
  {
    path: '/login',
    element: <AuthRedirect><LoginPage /></AuthRedirect>,
  },
  {
    path: '/register',
    element: <AuthRedirect><RegisterPage /></AuthRedirect>,
  },
  {
    path: '/forgot-password',
    element: <AuthRedirect><ForgotPasswordPage /></AuthRedirect>,
  },
  {
    path: '/reset-password/:token',
    element: <AuthRedirect><ResetPasswordPage /></AuthRedirect>,
  }
];

const router = createBrowserRouter(routes);

export default router;
