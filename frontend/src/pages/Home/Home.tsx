import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import './Home.scss';

const HomePage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated (you might have your own logic here)
        const token = localStorage.getItem('token');
        console.log("Token: ", token);
        if (token != null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/login')
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <header>
                <h1>Welcome to GymConnect</h1>
            </header>
            <main>
                <section className="friends-section">
                    <h2>Your Gym Friends</h2>
                    {/* Display list of friends here */}
                </section>
            </main>
        </div>
    );
};

export default HomePage;
