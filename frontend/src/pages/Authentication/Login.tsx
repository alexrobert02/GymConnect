import React, { useState } from 'react';
import './Authentication.scss';
import api from '../../services/api'
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/v1/auth/authenticate', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                // Authentication successful
                const data = await response.data
                console.log('Authentication successful:', data);
                // Store the access token in localStorage
                localStorage.setItem('token', data.access_token);
                // Handle successful login, e.g., redirect to dashboard
                navigate('/home')
            } else {
                // Authentication failed
                console.log('Authentication failed');
                // Handle failed login, e.g., display error message
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
            // Handle error, e.g., display error message
        }
    };

    return (
        <div className="background-gradient">
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-header">Login</h2>
                <form className="auth-form" onSubmit={e => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <button type="submit" onClick={handleLogin} className="auth-button">Login</button>
                </form>
                <p className="forgot-password">Forgot your password? <a href="#">Reset it here</a></p>
                <p className="signup-link">Don't have an account? <a href="/register">Sign up now</a></p>
            </div>
        </div>
        </div>
    );
}

export default LoginPage;
