// Workout.tsx

import React from 'react';
import ExerciseCard from './ExerciseCard';
import './Workout.scss'

const WorkoutPage = () => {
    // Sample exercise data
    const exerciseData = [
        { id: 1, title: 'Push-ups', imageUrl: 'https://v2.exercisedb.io/image/9ADUgzISkulyGQ' },
        { id: 2, title: 'Squats', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg' },
        { id: 3, title: 'Plank', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg' },
        { id: 4, title: 'Burpees', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg' }
    ];

    return (
        <div className="exercise-grid">
            {exerciseData.map(exercise => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </div>
    );
};

export default WorkoutPage;
