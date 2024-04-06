import React, { useState } from 'react';
import './Workout.scss';
import {Button, Modal} from 'antd';
import ExerciseTable, { ExerciseDataType } from './ExerciseTable';
import NewTableForm from "./NewTableForm";
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const WorkoutPage = () => {
    const [exerciseData1, setExerciseData1] = useState<ExerciseDataType[]>([
        { key: 1, name: 'Archer pull up', imageUrl: 'https://v2.exercisedb.io/image/9lGNciInUjyYXF', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 },
        { key: 2, name: 'Squats', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 50 },
    ]);

    const [exerciseData2, setExerciseData2] = useState<ExerciseDataType[]>([
        { key: 3, name: 'Plank', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 },
        { key: 4, name: 'Burpees', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 }
    ]);

    const [visible, setVisible] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<ExerciseDataType | null>(null);
    const [showTable1, setShowTable1] = useState(true);
    const [showTable2, setShowTable2] = useState(true);
    const [formVisible, setFormVisible] = useState(false);

    const handleDeleteTable = (tableNumber: number) => {
        if (tableNumber === 1) {
            setShowTable1(false);
        } else {
            setShowTable2(false);
        }
    };

    const handleExerciseClick = (record: ExerciseDataType) => {
        setCurrentExercise(record);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const onDragEnd = ({ active, over }: DragEndEvent, tableNumber: number) => {
        if (active.id !== over?.id) {
            const setData = tableNumber === 1 ? setExerciseData1 : setExerciseData2;
            setData((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
        }
    };

    return (
        <div className="workout-page">
            <Button
                type="primary"
                onClick={() => setFormVisible(true)}
            >
                Add New Table
            </Button>
            {showTable1 && (
                <ExerciseTable
                    exerciseData={exerciseData1}
                    setExerciseData={setExerciseData1}
                    onExerciseClick={handleExerciseClick}
                    onDragEnd={(event) => onDragEnd(event, 1)}
                    title="Monday"
                    onDeleteTable={() => handleDeleteTable(1)}
                />
            )}
            {showTable2 && (
                <ExerciseTable
                    exerciseData={exerciseData2}
                    setExerciseData={setExerciseData2}
                    onExerciseClick={handleExerciseClick}
                    onDragEnd={(event) => onDragEnd(event, 2)}
                    title="Tuesday"
                    onDeleteTable={() => handleDeleteTable(2)}
                />
            )}
            <Modal
                open={visible}
                onCancel={handleCloseModal}
                footer={null}
                title={currentExercise ? currentExercise.name : ''}
                width={'30%'}
            >
                {currentExercise && (
                    <img src={currentExercise.imageUrl} alt={currentExercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                )}
            </Modal>
            <NewTableForm
                isModalOpen={formVisible}
                setIsModalOpen={setFormVisible}
            ></NewTableForm>
        </div>
    );
};

export default WorkoutPage;
