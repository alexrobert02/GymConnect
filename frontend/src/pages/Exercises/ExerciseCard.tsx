import React from 'react';
import { Card, Button, Flex } from 'antd'; // Import Flex from Ant Design
import { ExerciseType } from "../Workout/ExerciseTable";
import './ExerciseCard.scss';
const { Meta } = Card;

export interface ExerciseCardProps {
    exercise: ExerciseType;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
    return (
        <Card className={"border-shadow"}
            hoverable
            style={{ width: '250px', borderRadius: '9px' }}
            cover={
                <img
                    alt={exercise.name}
                    src={exercise.gifUrl}
                />
            }
        >
            <Flex justify="space-between" style={{ marginBottom: '20px'}}>
                {/* Button for bodyPart */}
                <Button type="primary" className={"border-shadow"}>
                    {exercise.bodyPart}
                </Button>
                {/* Button for target */}
                <Button type="default" className={"border-shadow"}>
                    {exercise.target}
                </Button>
            </Flex>
            <Meta title={exercise.name} style={{ textAlign: 'center' }} />
        </Card>
    );
};

export default ExerciseCard;
