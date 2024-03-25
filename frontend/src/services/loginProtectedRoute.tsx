import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
//import Navbar from "../../components/Layout/Navbar";

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
