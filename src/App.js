import React, { useEffect, useState } from 'react';
import './App.css';
import { Typography, Box, Button } from '@material-ui/core';
import { SIRView } from './SIRView';
import { dummyModel } from './model/sir';
import { Chart } from './ChartView';

const App = () => {
    const [placeholderData, setPlaceholderData] = useState({ a: 0, b: 0 });
    const [placeholderDataPOST, setPlaceholderDataPOST] = useState({ result: 0 });

    useEffect(() => {
        fetch('/get_data_sample').then((response) =>
            response.json().then((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
                // At this point, data is {"a": 2, "b": 3}
                setPlaceholderData(data);
            }),
        );
    }, []);

    return (
        <div className="App">
            <Box m={8}>
                <Typography variant="h3" component="h2">
                    Projet MODCOV19 - prototype
                </Typography>
            </Box>
            <Box m={8}>
                <Typography variant="h4" component="h2">
                    Data récupérée de l'API python: (a: {placeholderData.a}, b: {placeholderData.b})
                </Typography>
                <Button
                    color="primary"
                    onClick={async () => {
                        // Example pour envoyer un appel POST a l'API
                        const function_input = { x: 2, y: 3 };
                        const response = await fetch('/add_data', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(function_input)
                        });

                        if (response.ok) {
                            // eslint-disable-next-line no-console
                            console.log('response worked!');
                            response.json().then((data) => {
                                // eslint-disable-next-line no-console
                                console.log(data);
                                // At this point, data is {"a": 2, "b": 3}
                                setPlaceholderDataPOST(data);
                            });
                        }
                    }}
                >
                    Recupérer données
                </Button>
                <Typography variant="h4" component="h2">
                    Reponse de l'API Python à la requête POST envoyée par le bouton: 2 + 3 = 
                    {placeholderDataPOST.result}
                </Typography>
            </Box>
            <Typography variant="body1" component="h2">
                Dummy result {dummyModel().saints}
            </Typography>
            <Box m={8} h={30}>
                {Chart({ s0: 0.9, lambda: 6, beta: 0.6 })}
            </Box>
            <Box m={8} h={30}>
                <SIRView />
            </Box>
        </div>
    );
};

export default App;
