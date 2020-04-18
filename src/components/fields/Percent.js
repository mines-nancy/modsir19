import React from 'react';

export const Percent = ({ percent }) => {
    const max = percent > 50 ? percent : 100 - percent;
    const min = 100 - max;

    return (
        <div style={{ display: 'flex', padding: '15px 0', fontSize: 13, alignItems: 'center' }}>
            <div style={{ paddingRight: 5, paddingBottom: 2 }}>{max}%</div>
            <div>
                <svg height="20" width="20" viewBox="0 0 20 20">
                    <circle r="8" cx="10" cy="10" stroke-width="1" stroke="black" fill="white" />
                    <circle
                        r="4"
                        cx="10"
                        cy="10"
                        fill="white"
                        stroke="tomato"
                        stroke-width="8"
                        stroke-dasharray="calc(50 * 31.42 / 100) 31.42"
                        transform="rotate(-90) translate(-20)"
                    />
                </svg>
            </div>
            <div style={{ paddingLeft: 5, paddingBottom: 2 }}>{min}%</div>
        </div>
    );
};
