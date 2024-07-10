import React, {useState} from 'react';
import './Authentication.scss'; // You can style your register page in Register.scss file
import api from '../../services/api'
import {useNavigate} from "react-router-dom";
import {Button, Form, Input} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";

function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form] = Form.useForm();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleRegister = async () => {

        form.validateFields().then(async values => {

            if (!isValidEmail(values.email)) {
                toast.error("Invalid Email!")
                return;
            }

            if (values.password !== values.confirmPassword) {
                toast.error("Passwords don't match!")
                return;
            }

            try {
                const response = await api.post('/api/v1/auth/register', {
                    email: values.email,
                    password: values.password,
                    role: "USER"
                });

                if (response.status === 200) {
                    // Registration successful
                    const data = await response.data;
                    navigate('/')
                    // Handle successful registration, e.g., redirect to login page
                } else {
                    // Registration failed
                    // Handle failed registration, e.g., display error message
                }
            } catch (error) {
                console.error('Error occurred during registration:', error);
                // Handle error, e.g., display error message
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
                    <h2 className="auth-header">Create an Account</h2>
                    <Form
                        form={form}
                        name="normal_register"
                        className="register-form"
                        onFinish={handleRegister}
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
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please confirm your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                suffix={<span onClick={toggleShowConfirmPassword} style={{marginRight: '0px'}}>
                                    {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="login-link">Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
