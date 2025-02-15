import React, {useState} from 'react';
import {Modal, Table, Typography} from 'antd';
import {ColumnsType} from "antd/es/table";

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
    workoutDayId: string
    exerciseData: ExerciseDataType[];
    title: string;
    isModified: boolean;
    setIsModified: (isModified: boolean) => void;
}

const GeneratedTable: React.FC<ExerciseTableProps> = React.memo(({ exerciseData, title }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<ExerciseDataType | null>(null);

    const handleImageClick = (exercise: ExerciseDataType) => {
        setCurrentExercise(exercise);
        
        setModalVisible(true);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    };

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
            }
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Rest',
            dataIndex: 'rest',
            key: 'rest',
        },
    ];

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Title level={4}>{title}</Title>
                </div>
            </div>
            <Table
                dataSource={exerciseData}
                columns={columns}
                rowKey={(record) => record.id}
                pagination={false}
            />
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
        </div>
    );
});

export default GeneratedTable;
