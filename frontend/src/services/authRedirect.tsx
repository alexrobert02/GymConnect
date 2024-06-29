import React, {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};

interface AuthRedirectProps {
    children: ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
    return isAuthenticated() ? <Navigate to="/home" replace /> : <>{children}</>;
};

export default AuthRedirect;
