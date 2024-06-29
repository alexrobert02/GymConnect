import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from 'antd'; // Import Button from antd
import './Home.scss';
//import backgroundImage from '../../img/8225-removebg.png'; // Import the image file
import backgroundImage from '../../img/background.png';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated (you might have your own logic here)
        const token = localStorage.getItem('token');
        console.log("Token: ", token);
        //fetchData()
    }, [navigate]);

    return (
        <div className="home-background-gradient-home">
            <div className="home-container">
                <div className="home-grid-container">
                    <header className="home-header">
                        <h1>Welcome to GymConnect</h1>
                    </header>
                    <div className="home-background-wrapper">
                        <img src={backgroundImage} alt="Background" className="home-background-image"/>
                    </div>
                    <div className="home-start-journey">
                        <h2>Start your journey here</h2>
                        <div className="home-buttons">
                            <Button className={"border-shadow"} type="primary" onClick={() => navigate('/workout')}>Create Workout</Button>
                            <Button className={"border-shadow"} type="default" onClick={() => navigate('/generate-workout')}>Generate Workout using AI</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
