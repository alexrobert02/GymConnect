import React, {useEffect, useState} from 'react';
import {Alert, Input, Select, Spin} from 'antd';
import type {SearchProps} from 'antd/es/input/Search';
import CardGrid from "./CardGrid";
import {securedInstance} from "../../services/api";
import {ExerciseType} from "../Workout/ExerciseTable";

const { Search } = Input;
const { Option } = Select;

interface OptionValue {
    label: string;
    value: string;
}

const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<ExerciseType[]>([]);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error message
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>(''); // State for selected category
    const [bodyParts, setBodyParts] = useState<OptionValue[]>([]);

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value);
        if (info?.source !== "clear") {
            fetchExercises(value);
        }
    }

    const fetchBodyParts = () => {
        securedInstance.get('/api/v1/exercises/bodyPartList')
            .then(response => {
                const data = response.data;
                const bodyPartValues: OptionValue[] = data.map((bodyPart: string) => ({
                    label: bodyPart,
                    value: bodyPart,
                }));
                bodyPartValues.unshift({
                    label: "all",
                    value: "all"
                })
                setBodyParts(bodyPartValues);
            })
            .catch(error => {
                console.log(error)
                setBodyParts([])
            })
    }

    useEffect(() => {
        fetchBodyParts()
    }, []);

    // const fetchExercises = (exerciseName: string) => {
    //     setLoading(true); // Set loading to true when starting fetch
    //     setError(null); // Clear previous error
    //     securedInstance.get(`/api/v1/exercises/name/${exerciseName}`, {
    //         params: {
    //             limit: '1500'
    //         }
    //     })
    //         .then(response => {
    //             console.log(response);
    //             setExercises(response.data);
    //             setLoading(false); // Set loading to false after successful fetch
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //             setError('Error fetching data.'); // Set error message
    //             setExercises([]);
    //             setLoading(false); // Set loading to false in case of error
    //         });
    // };

    const fetchExercises = async (exerciseName: string) => {
        setLoading(true); // Set loading to true when starting fetch
        setError(null); // Clear previous error

        let exerciseData: ExerciseType[]

        const response = await securedInstance.get(`/api/v1/exercises/name/${exerciseName}`, {
            params: {
                limit: '1500'
            }
        });

        if (selectedBodyPart !== "all") {
            exerciseData = response.data.filter((exercise: ExerciseType) =>
                exercise.bodyPart.toLowerCase().includes(selectedBodyPart)
            )
        } else {
            exerciseData = response.data
        }
        console.log(exerciseData)
        setExercises(exerciseData)
        setLoading(false);
    };

    const handleBodyPartChange = (value: string) => {
        setSelectedBodyPart(value);
        console.log(`Selected category: ${value}`);
    };

    return (
        <div style={{ padding: '24px' }}>
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
                <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: "100px", display: 'flex', alignItems: 'center' }}>
                    <Select
                        placeholder="Select body part"
                        //defaultValue="All"
                        size="large"
                        style={{ width: '200px', marginRight: '10px' }}
                        onChange={handleBodyPartChange}
                        options={bodyParts}
                    />
                    <Search
                        placeholder="Search exercise..."
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                </div>
                {exercises.length > 0 &&
                <CardGrid
                    exercises={exercises} // Render filtered exercises
                />
                }
            </Spin>
        </div>
    );
};

export default Exercises;
