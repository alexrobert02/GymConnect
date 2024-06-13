import React, { useState } from 'react';
import './GenerateWorkout.scss';
import {Row, Col, Input, Form, Select, Button, Spin, Modal, message} from 'antd';
import { GENDERS, GOALS, FITNESS_LEVELS } from './constants';
import { securedInstance } from "../../services/api";
import { WorkoutDay } from "../Workout/Workout";
import { ExerciseType } from "../Workout/ExerciseTable";
import GeneratedGrid from "./GeneratedGrid";
import { v4 } from "uuid";
import {jwtDecode} from "jwt-decode";

interface UserData {
    height: number,
    weight: number,
    age: number,
    gender: string,
    fitnessLevel: string,
    goal: string,
    numberOfDaysPerWeek: string
}

const extractToken = () => {
    try {
        let token: string | null = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage');
            return null;
        }
        return token;
    } catch (err) {
        console.error('Failed to decode token', err);
        return null;
    }
};

const GenerateWorkout = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
    const [isModified, setIsModified] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [workoutName, setWorkoutName] = useState<string>('');

    const handleSaveWorkout = async () => {
        if (!workoutName) {
            message.error('Please enter a workout name before saving.');
            return;
        }

        const token = extractToken();
        if (!token) {
            console.error("No token found in local storage");
            return;
        }

        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;
        if (email) {
            securedInstance
                .get(`/api/v1/users/email/${email}`)
                .then(response => {
                    return response.data.id;
                })
                .then(id => {
                    securedInstance.post('/api/v1/workout', {
                        userId: id,
                        name: workoutName
                    })
                    .then(async response => {
                        console.log(response);
                        await Promise.all(workoutDays.map(async (workoutDay: any) => {
                            await securedInstance.post('/api/v1/workoutDay', {
                                workoutId: response.data.id,
                                day: workoutDay.day.toUpperCase()
                            })
                            .then(async response => {
                                console.log(response)
                                await Promise.all(workoutDay.userExercises.map(async (userExercise: any) => {
                                    console.log("workoutDay id:", response.data.id);
                                    await securedInstance.post('/api/v1/userExercise', {
                                        workoutDayId: response.data.id,
                                        exerciseId: userExercise.exercise.id,
                                        sets: userExercise.sets,
                                        reps: userExercise.reps,
                                        weights: userExercise.weights,
                                        rest: userExercise.rest
                                    })
                                    .then(response => {
                                    })
                                    .catch(error => {
                                        console.error('Error creating userExercise:', error)
                                    })
                                }))
                            })
                            .catch(error => {
                                console.error('Error creating workoutDay:', error)
                            })
                        }));
                    })
                    .catch(error => {
                        console.error('Error creating workout:', error)
                    })
                });


        }

        // Logic to save the workout with the name
        console.log('Workout saved:', workoutName, workoutDays);
        message.success('Workout saved successfully!');
        setIsModalVisible(false); // Close the modal after saving
    };

    const handleSubmit = async () => {
        try {
            const values: UserData = await form.validateFields();
            console.log('Received values:', values);
            setLoading(true);

            const extractNumber = (str: string): number => {
                const match = str.match(/\d+/);
                return match ? parseInt(match[0], 10) : 0;
            };

            const transformReps = (reps: string, sets: number): number[] => {
                if (reps.includes("-")) {
                    const newReps = reps.split("-").map(num => parseInt(num, 10));
                    return Array(sets).fill(newReps[0]);
                } else {
                    const repValue = parseInt(reps, 10);
                    return Array(sets).fill(repValue);
                }
            };

            const transformExerciseName = (exerciseName: string): string => {
                exerciseName = exerciseName.toLowerCase()
                const length = exerciseName.length;
                if (length > 1 && exerciseName[length - 1] === 's' && exerciseName[length - 2] !== 's') {
                    exerciseName = exerciseName.slice(0, -1);
                }

                exerciseName = exerciseName.replace(/\b(tricep|bicep)\b/g, '$1s');

                if (exerciseName === 'squat' || exerciseName === 'barbell squat') {
                    return 'barbell full squat';
                }

                if (exerciseName === 'plank') {
                    return 'weighted front plank';
                }

                if (exerciseName === 'deadlift') {
                    const options = ['barbell deadlift', 'barbell romanian deadlift', 'dumbbell romanian deadlift'];
                    return options[Math.floor(Math.random() * options.length)];
                }

                if (exerciseName === 'dumbbell flye') {
                    exerciseName = exerciseName.slice(0, -1);
                }

                if (exerciseName === 'leg press') {
                    return 'sled 45';
                }

                if (exerciseName === 'hammer curl' || exerciseName === 'biceps curl') {
                    return 'dumbbell ' + exerciseName;
                }

                if (exerciseName === 'lat pulldown') {
                    return 'cable pulldown (pro lat bar)';
                }

                if (exerciseName === 'seated row') {
                    const options = ['lever seated row', 'lever narrow grip seated row', 'cable seated row', 'cable straight back seated row'];
                    return options[Math.floor(Math.random() * options.length)];
                }

                if (exerciseName === 'dumbbell shoulder press') {
                    return 'dumbbell seated shoulder press'
                }

                if (exerciseName === 'bent over barbell row') {
                    return 'barbell bent over row'
                }

                if (exerciseName.includes('crunche')) {
                    if (exerciseName === 'crunche') {
                        const options = ['crunch floor', 'cross body crunch']
                        return options[Math.floor(Math.random() * options.length)];
                    }
                    else if (exerciseName.includes('bicycle')) {
                        return 'band bicycle crunch'
                    }
                }

                if (exerciseName === 'leg curl') {
                    const options = ['lever lying leg curl', 'lever seated leg curl']
                    return options[Math.floor(Math.random() * options.length)];
                }

                if (exerciseName.includes('hip thrust'))
                    return 'barbell lying lifting (on hip)'

                if (exerciseName.includes('lateral raise'))
                    return 'dumbbell lateral raise'

                if (exerciseName.includes('incline') && exerciseName.includes('press'))
                    if (exerciseName.includes('dumbbell'))
                        return 'dumbbell incline bench press'
                    else if (exerciseName.includes('barbell'))
                        return 'barbell incline bench press'

                if (exerciseName.includes('kickback')) {
                    const options = ['cable two arm tricep kickback', 'dumbbell kickback', 'dumbbell standing kickback']
                    return options[Math.floor(Math.random() * options.length)];
                }

                return exerciseName;
            };

            const response = await securedInstance.post('/api/v1/exercise-plan', values, {
                headers: { "Content-type": "application/json" }
            });

            const newWorkout: WorkoutDay[] = await Promise.all(response.data.map(async (workoutDay: any) => {
                const userExercises = await Promise.all(workoutDay.exercises.map(async (exercise: any) => {
                    try {
                        const matchedExerciseResponse = await securedInstance.get(`/api/v1/exercises/name/${transformExerciseName(exercise.exercise)}`, {
                            params: { limit: '1500' }
                        });

                        let matchedExercise = matchedExerciseResponse.data.find((item: any) => item.name === transformExerciseName(exercise.exercise)) || "not found";

                        if (matchedExercise === 'not found' && matchedExerciseResponse.data.length > 0) {
                            if (transformExerciseName(exercise.exercise) === 'sled 45') {
                                matchedExercise = matchedExerciseResponse.data[2]
                            }
                            else {
                                matchedExercise = matchedExerciseResponse.data[0]
                            }
                        }
                        else if (matchedExercise === 'not found') {
                            console.log("not found:", transformExerciseName(exercise.exercise))
                            matchedExercise = transformExerciseName(exercise.exercise)
                        }

                        console.log("matched exercise:", matchedExercise)

                        const userExercise: ExerciseType = {
                            id: matchedExercise.id,
                            bodyPart: matchedExercise.bodyPart,
                            equipment: matchedExercise.equipment,
                            gifUrl: matchedExercise.gifUrl,
                            name: matchedExercise.name,
                            target: matchedExercise.target,
                            secondaryMuscles: matchedExercise.secondaryMuscles,
                            instructions: matchedExercise.instructions
                        };

                        return {
                            id: v4(),
                            exercise: userExercise,
                            sets: Number(exercise.sets) || 0,
                            reps: transformReps(exercise.reps, Number(exercise.sets)) || [],
                            weights: Number(exercise.weight) || 0,
                            rest: extractNumber(exercise.rest) || 0
                        };
                    } catch (error) {
                        console.error('Error fetching matched exercise:', error);
                        return null;
                    }
                }));

                return {
                    id: v4(),
                    day: workoutDay.day,
                    userExercises: userExercises.filter(exercise => exercise !== null)
                };
            }));

            setWorkoutDays(newWorkout);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="generate-workout-page">
                <div className="generate-workout-info">
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Height (cm)" name="height">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Weight (kg)" name="weight">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Age (yr)" name="age">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{marginTop: 16}}>
                            <Col span={8}>
                                <Form.Item label="Gender" name="gender" initialValue="Male">
                                    <Select options={GENDERS}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Fitness Level" name="fitnessLevel" initialValue="Beginner">
                                    <Select options={FITNESS_LEVELS}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Goal" name="goal" initialValue="Muscle Gain">
                                    <Select options={GOALS}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="start" gutter={16} style={{marginTop: 16}}>
                            <Col span={8}>
                                <Form.Item label="Number of days per week" name="numberOfDaysPerWeek">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end" style={{marginTop: 16}}>
                            <Col>
                                <Button type="primary" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginTop: 100}}>
                    {loading &&
                        <Spin tip="Loading..." size="large">
                            <div></div>
                        </Spin>
                    }
                    {/*{!loading && workoutDays.length > 0 && done &&*/}
                    {/*    <Table dataSource={workoutDays} columns={columns} rowKey="id" />*/}
                    {/*}*/}
                </div>
            </div>
            <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
                <GeneratedGrid workoutList={workoutDays} isModified={isModified} setIsModified={setIsModified}/>
            </div>
            {workoutDays.length > 0 &&
                <div style={{textAlign: 'center', margin: '100px 0'}}>
                <p style={{fontSize: '20px', fontWeight: 'bold', cursor: 'pointer'}}
                   onClick={() => setIsModalVisible(true)}>
                    Click here to save your workout
                </p>
            </div>
            }
            <Modal
                title="Save Workout"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSaveWorkout}>
                        Save
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Enter workout name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default GenerateWorkout;
