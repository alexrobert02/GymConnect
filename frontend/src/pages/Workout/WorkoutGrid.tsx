    import React, {useEffect, useState} from 'react';
    import ExerciseTable from './ExerciseTable';
    import { DragEndEvent } from '@dnd-kit/core';
    import { v4 } from 'uuid';
    import { Workout } from './Workout'

    interface WorkoutGridProps {
        workoutList: Workout[];
        setWorkoutList: (workoutList: Workout[]) => void;
        isModified: boolean;
        setIsModified: (isModified: boolean) => void;
    }

    const WorkoutGrid: React.FC<WorkoutGridProps> = ({ workoutList, setWorkoutList, isModified, setIsModified }) => {
        const [workoutGrid, setWorkoutGrid] = useState<Workout[]>([])

        const onDragEnd = ({ active, over }: DragEndEvent, tableIndex: number) => {
            if (!over) return;
            const newList = [...workoutList];
            const activeIndex = newList[tableIndex].userExercises.findIndex(exercise => exercise.key === active.id);
            const overIndex = newList[tableIndex].userExercises.findIndex(exercise => exercise.key === over.id);
            const movedExercise = newList[tableIndex].userExercises[activeIndex];
            newList[tableIndex].userExercises.splice(activeIndex, 1);
            newList[tableIndex].userExercises.splice(overIndex, 0, movedExercise);
            setWorkoutList(newList);
            //setIsModified(true);
        };

        useEffect(() => {
            console.log("useEffect in WorkoutGrid")
            const sortedWorkoutList = [...workoutList].sort((a, b) => {
                const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
            });

            setWorkoutGrid(sortedWorkoutList);
        }, [workoutList]);

        return (
            <>
                {workoutGrid.map((workout, index) => (
                    <div key={index}>
                        <ExerciseTable
                            id={workout.id}
                            exerciseData={workout.userExercises}
                            title={workout.day}
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
