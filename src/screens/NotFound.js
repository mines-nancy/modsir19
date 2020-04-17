import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <img
                src={`${process.env.PUBLIC_URL}/404.png`}
                alt="Page not found"
                style={{
                    display: 'block',
                    margin: 'auto',
                    marginTop: '50px',
                    position: 'relative',
                }}
            />
            <Link to="/">Home</Link>
        </div>
    );
};

export default NotFound;
