import React from 'react';
import './App.css';
import { Typography, Box } from '@material-ui/core';
import { SIRView } from './SIRView';
import { I18n } from 'react-polyglot';
import LocaleContext from './utils/localeContext';
import messages from './messages';

const App = () => {
    const initialLocale = 'fr';
    const localeStateHook = React.useState(initialLocale);
    const [locale, setLocale] = localeStateHook;

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
