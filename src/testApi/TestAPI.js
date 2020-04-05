import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@material-ui/core';

export const TestAPI = () => {
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

    const handleClick = async () => {
        // Example pour envoyer un appel POST a l'API
        const inputFunction = { x: 2, y: 3 };
        const response = await fetch('/add_data', {
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
                // At this point, data is {"a": 2, "b": 3}
                setPlaceholderDataPOST(data);
            });
        }
    };

    return (
        <Box m={8}>
            <Typography variant="h4" component="h2">
                Data récupérée de l'API python: (a: {placeholderData.a}, b: {placeholderData.b})
            </Typography>
            <Button color="primary" onClick={handleClick}>
                Recupérer données
            </Button>
            <Typography variant="h4" component="h2">
                Reponse de l'API Python à la requête POST envoyée par le bouton: 2 + 3 =
                {placeholderDataPOST.result}
            </Typography>
        </Box>
    );
};
