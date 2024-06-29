import React, {useEffect, useState} from 'react';
import {WorkoutDay} from '../Workout/Workout'
import GeneratedTable from "./GeneratedTable";

interface WorkoutGridProps {
    workoutList: WorkoutDay[];
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const GeneratedGrid: React.FC<WorkoutGridProps> = ({ workoutList, isModified, setIsModified }) => {
    const [workoutGrid, setWorkoutGrid] = useState<WorkoutDay[]>([])

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
            {workoutGrid.map((workoutDay, index) => (
                <div key={index}>
                    <GeneratedTable
                        workoutDayId={workoutDay.id}
                        exerciseData={workoutDay.userExercises}
                        title={workoutDay.day}
                        isModified={isModified}
                        setIsModified={setIsModified}
                    />
                </div>
            ))}
        </>
    );
};

export default GeneratedGrid;
