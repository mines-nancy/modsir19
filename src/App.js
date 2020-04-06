import React, { useEffect, useState } from 'react';
import './App.css';
import { Typography, Box, Button } from '@material-ui/core';
import { SIRView } from './SIRView';
import { I18n } from 'react-polyglot';
import LocaleContext from './utils/localeContext';
import messages from './messages';
import { Chart } from './ChartView';

const App = () => {
    const initialLocale = 'fr';
    const localeStateHook = React.useState(initialLocale);
    const [locale, setLocale] = localeStateHook;
    const [placeholderData, setPlaceholderData] = useState({ a: 0, b: 0 });
    const [placeholderDataPOST, setPlaceholderDataPOST] = useState({ result: 0 });
    const [placeholderDataPOST_SIR, setPlaceholderDataPOST_SIR] = useState({
        healthy: [0, 1, 2],
        infected: [0, 2, 1],
        removed: [1, 0, 2],
    });

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

    const handleClickSIR = async () => {
        // Computation of the values of the SIR model in the back
        const inputFunction = { s0: 0.9, lambda: 12, beta: 0.5 };
        // eslint-disable-next-line no-console
        console.log(placeholderDataPOST_SIR.healthy.length);
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
                setPlaceholderDataPOST_SIR(data);
                console.log(placeholderDataPOST_SIR.healthy);
                console.log(placeholderDataPOST_SIR.healthy.length);
            });
        }
    };

    return (
        <LocaleContext.Provider value={localeStateHook}>
            <I18n locale={locale} messages={locale === 'fr' ? messages.fr : messages.en}>
                <div className="App">
                    <Box m={8}>
                        <Typography variant="h3" component="h2">
                            Projet MODCOV19 - prototype v1.0
                        </Typography>
                    </Box>
                    <Box m={8}>
                        <Typography variant="h4" component="h2">
                            Data récupérée de l'API python: (a: {placeholderData.a}, b:{' '}
                            {placeholderData.b})
                        </Typography>
                        <Button color="primary" onClick={handleClick}>
                            Recupérer données
                        </Button>
                        <Typography variant="h4" component="h2">
                            Reponse de l'API Python à la requête POST envoyée par le bouton: 2 + 3 =
                            {placeholderDataPOST.result}
                        </Typography>
                    </Box>
                    <Typography variant="body1" component="h2">
                        Entrer les paramètres du modèle SIR dans les champs suivants puis cliquer
                        sur CALCULER.
                    </Typography>
                    <Box m={8} h={30}>
                        <Button color="primary" onClick={handleClickSIR}>
                            Afficher graphique
                        </Button>
                        {Chart(placeholderDataPOST_SIR)}
                        <Typography variant="h5" component="h2">
                            Entrer les paramètres du modèle SIR dans les champs suivants puis
                            cliquer sur CALCULER.
                        </Typography>
                    </Box>
                    <Box m={8}>
                        <SIRView />
                    </Box>
                </div>
            </I18n>
        </LocaleContext.Provider>
    );
};

export default App;
