import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SearchInput from "./searchInput";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 5 },
    },
};

interface UserValue {
    label: string;
    value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
    console.log('fetching user', username);

    return fetch('https://randomuser.me/api/?results=5')
        .then((response) => response.json())
        .then((body) =>
            body.results.map(
                (user: { name: { first: string; last: string }; login: { username: string } }) => ({
                    label: `${user.name.first} ${user.name.last}`,
                    value: user.login.username,
                }),
            ),
        );
}

interface NewTableFormProps {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
}

const NewTableForm: React.FC<NewTableFormProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const [value, setValue] = useState<UserValue>()

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Handle form submission here
            console.log('Received values:', values);
            form.resetFields();
        });
        setIsModalOpen(false)

    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Add New Table"
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Add
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal">
                <Form.Item
                    name="tableName"
                    label="Table Name"
                    rules={[{ required: true, message: 'Please enter table name' }]}
                    {...formItemLayout}
                >
                    <Input />
                </Form.Item>
                <Form.List
                    name="names"
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 1) {
                                    return Promise.reject(new Error('At least 2 passengers'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    label={index === 0 ? 'Exercises' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        noStyle
                                    >
                                        <SearchInput
                                            mode="multiple"
                                            value={value}
                                            placeholder="Select users"
                                            fetchOptions={fetchUserList}
                                            onChange={(newValue) => {
                                                setValue(newValue as UserValue);
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add Exercise
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                {/* Add more form fields as needed */}
            </Form>
        </Modal>
    );
};

export default NewTableForm;
