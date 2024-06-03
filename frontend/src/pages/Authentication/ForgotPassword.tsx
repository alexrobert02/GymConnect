import React, { useState } from 'react';
import './Authentication.scss';
import api from '../../services/api'
import {toast} from "react-toastify";

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [emailFormatError, setEmailFormatError] = useState('');

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setEmailFormatError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await api.get(`/api/v1/users/check-email/${email}`);
            const data = response.data;

            if (data === 'Email exists') {
                await api.post(`/api/v1/auth/request-password-reset/${email}`)
                toast.success('Password reset email sent successfully!')
            } else if (data === 'Email not found') {
                console.log('Email not found.');
                toast.error('Email not found!')
                // Handle failed registration, e.g., display error message
            }
        } catch (error) {
            console.error('Error occurred during email check:', error);
            // Handle other errors, e.g., display error message
        }
    };

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <div className="auth-background-gradient">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-header">Reset your password</h2>
                    <p className="form-text">Enter your user account's verified email address and we will send you a password reset link.</p>
                    <form className="auth-form" onSubmit={handlePasswordReset}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailFormatError('');
                            }}
                            className="auth-input"
                            required
                        />
                        {emailFormatError && <p className="error-message">{emailFormatError}</p>}
                        <button type="submit" className="auth-button">Send password reset email</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
