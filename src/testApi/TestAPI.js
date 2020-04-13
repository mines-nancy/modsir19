import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import api from '../utils/api';

export const TestAPI = () => {
    const [placeholderData, setPlaceholderData] = useState({ a: 0, b: 0 });
    const [placeholderDataPOST, setPlaceholderDataPOST] = useState({ result: 0 });
    const [placeholderDataGET, setPlaceholderDataGET] = useState({ result: 0 });

    useEffect(() => {
        const f = async () => {
            const response = await api.get('/get_data_sample');
            setPlaceholderData(response.data);
        };
        f();
    }, []);

    const handleClick = async () => {
        // Example pour envoyer un appel POST a l'API
        const inputFunction = { x: 2, y: 3 };

        const responseGET = await api.get('/get_add_data', {
            params: { inputFunction },
        });
        setPlaceholderDataGET(responseGET.data);

        const responsePOST = await api.post('/add_data', {
            inputFunction,
        });
        setPlaceholderDataPOST(responsePOST.data);
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
                GET 2 + 3 = {placeholderDataGET.result}
            </Typography>
            <Typography variant="h4" component="h2">
                POST 2 + 3 = {placeholderDataPOST.result}
            </Typography>
        </Box>
    );
};
