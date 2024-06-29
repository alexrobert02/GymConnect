import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const LoginProtectedRoute = () => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default LoginProtectedRoute;
