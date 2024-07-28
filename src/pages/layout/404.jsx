import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
    };

    const headingStyle = {
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    };

    const textStyle = {
        fontSize: '1.5rem',
        marginBottom: '2rem',
    };

    const imageStyle = {
        width: '300px',
    };

    const redirect = () => {
        navigate(`/`);
    }

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>404</h1>
            <p style={textStyle}>Oops! The page you're looking for does not exist.</p>
            <button className="btn btn-danger" onClick={redirect}>Back to Home Page</button>
        </div>
    );
}

export default NotFound;