import React from 'react';
import { Line } from 'react-chartjs-2';
import { generateDates } from '../../utils/dateGenerator';

const day0 = new Date(2020, 0, 23);

export const Chart = (values) => {
    const { healthy, infected, removed } = values;

    const lineData = {
        labels: generateDates(day0, healthy.length),
        datasets: [
            {
                label: ['Population saine'],
                data: healthy,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population infectée'],
                data: infected,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population rétablie'],
                data: removed,
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
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += Math.round(tooltipItem.yLabel * 100) / 100;
                                return label;
                            },
                        },
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
