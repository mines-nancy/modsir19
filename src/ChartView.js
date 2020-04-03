import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';

export const Chart = (s0, lambda, beta) => {
    const initialState = {
        lineData: {
            labels: new Array(dummyModel(s0, lambda, beta).saints.length),
            datasets: [
                {
                    label: ['Population saine'],
                    data: dummyModel(s0, lambda, beta).saints,
                },
                {
                    label: ['Population infectée'],
                    data: dummyModel(s0, lambda, beta).infectes,
                },
                {
                    label: ['Population rétablie'],
                    data: dummyModel(s0, lambda, beta).retires,
                },
            ],
        },
    };
    const [state, setState] = React.useState(initialState);

    return (
        <div className="Chart">
            <Line
                data={state.lineData}
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
