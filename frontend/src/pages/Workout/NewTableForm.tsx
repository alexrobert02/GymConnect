import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Select} from 'antd';
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { securedInstance } from "../../services/api";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

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

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

interface OptionValue {
    label: string;
    value: string;
}

interface NewTableFormProps {
    workoutId: string;
    day: string;
    action: string;
    title: string;
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const NewTableForm: React.FC<NewTableFormProps> = ({ workoutId, day, action, title, isModalOpen, setIsModalOpen, isModified, setIsModified }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<OptionValue[]>([]);
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        form.setFieldsValue({
            workoutDay: day
        }); // Set initial value for the form
    }, [day, form]);

    const fetchData = () => {
        const token = extractToken();
        if (!token) {
            console.error('No token found in local storage');
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;
        console.log('email:', email);
        if (email) {
            axiosInstance
                .get(`/users/email/${email}`)
                .then(response => {
                    setUserId(response.data.id)
                    return response.data.id;
                })
                .then(id => {
                    axiosInstance
                        .get(`http://localhost:8082/api/v1/workout/remaining-days/user/${id}`)
                        .then(response => {
                            console.log("Fetch successful");
                            const data = response.data;
                            const exerciseValues: OptionValue[] = data.map((day: string) => ({
                                label: day,
                                value: day,
                            }));
                            setOptions(exerciseValues);
                            console.log(response.data);
                        })
                        .catch(error => {
                            if (error.response && error.response.status === 404) {
                                console.error('Error fetching data:', error)
                                setOptions([]);
                            } else {
                                console.error('Error fetching data:', error);
                                setOptions([]);
                            }
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setOptions([]);
                });
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            fetchData();
        }
    }, [isModalOpen]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log('Received values:', values);
            if(action === "create") {
                saveWorkoutDay(values.workoutDay)
            }
            if(action === "edit") {
                editWorkoutDay(values.workoutDay)
            }
            form.resetFields();
        });
        setIsModified(!isModified);
        setIsModalOpen(false)
    };

    const saveWorkoutDay = (day: string) => {
        axiosInstance.post('/workout', {
            userId: userId,
            day: day
        })
        .then(response => {
            console.log('Workout saved successfully:', response.data);
            fetchData();
        })
        .catch(error => {
            console.error('Error saving workout:', error);
        });
    }

    const editWorkoutDay = (day: string) => {
        axiosInstance.put(`/workout/${workoutId}`, {
            userId: userId,
            day: day
        })
            .then(response => {
                console.log('Workout saved successfully:', response.data);
                fetchData();
            })
            .catch(error => {
                console.error('Error saving workout:', error);
            });
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title={title}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Save
                </Button>,
            ]}
            centered
            //width={800}
        >
            <Form form={form} layout="horizontal">
                <Form.Item
                    name="workoutDay"
                    label="Workout Day"
                    rules={[{ required: true, message: 'Please enter workout day' }]}
                    {...formItemLayout}
                >
                    <Select options={options.map(option => ({ value: option.value, label: option.label }))} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTableForm;
