import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.scss';
import exerciseDbApi from '../../services/exerciseDbApi';
import backgroundImage from '../../img/8225-removebg.png'; // Import the image file

const HomePage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Fetch data from the ExerciseDB API using your custom setup
                const response = await exerciseDbApi.get('/exercises/bodyPart/back', {
                    params: { limit: '10' }
                });
                console.log("Exercise Data:", response.data);
                // Set the exercises state with the fetched data
                setExercises(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        //fetchData()

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
                </div>
            </div>
        </div>
        </div>
    );
};

export default HomePage;
