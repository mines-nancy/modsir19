import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-polyglot';

const NotFound = () => {
    const t = useTranslate();
    return (
        <div>
            <img
                src={`${process.env.PUBLIC_URL}/404.png`}
                alt={t('pageNotFound')}
                style={{
                    display: 'block',
                    margin: 'auto',
                    marginTop: '50px',
                    position: 'relative',
                }}
            />
            <Link to="/">{t('returnToHomepage')}</Link>
        </div>
    );
};
export default NotFound;
