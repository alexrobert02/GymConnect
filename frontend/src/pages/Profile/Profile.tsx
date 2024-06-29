import React, {useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {securedInstance} from "../../services/api";
import {Button, Divider, Modal, Space, Spin, Tooltip} from "antd";
import {v4} from "uuid";
import UserInfoInput from "./UserInfoInput";
import {FormOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";

type ModalTitleProps = {
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
};

export function ModalTitle({ isEditing, setIsEditing }: ModalTitleProps) {
    return (
        <span>
            User Profile
            {!isEditing && (
                <Tooltip title={"Edit user"}>
                    <FormOutlined onClick={() => setIsEditing(true)} />
                </Tooltip>
            )}
        </span>
    );
}

type ModalFooterProps = {
    isEditing: boolean;
    onLogout: () => void;
    onCancel: () => void;
    onSave: () => void;
};

export function ModalFooter({
                                isEditing,
                                onLogout,
                                onCancel,
                                onSave,
                            }: ModalFooterProps) {
    if (isEditing) {
        return (
            <>
                <Button children={"Cancel"} type="link" onClick={onCancel} danger />
                <Button
                    children={"Save"}
                    onClick={onSave}
                    className={
                        "border-[#5588da] text-[#5588da] hover:!border-[#277ff7] hover:!text-[#277ff7]"
                    }
                />
            </>
        );
    }
    return <Button children={"Logout"} onClick={onLogout} danger />;
}

type UserDataTypes = {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    [key: string]: any; // Allow additional properties
}

const filteredFields = [
    { backend: "firstName", frontend: "First Name", isEditable: true },
    { backend: "lastName", frontend: "Last Name", isEditable: true },
    { backend: "email", frontend: "Email", isEditable: false },
];

const getDefaultUserData = () => {
    const userData: UserDataTypes = {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    };
    return userData;
}

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserDataTypes>(getDefaultUserData());
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        const updatedUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName
        };
        securedInstance.put('/api/v1/users', updatedUserData)
            .then(response => {
                setIsEditing(false);
                toast.success("Profile updated successfully.")
            })
            .catch(error => {
                toast.error("Error updating profile.")
                console.error('Error updating user data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleLogout = () => {
        securedInstance.post('/api/v1/auth/logout')
            .then(() => {
                window.location.href = "/login";
                localStorage.removeItem("token");
            })
    };

    const fetchData = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const email = decodedToken.sub;

            if (email) {
                securedInstance.get(`/api/v1/users/email/${email}`)
                    .then((response) => {
                        setUserData(response.data);
                        setLoading(false);
                    })
                    .catch((error) =>
                        console.error('Error fetching data:', error)
                    )
                    .finally(() =>
                        setLoading(false)
                    );

            }
            console.log(email);
        }
    }

    const onProfileClick = () => {
        fetchData()
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className={"cursor-pointer"} onClick={onProfileClick}>
                Profile
            </div>
            <Modal
                title={<ModalTitle isEditing={isEditing} setIsEditing={setIsEditing} />}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                }}
                destroyOnClose={true}
                footer={
                    <ModalFooter
                        isEditing={isEditing}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                        onLogout={handleLogout}
                    />
                }>
                <div className={"w-full h-full px-[1rem] py-[1.5rem]"}>
                    <Divider dashed />
                    {!isLoading ? (
                        <Space direction="vertical" size={2} className={"flex w-full"}>
                            {filteredFields.map((field) => (
                                <React.Fragment key={v4()}>
                                    <UserInfoInput
                                        title={field.frontend}
                                        value={userData[field.backend]}
                                        type={"text"}
                                        isEditing={isEditing && field.isEditable}
                                        setValue={(newVal: string) => {
                                            if (field.isEditable) {
                                                setUserData(prevData => ({
                                                    ...prevData,
                                                    [field.backend]: newVal
                                                }));
                                            }
                                        }}
                                    />
                                </React.Fragment>
                            ))}
                        </Space>
                    ) : (
                        <Spin className={"w-full my-5"} />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;
