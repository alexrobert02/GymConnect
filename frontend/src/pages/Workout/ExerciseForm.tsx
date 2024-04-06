import React, {useEffect, useState} from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { ExerciseDataType } from './ExerciseTable';
import SearchInput, { SearchInputProps } from './searchInput'; // Import the SearchInput component
import api from '../../services/api'

interface ExerciseFormProps {
    exercise: ExerciseDataType | null;
    onFinish: (editedExercise: ExerciseDataType) => void;
}

interface ExerciseValue {
    label: string;
    value: string;
}

async function fetchUserList(exerciseName: string): Promise<ExerciseValue[]> {
    console.log('fetching exercise', exerciseName);
    fetch('https://randomuser.me/api/?results=5')
        .then((response) => response.json())
        .then((body) => console.log(body));

    return fetch('https://randomuser.me/api/?results=5')
        .then((response) => response.json())
        .then((body) =>
            body.results.map(
                (user: { name: { first: string; last: string }; login: { username: string } }) => ({
                    label: `${user.name.first} ${user.name.last}`,
                    value: user.login.username,
                }),
            ),

    // return api.get(`http://localhost:8082/api/v1/exercises/name/${exerciseName}`)
    //     .then((response) =>
    //         response.data.map(
    //             (exercise: { name: string }) => ({
    //                 label: exercise.name,
    //                 value: exercise.name,
    //             }),
    //         ),

        );
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onFinish }) => {
    const [form] = Form.useForm();

    // useEffect(() => {
    //     if (exercise) {
    //         form.setFieldsValue({ exercise: exercise.name }); // Set initial value for the form
    //     }
    // }, [exercise, form]);

    console.log("Exercise name:", exercise?.name)
    console.log("The prop exercise:", exercise)

    const handleFinish = () => {
        form.validateFields().then(values => {
            const editedExercise: ExerciseDataType = {
                ...(exercise as ExerciseDataType),
                ...values,
            };
            onFinish(editedExercise);
            console.log("EditedExercise:", editedExercise)
            console.log(values)
        });
    };


    return (
        <Form form={form} initialValues={exercise || {}} onFinish={handleFinish} layout="vertical">
            <Form.Item label="Exercise" name="name" rules={[{ required: true }]}>
                <SearchInput fetchOptions={fetchUserList} placeholder="Search exercise" />
            </Form.Item>
            <Form.Item label="Sets" name="sets" rules={[{ type: 'number', min: 1, required: true }]}>
                <InputNumber />
            </Form.Item>
            <Form.Item label="Reps" name="reps">
                <Form.List name="reps">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                                <Form.Item key={field.key} style={{ marginBottom: 0 }}>
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[{ required: true, message: 'Please input reps' }]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
                                    Add Rep
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item label="Weights" name="weights" rules={[{ type: 'number', min: 0, required: true }]}>
                <InputNumber />
            </Form.Item>
            <Form.Item label="Rest" name="rest" rules={[{ type: 'number', min: 0, required: true }]}>
                <InputNumber />
            </Form.Item>
            <Button type="primary" htmlType="submit">
                Save
            </Button>
        </Form>
    );
};

export default ExerciseForm;
