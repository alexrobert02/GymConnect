import React, { useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SearchInput from "./searchInput";

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
        sm: { span: 19, offset: 3 },
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
            centered
            //width={800}
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
                {/*<Form.List*/}
                {/*    name="exercises"*/}
                {/*    rules={[*/}
                {/*        {*/}
                {/*            validator: async (_, exercises) => {*/}
                {/*                if (!exercises || exercises.length < 1) {*/}
                {/*                    return Promise.reject(new Error('At least 1 exercise'));*/}
                {/*                }*/}
                {/*            },*/}
                {/*        },*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    {(fields, { add, remove }, { errors }) => (*/}
                {/*        <>*/}
                {/*            {fields.map((field, index) => (*/}
                {/*                <Space key={field.key} style={{ display: 'flex' }} align="start">*/}
                {/*                    <Form.Item*/}
                {/*                        //{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}*/}
                {/*                        //required={false}*/}
                {/*                    >*/}
                {/*                        <Form.Item*/}
                {/*                            {...field}*/}
                {/*                            validateTrigger={['onChange', 'onBlur']}*/}
                {/*                            noStyle*/}
                {/*                            {...formItemLayoutWithOutLabel}*/}
                {/*                        >*/}
                {/*                            <SearchInput*/}
                {/*                                mode="multiple"*/}
                {/*                                value={value}*/}
                {/*                                placeholder="Select users"*/}
                {/*                                fetchOptions={fetchUserList}*/}
                {/*                                onChange={(newValue) => {*/}
                {/*                                    setValue(newValue as UserValue);*/}
                {/*                                }}*/}
                {/*                                style={{ width: '100%' }}*/}
                {/*                            />*/}
                {/*                        </Form.Item>*/}
                {/*                    </Form.Item>*/}
                {/*                    <Form.Item*/}
                {/*                        {...field}*/}
                {/*                        name={[field.name, 'sets']}*/}
                {/*                        rules={[{ required: true, message: 'Please enter sets' }]}*/}
                {/*                    >*/}
                {/*                        <InputNumber min={1} placeholder="Sets" />*/}
                {/*                    </Form.Item>*/}
                {/*                    <Form.Item*/}
                {/*                        {...field}*/}
                {/*                        name={[field.name, 'reps']}*/}
                {/*                        rules={[{ required: true, message: 'Please enter reps' }]}*/}
                {/*                    >*/}
                {/*                        <InputNumber min={1} placeholder="Reps" />*/}
                {/*                    </Form.Item>*/}
                {/*                    <Form.Item*/}
                {/*                        {...field}*/}
                {/*                        name={[field.name, 'weight']}*/}
                {/*                        rules={[{ required: true, message: 'Please enter weight' }]}*/}
                {/*                    >*/}
                {/*                        <InputNumber min={0} placeholder="Weight" />*/}
                {/*                    </Form.Item>*/}
                {/*                    <Form.Item*/}
                {/*                        {...field}*/}
                {/*                        name={[field.name, 'rest']}*/}
                {/*                        rules={[{ required: true, message: 'Please enter rest' }]}*/}
                {/*                    >*/}
                {/*                        <InputNumber min={0} placeholder="Rest (secs)" />*/}
                {/*                    </Form.Item>*/}
                {/*                    <MinusCircleOutlined*/}
                {/*                        className="dynamic-delete-button"*/}
                {/*                        onClick={() => remove(field.name)}*/}
                {/*                    />*/}
                {/*                </Space>*/}
                {/*            ))}*/}
                {/*            <Form.Item {...formItemLayoutWithOutLabel}>*/}
                {/*                <Button*/}
                {/*                    type="dashed"*/}
                {/*                    onClick={() => add()}*/}
                {/*                    style={{ width: '60%' }}*/}
                {/*                    icon={<PlusOutlined />}*/}
                {/*                >*/}
                {/*                    Add Exercise*/}
                {/*                </Button>*/}
                {/*                <Form.ErrorList errors={errors} />*/}
                {/*            </Form.Item>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</Form.List>*/}
            </Form>
        </Modal>
    );
};

export default NewTableForm;
