// ExerciseCard.js

import React from 'react';
import './ExerciseCard.scss'

const ExerciseCard = ({ exercise }: { exercise: { id: number, title: string, imageUrl: string, sets: number, reps: number[], weight: number, rest: number } }) => {
    return (
        <div className="exercise-card">
            <h3>{exercise.title}</h3>
            {/*<div className="image-container">*/}
            {/*    <img src={exercise.imageUrl} alt={exercise.title} className="exercise-image" />*/}
            {/*</div>*/}
            <div className="exercise-details">
                <p><strong>Sets:</strong> {exercise.sets}</p>
                <p><strong>Reps:</strong> {exercise.reps}</p>
                <p><strong>Weight:</strong> {exercise.weight}</p>
                <p><strong>Rest between sets:</strong> {exercise.rest}</p>
            </div>
        </div>
    );
};

export default ExerciseCard;
