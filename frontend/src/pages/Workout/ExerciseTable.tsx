import React, { useState } from 'react';
import { Popconfirm, Table, Typography, Button, Modal } from 'antd';
import { MenuOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ColumnsType } from 'antd/es/table';
import ExerciseForm from "./ExerciseForm";

export interface ExerciseDataType {
    key: string | number;
    name: string;
    gifUrl: string;
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

interface ExerciseTableProps {
    exerciseData: ExerciseDataType[];
    setExerciseData: (exerciseData: ExerciseDataType[]) => void;
    onExerciseClick: (record: ExerciseDataType) => void;
    onDragEnd: (event: DragEndEvent) => void;
    title: string;
    onDeleteTable: () => void; // Function to delete the table
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
                                                         exerciseData,
                                                         setExerciseData,
                                                         onExerciseClick,
                                                         onDragEnd,
                                                         title,
                                                         onDeleteTable, // Added onDeleteTable prop
                                                     }) => {
    const [editingExercise, setEditingExercise] = useState<ExerciseDataType | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    //console.log("exercise data:", exerciseData)

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: "Delete Table",
            icon: <ExclamationCircleFilled />,
            content: "Are you sure you want to delete this table?",
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDeleteTable()
            }
        })
    }

    const onDelete = (key: React.Key) => {
        const newData = exerciseData.filter((item) => item.key !== key);
        setExerciseData(newData);
    };

    const editExercise = (key: React.Key) => {
        const exerciseToEdit = exerciseData.find(item => item.key === key);
        if (exerciseToEdit) {
            setEditingExercise(exerciseToEdit);
            setIsModalVisible(true);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingExercise(null);
    };

    const handleEdit = (editedExercise: ExerciseDataType) => {
        const updatedData = exerciseData.map(item =>
            item.key === editedExercise.key ? editedExercise : item
        );
        setExerciseData(updatedData);
        setIsModalVisible(false);
        setEditingExercise(null);
    };

    const columns: ColumnsType<ExerciseDataType> = [
        {
            key: 'sort'
        },
        {
            title: 'Exercise',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <a onClick={() => onExerciseClick(record)}>{name}</a>
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
                exerciseData.length >= 1 ?
                    (
                        <>
                            <EditOutlined
                                style={{ fontSize: '19px' }}
                                onClick={() => editExercise(record.key)}
                            />
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => onDelete(record.key)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined style={{fontSize: '19px', marginRight: '8px'}}/>
                            </Popconfirm>
                        </>
                    ) : null,
        },
    ];

    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography.Title level={2} style={{ marginBottom: 0, textAlign: 'center' }}>
                                {title}
                            </Typography.Title>
                            {exerciseData.length >= 1 && ( // Render the delete button conditionally
                                <Button type="primary" danger onClick={showDeleteConfirm}>
                                    Delete Table
                                </Button>
                            )}
                        </div>
                    )}
                />
            </SortableContext>
            <Modal
                title="Edit Exercise"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <ExerciseForm
                    exercise={editingExercise}
                    onFinish={handleEdit}
                />
            </Modal>
        </DndContext>
    );
};

export default ExerciseTable;