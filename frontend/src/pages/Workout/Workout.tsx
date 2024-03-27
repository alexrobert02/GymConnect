import React, { useState } from 'react';
import './Workout.scss'
import { Popconfirm, Table, Modal, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ColumnsType } from 'antd/es/table';

interface ExerciseDataType {
    key: string | number;
    exercise: string;
    imageUrl: string;
    sets: number;
    reps: number[];
    weights: number;
    rest: number;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if ((child as React.ReactElement).key === 'sort') {
                    return React.cloneElement(child as React.ReactElement, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{ touchAction: 'none', cursor: 'move' }}
                                {...listeners}
                            />
                        ),
                    });
                }
                return child;
            })}
        </tr>
    );
};

const WorkoutPage = () => {
    // Sample exercise data
    const [exerciseData, setExerciseData] = useState<ExerciseDataType[]>([
        { key: 1, exercise: 'Push-ups', imageUrl: 'https://v2.exercisedb.io/image/-B1YmLFwJItw3d', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 },
        { key: 2, exercise: 'Squats', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 },
        { key: 3, exercise: 'Plank', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 },
        { key: 4, exercise: 'Burpees', imageUrl: 'https://static.strengthlevel.com/images/exercises/bench-press/bench-press-800.jpg', sets: 3, reps: [10, 8, 6], weights: 10, rest: 60 }
    ]);

    const [visible, setVisible] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<ExerciseDataType | null>(null);

    const columns: ColumnsType<ExerciseDataType> = [
        {
            key: 'sort'
        },
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            render: (text, record) => (
                <a onClick={() => handleExerciseClick(record)}>{text}</a>
            )
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
            render: (reps: any[]) => reps.join(', '),
        },
        {
            title: 'Weights',
            dataIndex: 'weights',
            key: 'weights',
        },
        {
            title: 'Rest',
            dataIndex: 'rest',
            key: 'rest',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_, record: { key: React.Key }) =>
                exerciseData.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleDelete = (key: React.Key) => {
        const newData = exerciseData.filter((item) => item.key !== key);
        setExerciseData(newData);
    };

    const handleExerciseClick = (record: ExerciseDataType) => {
        setCurrentExercise(record);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setExerciseData((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
        }
    };

    return (
        <div className="workout-page">
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={exerciseData.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="key"
                        columns={columns}
                        dataSource={exerciseData}
                        pagination={false}
                        title={() => (
                            <Typography.Title level={2} style={{ marginBottom: 0, textAlign: 'center' }}>
                                Monday
                            </Typography.Title>
                        )}
                    />
                </SortableContext>
            </DndContext>
            <Modal
                open={visible}
                onCancel={handleCloseModal}
                footer={null}
                title={currentExercise ? currentExercise.exercise : ''}
                width={'30%'}
            >
                {currentExercise && (
                    <img src={currentExercise.imageUrl} alt={currentExercise.exercise} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                )}
            </Modal>
        </div>
    );
};

export default WorkoutPage;
