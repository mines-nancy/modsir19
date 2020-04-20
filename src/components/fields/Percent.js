import React from 'react';

export const Percent = ({ percent, size = '20' }) => {
    const circumference = 2 * Math.PI * 4;
    const strokeDash = Math.round(((100 - percent) * circumference) / 100);

    return (
        <svg height={size} width={size} viewBox="0 0 20 20">
            <circle r="8" cx="10" cy="10" strokeWidth="1" stroke="black" fill="white" />
            <circle
                r="4"
                cx="10"
                cy="10"
                fill="white"
                stroke="tomato"
                strokeWidth="8"
                strokeDasharray={`${strokeDash} ${circumference}`}
                transform="rotate(-90) translate(-20)"
            />
        </svg>
    );
};
