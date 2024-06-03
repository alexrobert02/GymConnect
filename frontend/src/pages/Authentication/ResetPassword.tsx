import React, { useState } from 'react';
import './Authentication.scss'; // You can style your register page in Register.scss file
import api from '../../services/api'
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        function extractTokenFromUrl() {
            const url = window.location.href;
            const segments = url.split('/');
            return segments.pop() || segments.pop();  // Handle potential trailing slash
        }

        const token = extractTokenFromUrl();
        if (!token) {
            console.error('No token found in local storage');
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;

        console.log('Email:', email);

        try {
            console.log('Password:', password);
            console.log('Confirm:', confirmPassword);

            const response = await api.put('/api/v1/users/reset-password', {
                email: email,
                newPassword: password,
                confirmationPassword: confirmPassword
            });

            if (response.status === 200) {
                // Registration successful
                console.log('Password changed!');
                toast.success('Password changed!')
                navigate('/login')
            } else {
                console.log('Password reset failed!');
                toast.error('Password reset failed!');
            }
        } catch (error) {
            console.error('Error occurred during password reset:', error);
            toast.error('Error occurred during password reset!');
            // Handle error, e.g., display error message
        }
    };

    return (
        <div className="auth-background-gradient">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-header">Reset your password</h2>
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="auth-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                setPasswordMatchError('');
                            }}
                            className="auth-input"
                            required
                        />
                        {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                        <button type="submit" className="auth-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
