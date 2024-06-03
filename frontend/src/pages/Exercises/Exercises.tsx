import React, { useState } from 'react';
import { Input, Spin, Alert } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import CardGrid from "./CardGrid";
import { securedInstance} from "../../services/api";
import {ExerciseType} from "../Workout/ExerciseTable";

const { Search } = Input;

const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<ExerciseType[]>([]);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error message

    const onSearch: SearchProps['onSearch'] = (value, _e, info) =>  {
        console.log(info?.source, value);
        if(info?.source !== "clear") {
            fetchExercises(value);
        }
    }

    const fetchExercises = (exerciseName: string) => {
        setLoading(true); // Set loading to true when starting fetch
        setError(null); // Clear previous error
        securedInstance.get(`http://localhost:8082/api/v1/exercises/name/${exerciseName}`, {
            params: {
                limit: '1500'
            }
        })
            .then(response => {
                console.log(response);
                setExercises(response.data);
                setLoading(false); // Set loading to false after successful fetch
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data.'); // Set error message
                setExercises([]);
                setLoading(false); // Set loading to false in case of error
            });
    };

    return (
        <div style={{padding: '24px'}}>
            <Spin spinning={loading}>
                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                    />
                )}
                <div style={{
                    padding: '50px',
                    fontSize: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>Awesome exercises you should know
                </div>
                <div style={{maxWidth: '400px', margin: '0 auto', marginTop: "100px"}}>
                    <Search
                        placeholder="Search exercise..."
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                </div>
                <CardGrid
                    exercises={exercises} // Render filtered exercises
                />
            </Spin>
        </div>
    );
};

export default Exercises;
