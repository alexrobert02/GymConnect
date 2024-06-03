import React from 'react';
import { Card } from 'antd';
import { ExerciseType } from "../Workout/ExerciseTable";
const { Meta } = Card;


const SimilarExercises: React.FC<ExerciseType> = ({name, gifUrl }) => {
    return (
        <Card
            hoverable
            style={{width: '250px', borderRadius: '9px'}}
            cover={
                <img
                    alt={name}
                    src={gifUrl}
                />
            }
        >
            <Meta title={name} />
        </Card>
    );
};

export default SimilarExercises;
