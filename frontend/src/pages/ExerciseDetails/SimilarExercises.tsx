import React, { useRef } from 'react';
import { Button, Card } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import ExerciseCard from '../Exercises/ExerciseCard'; // Import ExerciseCard component
import { ExerciseType } from "../Workout/ExerciseTable";
import { Link } from "react-router-dom";

export interface SimilarExercisesProps {
    title: string;
    exercises: ExerciseType[];
}

const cardStyle: React.CSSProperties = {
    margin: 100
};

// Custom CSS to hide scrollbar
const hideScrollbarStyle: React.CSSProperties = {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none', // For Firefox
    msOverflowStyle: 'none', // For IE and Edge
    flex: 1,
    padding: '10px 0', // Add padding to the container
};

const cardContainerStyle: React.CSSProperties = {
    padding: '20px', // Add padding to the card container
    boxSizing: 'border-box', // Ensure padding doesn't affect the layout
};

const SimilarExercises: React.FC<SimilarExercisesProps> = ({ title, exercises }) => {
    const ref = useRef<HTMLDivElement>(null);

    const getScrollAmount = () => {
        if (ref.current) {
            return ref.current.clientWidth * 0.25; // Scroll by 80% of the container's visible width
        }
        return 0;
    };

    const LeftHandler = () => {
        if (ref.current) ref.current.scrollLeft -= getScrollAmount();
    };

    const RightHandler = () => {
        if (ref.current) ref.current.scrollLeft += getScrollAmount();
    };

    return (
        <div style={cardStyle}>
            <h2 style={{ textAlign: "center" }}>{title}</h2>
            <div className="box" style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={LeftHandler} style={{ marginRight: 10 }}>
                    <LeftCircleOutlined />
                </Button>
                <div ref={ref} style={hideScrollbarStyle}>
                    <div style={cardContainerStyle}>
                        {exercises.map(exercise => (
                            <Link
                                key={exercise.id}
                                style={{ textDecoration: "none", display: 'inline-block', margin: '0 20px' }}
                                to={`/exercise/${exercise.id}`}
                            >
                                <ExerciseCard exercise={exercise} />
                            </Link>
                        ))}
                    </div>
                </div>
                <Button onClick={RightHandler} style={{ marginLeft: 10 }}>
                    <RightCircleOutlined />
                </Button>
            </div>
        </div>
    );
};

export default SimilarExercises;
