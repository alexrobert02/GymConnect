import React, {useEffect, useState} from 'react';
import ExerciseTable from './ExerciseTable';
import {DragEndEvent} from '@dnd-kit/core';
import {WorkoutDay} from './Workout'

interface WorkoutGridProps {
    workoutId: string;
    workoutList: WorkoutDay[];
    setWorkoutList: (workoutList: WorkoutDay[]) => void;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const WorkoutGrid: React.FC<WorkoutGridProps> = ({ workoutId, workoutList, setWorkoutList, isModified, setIsModified }) => {
    const [workoutGrid, setWorkoutGrid] = useState<WorkoutDay[]>([])

    const onDragEnd = ({ active, over }: DragEndEvent, tableIndex: number) => {
        if (!over) return;
        const newList = [...workoutList];
        const activeIndex = newList[tableIndex].userExercises.findIndex(exercise => exercise.id === active.id);
        const overIndex = newList[tableIndex].userExercises.findIndex(exercise => exercise.id === over.id);
        const movedExercise = newList[tableIndex].userExercises[activeIndex];
        newList[tableIndex].userExercises.splice(activeIndex, 1);
        newList[tableIndex].userExercises.splice(overIndex, 0, movedExercise);
        setWorkoutList(newList);
        //setIsModified(true);
    };

    useEffect(() => {
        
        const sortedWorkoutList = [...workoutList].sort((a, b) => {
            const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
            return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
        });

        setWorkoutGrid(sortedWorkoutList);
    }, [workoutList]);

    return (
        <>
            {workoutGrid.map((workoutDay, index) => (
                <div key={index}>
                    <ExerciseTable
                        workoutId={workoutId}
                        workoutDayId={workoutDay.id}
                        exerciseData={workoutDay.userExercises}
                        title={workoutDay.day}
                        onDragEnd={(event) => onDragEnd(event, index)}
                        isModified={isModified}
                        setIsModified={setIsModified}
                    />
                </div>
            ))}
        </>
    );
};

export default WorkoutGrid;
