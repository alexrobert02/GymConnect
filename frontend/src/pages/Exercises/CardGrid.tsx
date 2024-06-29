import React, {useState} from 'react';
import {Col, Pagination, Row} from 'antd';
import ExerciseCard from './ExerciseCard'; // Import ExerciseCard component
import {ExerciseType} from "../Workout/ExerciseTable";
import {Link} from "react-router-dom";

export interface CardGridProps {
    exercises: ExerciseType[];
}

const CardGrid: React.FC<CardGridProps> = ({ exercises }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 12;

    // Calculate index of the first and last exercise for the current page
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

    // Function to handle page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 style={{textAlign: "center", marginBottom: '100px'}}>{"Showing exercises results"}</h2>
            <Row gutter={[60, 50]} justify="center">
                {currentExercises.map(exercise => (
                    <Col key={exercise.id}>
                        <Link
                            style={{textDecoration: "none"}}
                            to={`/exercise/${exercise.id}`}
                        >
                            <ExerciseCard
                                exercise={exercise}
                            />
                        </Link>

                    </Col>
                ))}
            </Row>
            {exercises.length > 0 && (
                <Pagination
                    style={{marginTop: '20px'}}
                    current={currentPage}
                    total={exercises.length}
                    pageSize={exercisesPerPage}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default CardGrid;
