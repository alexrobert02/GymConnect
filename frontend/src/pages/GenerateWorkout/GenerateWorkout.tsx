import React, {useState} from 'react';
import './GenerateWorkout.scss';
import {Button, Col, Form, Input, message, Modal, Row, Select, Spin} from 'antd';
import {FITNESS_LEVELS, GENDERS} from './constants';
import {securedInstance} from "../../services/api";
import {WorkoutDay} from "../Workout/Workout";
import GeneratedGrid from "./GeneratedGrid";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

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

    const navigate = useNavigate();

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
                                                weight: userExercise.weight,
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

        console.log('Workout saved:', workoutName, workoutDays);
        toast.success('Workout saved successfully!');
        //navigate('/workout');
        //window.location.reload();
        setIsModalVisible(false); // Close the modal after saving
    };

    const handleSubmit = async () => {
        try {
            const values: UserData = await form.validateFields();
            values.goal="Muscle Gain"
            console.log('Received values:', values);
            setLoading(true);

            const response = await securedInstance.post('/api/v1/generate-workout', values, {
                headers: { "Content-type": "application/json" }
            });

            setWorkoutDays(response.data);
            console.log("Response:", response.data);
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
                        <div>
                            <h2 style={{color: "black"}}>Generate Your Personalized Workout Plan</h2>
                            <p>
                                Welcome to our workout generator! Fill in your details below to receive a customized
                                workout plan tailored to your goals and fitness level. Simply input your information and
                                hit submit to get started on your fitness journey.
                            </p>
                        </div>
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
