import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Select} from 'antd';
import {toast} from 'react-toastify';
import {securedInstance} from "../../services/api";

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
    workoutDayId: string;
    day: string;
    action: string;
    title: string;
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const NewTableForm: React.FC<NewTableFormProps> = ({ workoutId, workoutDayId, day, action, title, isModalOpen, setIsModalOpen, isModified, setIsModified }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<OptionValue[]>([]);

    useEffect(() => {
        form.setFieldsValue({
            workoutDay: day
        });// Set initial value for the form
        fetchData()
    }, [day, form]);

    const fetchData = () => {
        securedInstance
            .get(`/api/v1/workoutDay/remaining-days/workout/${workoutId}`)
            .then(response => {
                
                const data = response.data;
                const exerciseValues: OptionValue[] = data.map((day: string) => ({
                    label: day,
                    value: day,
                }));
                setOptions(exerciseValues);
                
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
    }

    // useEffect(() => {
    //     if (isModalOpen) {
    //         fetchData();
    //     }
    // }, [isModalOpen]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            
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
        securedInstance.post('/api/v1/workoutDay', {
            workoutId: workoutId,
            day: day
        })
            .then(response => {
                
                toast.success('Workout saved successfully!')
                setIsModified(!isModified);
            })
            .catch(error => {
                console.error('Error saving workout:', error);
                toast.error('Error saving workout. Please try again later.');
            });
    }

    const editWorkoutDay = (day: string) => {
        securedInstance.put(`/api/v1/workoutDay/${workoutDayId}`, {
            day: day
        })
            .then(response => {
                
                toast.success('Workout saved successfully!')
                setIsModified(!isModified)
            })
            .catch(error => {
                console.error('Error saving workout:', error);
                toast.error('Error saving workout. Please try again later.');
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
