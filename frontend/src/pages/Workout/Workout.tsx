import React, { useEffect, useState } from 'react';
import './Workout.scss';
import { Alert, Button, Modal, Spin } from 'antd'; // Import Spin component
import ExerciseTable, { ExerciseDataType } from './ExerciseTable';
import NewTableForm from './NewTableForm';
import WorkoutGrid from './WorkoutGrid'; // Importing WorkoutGrid component
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { jwtDecode } from 'jwt-decode';
import { securedInstance } from '../../services/api';
import axios from 'axios';
import { v4 } from 'uuid';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export interface Workout {
    id: string;
    userId: string;
    day: string;
    userExercises: ExerciseDataType[];
}

const extractToken = () => {
    try {
        let token: string | null = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage');
            return null;
        }
        return token;
    } catch (err) {
        console.error('Failed to decode token', err);
        return null;
    }
};

const WorkoutPage = () => {
    const [isModified, setIsModified] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [workoutList, setWorkoutList] = useState<Workout[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error message

    const fetchData = () => {
        setLoading(true); // Set loading to true when starting fetch
        setError(null); // Clear previous error
        const token = extractToken();
        if (!token) {
            console.error('No token found in local storage');
            setLoading(false); // Set loading to false in case of error
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;
        console.log('email:', email);
        if (email) {
            axiosInstance
                .get(`/users/email/${email}`)
                .then(response => {
                    setUserId(response.data.id);
                    console.log('User id found.');
                    return response.data.id;
                })
                .then(id => {
                    console.log(id);
                    securedInstance
                        .get(`http://localhost:8082/api/v1/workout/user/${id}`)
                        .then(response => {
                            console.log('Fetch successful');
                            setWorkoutList(response.status === 404 ? [] : response.data);
                            console.log(response.data);
                            setLoading(false); // Set loading to false after successful fetch
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            setError('Error fetching data.'); // Set error message
                            setLoading(false); // Set loading to false in case of error
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setError('Error fetching data.'); // Set error message
                    setLoading(false); // Set loading to false in case of error
                });
        }
    };

    useEffect(() => {
        fetchData();
        console.log('useEffect');
    }, [isModified]);

    console.log("Error variable:", error)

    return (
        <div className="workout-page">
            <Spin spinning={loading} fullscreen />
            {error && <Alert
                message={error}
                description="Please try again."
                type="error"
                showIcon
            />} {/* Display error message if exists */}
            {!loading && !error && (
                <Button type="primary" onClick={() => setFormVisible(true)}>
                    Add New Workout Day
                </Button>
            )}
            {/* Render Spin component while loading */}
            <WorkoutGrid
                // Using WorkoutGrid component to display workouts
                workoutList={workoutList}
                setWorkoutList={setWorkoutList}
                isModified={isModified}
                setIsModified={setIsModified}
            />
            <NewTableForm
                workoutId={''}
                day={''}
                action={'create'}
                title={'Add New Workout Day'}
                isModalOpen={formVisible}
                setIsModalOpen={setFormVisible}
                isModified={isModified}
                setIsModified={setIsModified}
            ></NewTableForm>
        </div>
    );
};

export default WorkoutPage;
