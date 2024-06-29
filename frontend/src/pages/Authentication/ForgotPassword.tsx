import React from 'react';
import './Authentication.scss';
import api from '../../services/api'
import {toast} from "react-toastify";
import {Button, Form, Input} from "antd";
import {UserOutlined} from "@ant-design/icons";

function ForgotPasswordPage() {
    const [form] = Form.useForm();

    const handlePasswordReset = async () => {

        form.validateFields().then(async values => {

            if (!isValidEmail(values.email)) {
                toast.error("Invalid Email!")
                return;
            }

            try {
                const response = await api.get(`/api/v1/users/check-email/${values.email}`);
                const data = response.data;

                if (data === 'Email exists') {
                    await api.post(`/api/v1/auth/request-password-reset/${values.email}`)
                    toast.success('Password reset email sent successfully!')
                } else if (data === 'Email not found') {
                    toast.error('Email not found!')
                    // Handle failed registration, e.g., display error message
                }
            } catch (error) {
                console.error('Error occurred during email check:', error);
                toast.error('Something went wrong!')
                // Handle other errors, e.g., display error message
            }
        })
    };

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <div className="auth-background-gradient">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-header">Forgot Password</h2>
                    <p className="form-text">Enter your user account's email address and we will send you a
                        password reset link.</p>
                    <Form
                        form={form}
                        name="normal_login"
                        className="login-form"
                        onFinish={handlePasswordReset}
                    >
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: 'Please input your Email!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                        </Form.Item>
                        <Form.Item
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={{width: '400px'}}>
                                Send email
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="login-link">Return to <a href="/login">Login Page</a></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
