// NewWorkoutForm.tsx
import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import {WorkoutDay} from "./Workout";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

interface NewWorkoutFormProps {
    userId: string | undefined
    isFormOpen: boolean;
    setIsFormOpen: (isFormOpen: boolean) => void;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const NewWorkoutForm: React.FC<NewWorkoutFormProps> = ({ userId, isFormOpen, setIsFormOpen, isModified, setIsModified }) => {
    const [form] = Form.useForm();


    const onFinish = () => {
        form.validateFields()
            .then(values => {
                console.log(values.name)
                console.log(userId)
                axiosInstance.post('/workout', {
                    userId: userId,
                    name: values.name
                })
                    .then(response => {
                        console.log('Workout saved successfully:', response.data);
                        //fetchData();
                    })
                    .catch(error => {
                        console.error('Error saving workout:', error);
                    });
                form.resetFields();
                console.log(values)
                setIsModified(!isModified);
                setIsFormOpen(false);

            })
            .catch(errorInfo => {
                console.error('Failed:', errorInfo);
            });
    };

    return (
        <Modal
            open={isFormOpen}
            title="Create New Workout"
            okText="Create"
            cancelText="Cancel"
            onCancel={() => setIsFormOpen(false)}
            onOk={onFinish}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item
                    name="name"
                    label="Workout Name"
                    rules={[{ required: true, message: 'Please input the name of the workout!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewWorkoutForm;
