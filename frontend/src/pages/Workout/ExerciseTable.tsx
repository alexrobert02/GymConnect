import React, {useState} from 'react';
import {Button, Modal, Popconfirm, Space, Table, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import ExerciseForm from "./ExerciseForm";
import {ColumnsType} from "antd/es/table";
import NewTableForm from "./NewTableForm";
import {toast} from "react-toastify";
import '../Exercises/ExerciseCard.scss'
import {securedInstance} from "../../services/api";

const { Title } = Typography;

export interface ExerciseType {
    bodyPart: string;
    equipment: string;
    gifUrl: string;
    id: string;
    name: string;
    target: string;
    secondaryMuscles: string[];
    instructions: string[];
}

export interface ExerciseDataType {
    id: string;
    exercise: ExerciseType;
    sets: number;
    reps: number[];
    weight: number;
    rest: number;
}

interface ExerciseTableProps {
    workoutId: string
    workoutDayId: string
    exerciseData: ExerciseDataType[];
    title: string;
    onDragEnd: (event: DragEndEvent, tableIndex: number) => void;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const ExerciseTable: React.FC<ExerciseTableProps> = React.memo(({ workoutId, workoutDayId, exerciseData, title, onDragEnd, isModified, setIsModified }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [workoutFormVisible, setWorkoutFormVisible] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<ExerciseDataType | null>(null);
    const [action, setAction] = useState<string>('');
    const [workoutAction, setWorkoutAction] = useState<string>('');
    const [formTitle, setFormTitle] = useState<string>('');

    const handleImageClick = (exercise: ExerciseDataType) => {
        setCurrentExercise(exercise);
        
        setModalVisible(true);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const openExerciseForm = (exercise: ExerciseDataType) => {
        setCurrentExercise(exercise);
        setAction("edit")
        setFormVisible(true);
    }

    const onDeleteExercise = (id: string) => {
        // Handle delete action here
        securedInstance.delete(`/api/v1/userExercise/${id}`)
            .then(response => {
                
                toast.success("Exercise deleted successfully!");
            })
            .catch(error => {
                console.error("Error deleting workout:", error);
                toast.error("Error deleting exercise!");
            });
        setIsModified(!isModified);
    }

    const onDeleteTable = () => {
        securedInstance.delete(`/api/v1/workoutDay/${workoutDayId}`)
            .then(response => {
                
                toast.success("Workout day deleted successfully.")
            })
            .catch(error => {
                console.error("Error deleting workout:", error);
                toast.error("Error deleting workout!")
            })
            .finally(() => setIsModified(!isModified))
    }
    const onEditTable = () => {
        setWorkoutFormVisible(true);
        setWorkoutAction("edit");
        
    }

    const handleAdd = () => {
        setCurrentExercise(null)
        setFormVisible(true)
        setAction("add")
        setFormTitle("Add Exercise")
    }

    const columns: ColumnsType<ExerciseDataType> = [
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            render: (text, record) => (
                <div>
                    <span onClick={() => handleImageClick(record)}>
                        <img src={record.exercise.gifUrl} alt={record.exercise.name} style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }} />
                    </span>
                    <span style={{ marginLeft: '10px' }}>{record.exercise.name}</span>
                </div>
            ),
        },
        {
            title: 'Sets',
            dataIndex: 'sets',
            key: 'sets',
        },
        {
            title: 'Reps',
            dataIndex: 'reps',
            key: 'reps',
            render: (reps: number[]) => {
                // Check if all elements in the array are the same
                const allSame = reps.every(rep => rep === reps[0]);

                // If all elements are the same, show only the first element
                if (allSame) {
                    return <span>{reps[0]}</span>;
                }

                // Otherwise, show the entire array joined by commas
                return <span>{reps.join(', ')}</span>;
            },
        },
        {
            title: 'Weight (kg)',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Rest (sec)',
            dataIndex: 'rest',
            key: 'rest',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button icon={<EditOutlined />} onClick={() => openExerciseForm(record)} />
                        <Button icon={<DeleteOutlined />} onClick={() => onDeleteExercise(record.id)}/>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Title level={4}>{title}</Title>
                    <Button icon={<EditOutlined/>} type="text" onClick={onEditTable}/>
                </div>
                    <Button icon={<DeleteOutlined/>} type="text" danger onClick={onDeleteTable}/>
            </div>
            <DndContext onDragEnd={(event) => onDragEnd(event, 0)}>
                <SortableContext
                    items={exerciseData.map((_, index) => index.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        dataSource={exerciseData}
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={false}
                        footer={() => (
                            <Space>
                                <Button type="default" icon={<PlusOutlined/>} onClick={handleAdd}>
                                    Add Exercise
                                </Button>
                            </Space>
                        )}
                    />
                </SortableContext>
            </DndContext>
            <Modal
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                title={currentExercise ? currentExercise.exercise.name : ''}
                width={'30%'}
            >
                {currentExercise && (
                    <img
                        src={currentExercise.exercise.gifUrl}
                        alt={currentExercise.exercise.name}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                )}
            </Modal>
            <ExerciseForm
                workoutDayId={workoutDayId}
                title={formTitle}
                isOpen={formVisible}
                setIsOpen={setFormVisible}
                action={action}
                isModified={isModified}
                setIsModified={setIsModified}
                exercise={currentExercise}
            />
            <NewTableForm
                workoutId={workoutId}
                workoutDayId={workoutDayId}
                day={title}
                action={workoutAction}
                title={"Change Workout Day"}
                isModalOpen={workoutFormVisible}
                setIsModalOpen={setWorkoutFormVisible}
                isModified={isModified}
                setIsModified={setIsModified}/>
        </div>
    );
});

export default ExerciseTable;
