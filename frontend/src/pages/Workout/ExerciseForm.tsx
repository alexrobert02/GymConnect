import React, { useEffect, useState } from 'react';
import {Form, InputNumber, Button, Select, Spin, Modal, Input} from 'antd';
import debounce from 'lodash/debounce';
import { ExerciseDataType } from './ExerciseTable';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { securedInstance } from "../../services/api";
import axios from "axios";

const { Option } = Select;

interface ExerciseFormProps {
    workoutDayId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    action: string;
    exercise: ExerciseDataType | null;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

interface ExerciseValue {
    label: string;
    value: string;
    id: string;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const ExerciseForm: React.FC<ExerciseFormProps> = ({ workoutDayId, isOpen, setIsOpen, exercise, action , isModified, setIsModified}) => {
    const [form] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ExerciseValue[]>([]);

    useEffect(() => {
        form.setFieldsValue({
            name: exercise?.exercise.name,
            sets: exercise?.sets,
            reps: exercise?.reps,
            weights: exercise?.weights,
            rest: exercise?.rest
        }); // Set initial value for the form
    }, [exercise, form, exercise?.id]);

    const fetchUserList = debounce(async (exerciseName: string) => {
        setFetching(true);
        try {
            const response = await axios.get(`http://localhost:8082/api/v1/exercises/name/${exerciseName}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = response.data;
            const exerciseValues: ExerciseValue[] = data.map((exercise: { name: string; id: string }) => ({
                label: exercise.name,
                value: exercise.name,
                id: exercise.id,
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
                if(action === "add") {
                    createUserExercise(selectedExercise.id);
                }
                if(action === "edit") {
                    updateUserExercise(selectedExercise.id);
                }

            }
        });


    };

    const createUserExercise = (id: string) => {
        form.validateFields().then(values => {
            console.log(values)
            const newExercise: { workoutDayId: string, exerciseId: string, sets: number, reps: number[], weights: number, rest: number } = {
                workoutDayId: workoutDayId,
                exerciseId: id,
                sets: values.reps.length, // Calculate the sets based on the length of the reps array
                reps: values.reps,
                weights: values.weights,
                rest: values.rest
            };
            console.log('new exercise:', newExercise);
            securedInstance.post("http://localhost:8082/api/v1/userExercise", newExercise)
                .then(response => {
                    console.log("Exercise submitted successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error submitting exercise:", error);
                })
                .finally(() => {
                    setIsOpen(false); // Close the form regardless of success or failure
                    setIsModified(!isModified)
                });
        }).catch(error => {
            console.error("Form validation failed:", error);
         });
    };

    const updateUserExercise = (id: string) => {
        console.log("exercise id passed:", id)
        form.validateFields().then(values => {
            console.log(values)
            const editedExercise: { workoutDayId: string, exerciseId: string, sets: number, reps: number[], weights: number, rest: number } = {
                workoutDayId: workoutDayId,
                exerciseId: id,
                sets: values.reps.length, // Calculate the sets based on the length of the reps array
                reps: values.reps,
                weights: values.weights,
                rest: values.rest
            };
            console.log('edited exercise:', editedExercise);
            console.log("exercise id:", exercise?.id)
            securedInstance.put(`http://localhost:8082/api/v1/userExercise/${exercise?.id}`, editedExercise)
                .then(response => {
                    console.log("Exercise submitted successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error submitting exercise:", error);
                })
                .finally(() => {
                    setIsOpen(false); // Close the form regardless of success or failure
                    setIsModified(!isModified)
                });
        }).catch(error => {
            console.error("Form validation failed:", error);
        });
    };

    return (
        <Modal
            title="Exercise Form"
            open={isOpen}
            onCancel={() => {
                setIsOpen(false);
                form.resetFields()
            }}
            footer={[
                <Button key="cancel" onClick={() => {
                    setIsOpen(false);
                    form.resetFields()
                }}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => {
                    console.log("action:",action);
                    handleFinish();
                }}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} initialValues={exercise || {}}>
                <Form.Item label="Exercise" name="name" rules={[{ required: true }]}
                           {...formItemLayout}>
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

                <Form.Item name="reps" label="Reps"
                           {...formItemLayout}>
                    <Form.List name="reps">
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...formItemLayout}
                                        label={`Set ${index + 1}`}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input number of reps or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <InputNumber style={{ width: '60%' }} />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '30%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Set
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form.Item>

                <Form.Item label="Weights" name="weights" rules={[{ type: 'number', min: 0, required: true }]}
                           {...formItemLayout}>
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Rest" name="rest" rules={[{ type: 'number', min: 0, required: true }]}
                           {...formItemLayout}>
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExerciseForm;
