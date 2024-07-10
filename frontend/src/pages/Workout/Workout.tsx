import React, {useEffect, useState} from 'react';
import './Workout.scss';
import {Alert, Button, Modal, Spin, Tabs} from 'antd';
import {ExerciseDataType} from './ExerciseTable';
import NewTableForm from './NewTableForm';
import WorkoutGrid from './WorkoutGrid';
import {jwtDecode} from 'jwt-decode';
import {securedInstance} from '../../services/api';
import NewWorkoutForm from "./NewWorkoutForm";
import {toast} from "react-toastify";
import {useMediaQuery} from 'react-responsive';

export interface WorkoutDay {
    id: string;
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
            securedInstance
                .get(`/api/v1/users/email/${email}`)
                .then(response => {
                    setUserId(response.data.id);
                    return response.data.id;
                })
                .then(id => {
                    securedInstance
                        .get(`/api/v1/workout/user/${id}`)
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
                .delete(`/api/v1/workout/${workoutIdToDelete}`)
                .then(() => {
                    toast.success('Workout deleted successfully.')
                    setIsModified(!isModified);
                    setDeleteModalVisible(false);
                    setWorkoutIdToDelete(undefined);
                })
                .catch(error => {
                    console.error('Error deleting workout:', error);
                    toast.error('Error deleting workout!')
                    setError('Error deleting workout.');
                    setLoading(false);
                });
        }
    };

    const tabItems = workoutList.map(workout => ({
        key: workout.id,
        label: (
            <span className={"tabs-label-style"}>
                { workout.name }
            </span>
        ),
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

    const tabBarExtraContent = {
        left: (
            <div className="extra-content">
                <div className="section-title">My Workout Plans</div>
                {/*<div className="instructions">Click on a tab to view or edit the workout details.</div>*/}
            </div>
        ),
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className="workout-page">
            <Spin spinning={loading} fullscreen={true}/>
            {error && <Alert message={error} description="Please try again." type="error" showIcon />}
            {(!error || workoutList.length > 0) &&
                <Tabs
                    type="editable-card"
                    tabPosition={isMobile ? 'top' : 'left'}
                    onEdit={onEdit}
                    tabBarGutter={16}
                    size="large"
                    hideAdd={false}
                    tabBarStyle={{ marginBottom: 16, marginRight: 16 }}
                    animated={{ inkBar: true, tabPane: true }}
                    items={tabItems}
                    tabBarExtraContent={tabBarExtraContent}
                />
            }
            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
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
