import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { ExerciseDataType } from './ExerciseTable';
import api from '../../services/api';

const { Option } = Select;

interface ExerciseFormProps {
    exercise: ExerciseDataType | null;
    onFinish: (editedExercise: ExerciseDataType) => void;
}

interface ExerciseValue {
    label: string;
    value: string;
    gifUrl: string
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onFinish }) => {
    const [form] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ExerciseValue[]>([]);


    useEffect(() => {
        form.setFieldsValue({ name: exercise?.name }); // Set initial value for the form
    }, [exercise, form]);

    const fetchUserList = debounce(async (exerciseName: string) => {
        setFetching(true);
        try {
            const response = await api.get(`http://localhost:8082/api/v1/exercises/name/${exerciseName}`);
            const data = response.data;
            const exerciseValues: ExerciseValue[] = data.map((exercise: { name: string , gifUrl: string }) => ({
                label: exercise.name,
                value: exercise.name,
                gifUrl: exercise.gifUrl
            }));
            setOptions(exerciseValues);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setOptions([]);
        } finally {
            setFetching(false);
        }
    }, 800);

    const handleFinish = () => {
        form.validateFields().then(values => {
            const selectedExercise = options.find(option => option.value === values.name);
            if (selectedExercise) {
                submitForm(selectedExercise.gifUrl)
            }
        });
    };

    const submitForm = (gifUrl : string) => {
        const editedExercise: ExerciseDataType = {
            ...(exercise as ExerciseDataType),
            ...form.getFieldsValue(),
            gifUrl: gifUrl
        };
        onFinish(editedExercise);
        console.log("edited exercise:", editedExercise);
    }

    return (
        <Form form={form} initialValues={exercise || {}} onFinish={handleFinish} layout="vertical">
            <Form.Item label="Exercise" name="name" rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="Search exercise"
                    filterOption={false}
                    onSearch={fetchUserList}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    loading={fetching}
                >
                    {options.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
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