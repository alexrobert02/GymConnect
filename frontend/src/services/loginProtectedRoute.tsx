import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import AppFooter from "../components/Footer";


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const LoginProtectedRoute = () => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      <Outlet />
    {/*<AppFooter />*/}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default LoginProtectedRoute;
