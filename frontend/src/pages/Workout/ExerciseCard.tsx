// ExerciseCard.js

import React from 'react';
import './ExerciseCard.scss'

const ExerciseCard = ({ exercise }: { exercise: { id: number, title: string, imageUrl: string } }) => {
    return (
        <div className="exercise-card">
            <h3>{exercise.title}</h3>
            <div className="image-container">
            <img src={exercise.imageUrl} alt={exercise.title} className="exercise-image" />
            </div>
        </div>
    );
};

export default ExerciseCard;
