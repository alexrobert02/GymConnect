import React from 'react';
import {Form, Input, Modal} from 'antd';
import {securedInstance} from "../../services/api";
import {toast} from "react-toastify";

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
                securedInstance.post('/api/v1/workout', {
                    userId: userId,
                    name: values.name
                })
                    .then(response => {
                        console.log('Workout saved successfully:', response.data);
                        toast.success('Workout deleted successfully.')
                    })
                    .catch(error => {
                        console.error('Error saving workout:', error);
                    })
                    .finally(() => setIsModified(!isModified))
                form.resetFields();
                console.log(values)
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
