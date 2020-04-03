import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';
import { generer_dates } from './model/generateur_dates'

const jour_0 = new Date(2020, 0, 23);

var tab_dates = generer_dates(jour_0, dummyModel().saints.length) ;

export const Chart = ({ s0, lambda, beta }) => {
    const { saints, infectes, retires } = dummyModel(s0, lambda, beta);
    const lineData = {
        labels: tab_dates,
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
