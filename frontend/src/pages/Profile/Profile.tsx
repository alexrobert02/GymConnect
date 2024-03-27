import React, { useEffect, useState } from 'react';
import './Profile.scss';
import { useJwt } from "react-jwt";
import {securedInstance} from "../../services/api";

type UserDataTypes = {
    firstName: string;
    lastName: string,
    email: string,
    role: string
}

const getDefaultUserData = () => {
    // Sample user data
    const userData: UserDataTypes = {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    };
    return userData;
}

const ProfilePage = () => {
    const [email, setEmail] = useState<string>("");
    const [userData, setUserData] = useState<UserDataTypes>(getDefaultUserData());

    const { decodedToken }: any = useJwt(localStorage.getItem("token") as string);

    useEffect(() => {
        if (decodedToken) {
            setEmail(decodedToken.sub);
        }
    }, [decodedToken]);

    useEffect(() => {
        if (email) {
            securedInstance.get(`http://localhost:8082/api/v1/users/email/${email}`)
                .then((response) => setUserData(response.data))
                .catch((error) => console.error('Error fetching data:', error))
        }
    }, [email]);

    return (
        <div className="profile-page">
            <div className="profile-info">
                <h2>{`${userData?.firstName} ${userData?.lastName}`}</h2>
                <p>Email: {userData?.email}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
