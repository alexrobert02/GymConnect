import React from 'react';
import './NotFound.scss'; // Import your CSS file for styling

const NotFoundPage = () => {
    return (
        <div className="not-found-background-gradient">
            <div className="not-found-container">
                <h1>404 - Not Found</h1>
                <p className="not-found-p">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            </div>
        </div>
    );
};

export default NotFoundPage;
