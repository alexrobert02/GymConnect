import React, { useEffect, useState } from 'react';
import './Workout.scss';
import { Alert, Button, Modal, Spin, Tabs } from 'antd';
import ExerciseTable, { ExerciseDataType } from './ExerciseTable';
import NewTableForm from './NewTableForm';
import WorkoutGrid from './WorkoutGrid';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { jwtDecode } from 'jwt-decode';
import { securedInstance } from '../../services/api';
import axios from 'axios';
import { v4 } from 'uuid';
import NewWorkoutForm from "./NewWorkoutForm";

const { TabPane } = Tabs;

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export interface WorkoutDay {
    id: string;
    userId: string;
    day: string;
    userExercises: ExerciseDataType[];
}

export interface Workout {
    id: string;
    userId: string;
    name: string;
    workoutDays: WorkoutDay[];
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

const WorkoutPage = () => {
    const [isModified, setIsModified] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [workoutList, setWorkoutList] = useState<Workout[]>([]);
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newWorkoutFormVisible, setNewWorkoutFormVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [workoutIdToDelete, setWorkoutIdToDelete] = useState<string | undefined>();

    const fetchData = () => {
        setLoading(true);
        setError(null);
        const token = extractToken();
        if (!token) {
            console.error('No token found in local storage');
            setLoading(false);
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;
        if (email) {
            axiosInstance
                .get(`/users/email/${email}`)
                .then(response => {
                    setUserId(response.data.id);
                    return response.data.id;
                })
                .then(id => {
                    securedInstance
                        .get(`http://localhost:8082/api/v1/workout/user/${id}`)
                        .then(response => {
                            setWorkoutList(response.status === 404 ? [] : response.data);
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            setError('Error fetching data.');
                            setLoading(false);
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setError('Error fetching data.');
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchData();
    }, [isModified]);

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            setNewWorkoutFormVisible(true);
        } else {
            const workout = workoutList.find(w => w.id === targetKey);
            setWorkoutIdToDelete(workout?.id);
            setDeleteModalVisible(true);
        }
    };

    const handleDelete = () => {
        if (workoutIdToDelete) {
            setLoading(true);
            securedInstance
                .delete(`http://localhost:8082/api/v1/workout/${workoutIdToDelete}`)
                .then(() => {
                    setIsModified(!isModified);
                    setDeleteModalVisible(false);
                    setWorkoutIdToDelete(undefined);
                })
                .catch(error => {
                    console.error('Error deleting workout:', error);
                    setError('Error deleting workout.');
                    setLoading(false);
                });
        }
    };

    const tabItems = workoutList.map(workout => ({
        key: workout.id,
        label: workout.name,
        children: (
            <>
                {!loading && !error && (
                    <Button type="primary" onClick={() => setFormVisible(true)}>
                        Add New Workout Day
                    </Button>
                )}
                <WorkoutGrid
                    workoutId={workout.id}
                    workoutList={workout.workoutDays}
                    setWorkoutList={setWorkoutDays}
                    isModified={isModified}
                    setIsModified={setIsModified}
                />
                <NewTableForm
                    workoutId={workout.id}
                    workoutDayId={''}
                    day={''}
                    action={'create'}
                    title={'Add New Workout Day'}
                    isModalOpen={formVisible}
                    setIsModalOpen={setFormVisible}
                    isModified={isModified}
                    setIsModified={setIsModified}
                />
            </>
        )
    }));

    return (
        <div className="workout-page">
            <Spin spinning={loading} fullscreen={true}/>
            {error && <Alert message={error} description="Please try again." type="error" showIcon />}
            <Tabs
                //style={{marginTop: 100}}
                type="editable-card"
                tabPosition="left"
                onEdit={onEdit}
                tabBarGutter={16}
                size="large"
                hideAdd={false}
                tabBarStyle={{ marginBottom: 16, marginRight: '8%' }}
                animated={{ inkBar: true, tabPane: true }}
                items={tabItems}
            />
            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Yes, delete it"
                cancelText="No, keep it"
            >
                <p>Are you sure you want to delete this workout?</p>
            </Modal>
            <NewWorkoutForm
                userId={userId}
                isFormOpen={newWorkoutFormVisible}
                setIsFormOpen={setNewWorkoutFormVisible}
                isModified={isModified}
                setIsModified={setIsModified}
            />
        </div>
    );
};

export default WorkoutPage;
