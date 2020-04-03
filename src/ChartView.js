import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';

const Chart = () => {
    const initialState = {
        lineData: {
            labels: new Array(dummyModel().saints.length),
            datasets: [
                {
                    label: ['Population saine'],
                    data: dummyModel().saints,
                },
                {
                    label: ['Population infectée'],
                    data: dummyModel().infectes,
                },
                {
                    label: ['Population rétablie'],
                    data: dummyModel().retires,
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

export default Chart;
