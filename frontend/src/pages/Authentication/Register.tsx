import React, { useState } from 'react';
import './Authentication.scss'; // You can style your register page in Register.scss file

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [emailFormatError, setEmailFormatError] = useState('');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setEmailFormatError('Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordMatchError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                // Registration successful
                const data = await response.json();
                console.log('Registration successful:', data);
                // Handle successful registration, e.g., redirect to login page
            } else {
                // Registration failed
                console.log('Registration failed');
                // Handle failed registration, e.g., display error message
            }
        } catch (error) {
            console.error('Error occurred during registration:', error);
            // Handle error, e.g., display error message
        }
    };

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-header">Create an Account</h2>
                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailFormatError('');
                        }}
                        className="auth-input"
                        required
                    />
                    {emailFormatError && <p className="error-message">{emailFormatError}</p>}
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
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="login-link">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
}

export default RegisterPage;