import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';

export const Chart = ({ s0, lambda, beta }) => {
    const { saints, infectes, retires } = dummyModel(s0, lambda, beta);
    const lineData = {
        labels: new Array(saints.length),
        datasets: [
            {
                label: ['Population saine'],
                data: saints,
            },
            {
                label: ['Population infectée'],
                data: infectes,
            },
            {
                label: ['Population rétablie'],
                data: retires,
            },
        ],
    };

    return (
        <div className="Chart">
            <Line
                data={lineData}
                width="10"
                height="10"
                options={{
                    title: {
                        display: true,
                        text: 'Un graphique',
                        fontSize: 25,
                    },
                }}
            />
        </div>
    );
};
