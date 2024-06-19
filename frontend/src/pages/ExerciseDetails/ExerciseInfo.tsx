import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { ExerciseType } from "../Workout/ExerciseTable";

const cardStyle: React.CSSProperties = {
    margin: '5%',
    padding: '20px'
};

const imgContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    minHeight: 200, // Set a minimum height to prevent the image from collapsing
};

interface ExerciseInfoProps {
    exercise: ExerciseType | undefined
}

const ExerciseInfo: React.FC<ExerciseInfoProps> = ({exercise}) => {

    return (
        <Card hoverable style={cardStyle}>
            <Row gutter={[32, 32]}> {/* Add gutter to create space between columns and rows */}
                <Col xs={24} md={8} style={imgContainerStyle}> {/* Image column */}
                    <img
                        alt={exercise?.name}
                        src={exercise?.gifUrl}
                        style={{ maxWidth: '100%', maxHeight: '100%' }} // Ensure image doesn't exceed container size
                    />
                </Col>
                <Col xs={24} md={16}> {/* Content column */}
                    <div style={{ padding: 32 }}>
                        <Typography.Title level={3} style={{ textTransform: 'capitalize'}}>
                            {exercise?.name}
                        </Typography.Title>
                        <p style={{ textTransform: 'capitalize'}} ><strong>Body Part:</strong> {exercise?.bodyPart}</p>
                        <p style={{ textTransform: 'capitalize'}} ><strong>Equipment:</strong> {exercise?.equipment}</p>
                        <p style={{ textTransform: 'capitalize'}} ><strong>Target:</strong> {exercise?.target}</p>
                        <p style={{ textTransform: 'capitalize'}} ><strong>Secondary Muscles:</strong> {exercise?.secondaryMuscles && exercise.secondaryMuscles.join(', ')}</p>
                        <p><strong>Instructions:</strong> {exercise?.instructions}</p>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default ExerciseInfo;
