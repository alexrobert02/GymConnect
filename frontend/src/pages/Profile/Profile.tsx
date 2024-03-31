import React, { useEffect, useState } from 'react';
import './Profile.scss';
import { jwtDecode } from 'jwt-decode';
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
    const [userData, setUserData] = useState<UserDataTypes>(getDefaultUserData());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token); // Decode token
            const email = decodedToken.sub; // Extract email from decoded token

            if (email) {
                securedInstance.get(`http://localhost:8082/api/v1/users/email/${email}`)
                    .then((response) => {
                        setUserData(response.data);
                        setLoading(false); // Set loading to false when data is fetched
                    })
                    .catch((error) => console.error('Error fetching data:', error));
            }
            console.log(email)
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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
