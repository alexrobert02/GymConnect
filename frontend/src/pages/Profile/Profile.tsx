// ProfilePage.js

import React from 'react';
import './Profile.scss';

const ProfilePage = () => {
    // Sample user data
    const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com'
    };

    return (
        <div className="profile-page">
            <div className="profile-info">
                <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
                <p>Email: {userData.email}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
