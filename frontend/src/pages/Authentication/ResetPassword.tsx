import React, {useState} from 'react';
import './Authentication.scss'; // You can style your register page in Register.scss file
import api from '../../services/api'
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";
import {Button, Form, Input} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, LockOutlined} from "@ant-design/icons";

function ResetPasswordPage() {
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

    const handleResetPassword = async () => {

        form.validateFields().then(async values => {

            function extractTokenFromUrl() {
                const url = window.location.href;
                const segments = url.split('/');
                return segments.pop() || segments.pop();  // Handle potential trailing slash
            }

            const token = extractTokenFromUrl();
            if (!token) {
                console.error('No token found in local storage');
                return;
            }
            const decodedToken: any = jwtDecode(token);
            const email = decodedToken.sub;

            try {

                const response = await api.put('/api/v1/users/reset-password', {
                    email: email,
                    newPassword: values.password,
                    confirmationPassword: values.confirmPassword
                });

                if (response.status === 200) {
                    // Registration successful
                    toast.success('Password changed!')
                    navigate('/login')
                } else {
                    toast.error('Password reset failed!');
                }
            } catch (error) {
                console.error('Error occurred during password reset:', error);
                toast.error('Error occurred during password reset!');
                // Handle error, e.g., display error message
            }
        })
    };

    return (
        <div className="auth-background-gradient">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-header">Reset your password</h2>
                    <p className="form-text">Enter a new password for you account.</p>
                    <Form
                        form={form}
                        name="normal_reset_password"
                        className="reset_password-form"
                        onFinish={handleResetPassword}
                    >
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                suffix={<span onClick={toggleShowPassword} style={{marginRight: '0px'}}>
                                    {showPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                </span>}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{required: true, message: 'Please confirm your Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                suffix={<span onClick={toggleShowConfirmPassword} style={{marginRight: '0px'}}>
                                    {showConfirmPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                </span>}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={{width: '400px'}}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
