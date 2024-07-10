import React, {useEffect, useState} from 'react';
import {Button, Form, InputNumber, Modal, Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import {ExerciseDataType} from './ExerciseTable';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {securedInstance} from "../../services/api";
import {toast} from "react-toastify";

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
        sm: { span: 5 },
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
            weight: exercise?.weight,
            rest: exercise?.rest
        }); // Set initial value for the form
    }, [exercise, form, exercise?.id]);

    const fetchExerciseList = debounce(async (exerciseName: string) => {
        setFetching(true);
        try {
            const response = await securedInstance.get(`/api/v1/exercises/name/${exerciseName}`);
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
            else {
                if (action === "edit" && exercise != null) {
                    updateUserExercise(exercise.exercise.id);
                }
            }
        });


    };

    const createUserExercise = (id: string) => {
        form.validateFields().then(values => {
            
            
            const newExercise: { workoutDayId: string, exerciseId: string, sets: number, reps: number[], weight: number, rest: number } = {
                workoutDayId: workoutDayId,
                exerciseId: id,
                sets: values.reps.length, // Calculate the sets based on the length of the reps array
                reps: values.reps,
                weight: values.weight,
                rest: values.rest
            };
            
            securedInstance.post("/api/v1/userExercise", newExercise)
                .then(response => {
                    
                    toast.success("Exercise added successfully!");
                })
                .catch(error => {
                    console.error("Error submitting exercise:", error);
                    toast.error("Error adding exercise!");
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
        
        form.validateFields().then(values => {
            
            const editedExercise: { workoutDayId: string, exerciseId: string, sets: number, reps: number[], weight: number, rest: number } = {
                workoutDayId: workoutDayId,
                exerciseId: id,
                sets: values.reps.length, // Calculate the sets based on the length of the reps array
                reps: values.reps,
                weight: values.weight,
                rest: values.rest
            };
            
            
            securedInstance.put(`/api/v1/userExercise/${exercise?.id}`, editedExercise)
                .then(response => {
                    
                    toast.success("Exercise edited successfully!");
                })
                .catch(error => {
                    console.error("Error submitting exercise:", error);
                    toast.error("Error editing exercise!");
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
                        onSearch={fetchExerciseList}
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

                <Form.Item label="Weight (kg)" name="weight" rules={[{ type: 'number', min: 0, required: true }]}
                           {...formItemLayout}>
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Rest (sec)" name="rest" rules={[{ type: 'number', min: 0, required: true }]}
                           {...formItemLayout}>
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExerciseForm;
