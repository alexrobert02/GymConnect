import React, {useState} from 'react';
import './Authentication.scss';
import api from '../../services/api'
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Form, Input} from 'antd';

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [form] = Form.useForm();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        form.validateFields().then(async values => {
            try {
                const response = await api.post('/api/v1/auth/authenticate', {
                    email: values.email,
                    password: values.password
                });

                if (response.status === 200) {
                    toast.success('You are successfully logged in!')
                    // Authentication successful
                    const data = await response.data
                    // Store the access token in localStorage
                    localStorage.setItem('token', data.access_token);
                    // Refresh the browser
                    window.location.reload();
                    // Handle successful login, e.g., redirect to dashboard
                    navigate('/home')

                } else {
                    toast.error('Invalid email or password.')
                    // Authentication failed
                    // Handle failed login, e.g., display error message
                }
            } catch (error) {
                toast.error('Invalid email or password.')
            }
        })
    };

    return (
        <div className="auth-background-gradient">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-header">Login</h2>
                    <Form
                        form={form}
                        name="normal_login"
                        className="login-form"
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                suffix={<span onClick={toggleShowPassword} style={{marginRight: '0px'}}>
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </span>}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={{ width: '400px' }}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="forgot-password">Forgot your password? <a href="/forgot-password">Reset it here</a></p>
                    <p className="signup-link">Don't have an account? <a href="/register">Register now</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;