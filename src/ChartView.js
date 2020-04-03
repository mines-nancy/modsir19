import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';

class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
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
    }

    render() {
        return (
            <div className="Chart">
                <Line
                    data={this.state.lineData}
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
    }
}

export default Chart;
