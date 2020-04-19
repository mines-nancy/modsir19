import React from 'react';

export const Percent = ({ percent, size = '20' }) => {
    const circumference = 31.42;
    const strokeDash = Math.round((percent * circumference) / 100);

    return (
        <svg height={size} width={size} viewBox="0 0 20 20">
            <circle r="8" cx="10" cy="10" stroke-width="1" stroke="black" fill="white" />
            <circle
                r="4"
                cx="10"
                cy="10"
                fill="white"
                stroke="tomato"
                stroke-width="8"
                stroke-dasharray={`${strokeDash} ${circumference}`}
                transform="rotate(-90) translate(-20)"
            />
        </svg>
    );
};
