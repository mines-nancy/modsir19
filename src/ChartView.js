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
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population infectée'],
                data: infectes,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population rétablie'],
                data: retires,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
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
                        text: 'Modèle SIR simple',
                        fontSize: 25,
                    },
                    scales: {
                        yAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Part de la population',
                                    fontSize: 18,
                                },
                            },
                        ],
                        xAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temps',
                                    fontSize: 18,
                                },
                            },
                        ],
                    },
                }}
            />
        </div>
    );
};
