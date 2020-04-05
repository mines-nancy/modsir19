import React from 'react';
import { Line } from 'react-chartjs-2';
import { dummyModel } from './model/sir';
import { generer_dates } from './model/generateur_dates'

const jour_0 = new Date(2020, 0, 23);

//var tab_dates = generer_dates(jour_0, dummyModel().saints.length) ;


export const Chart = ({ s0, lambda, beta }) => {

    //const { sains, infectes, retires } = dummyModel(s0, lambda, beta);

    const values = {s0 : {s0}, lambda: {lambda}, beta: {beta}};

    const [placeholderDataPOST, setPlaceholderDataPOST] = React.useState();

    const computeSIR = async () => {
        // Computation of the values of the SIR model in the back
        const inputFunction = values ;
        const response = await fetch('/get_simple_sir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputFunction),
        });

        if (response.ok) {
            // eslint-disable-next-line no-console
            console.log('response worked!');
            response.json().then((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
                setPlaceholderDataPOST(data);
            });
        }
    }

    computeSIR();

    const start_date = new Date(2020, 4, 4);
    //const dates_range = generer_dates(start_date, saints.length);

    const lineData = {

        labels: [],
        datasets: [
            {
                label: ['Population saine'],
                data: placeholderDataPOST.healthy,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population infectée'],
                data: placeholderDataPOST.infected,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: ['Population rétablie'],
                data: placeholderDataPOST.removed,
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
