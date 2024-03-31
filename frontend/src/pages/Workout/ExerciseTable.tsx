import React from 'react';
import { Popconfirm, Table, Typography, Button, Modal } from 'antd';
import { MenuOutlined, DeleteOutlined } from '@ant-design/icons';
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

export interface ExerciseDataType {
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

interface ExerciseTableProps {
    exerciseData: ExerciseDataType[];
    onExerciseClick: (record: ExerciseDataType) => void;
    onDelete: (key: React.Key) => void;
    onDragEnd: (event: DragEndEvent) => void;
    title: string;
    onDeleteTable: () => void; // Function to delete the table
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
                                                         exerciseData,
                                                         onExerciseClick,
                                                         onDelete,
                                                         onDragEnd,
                                                         title,
                                                         onDeleteTable, // Added onDeleteTable prop
                                                     }) => {

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

    const columns: ColumnsType<ExerciseDataType> = [
        {
            key: 'sort'
        },
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            render: (text, record) => (
                <a onClick={() => onExerciseClick(record)}>{text}</a>
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
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => onDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{fontSize: '19px'}}/>
                    </Popconfirm>
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
        </DndContext>
    );
};

export default ExerciseTable;
