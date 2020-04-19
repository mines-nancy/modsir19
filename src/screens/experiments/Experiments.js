import React from 'react';
import { I18n } from 'react-polyglot';
import LocaleContext from '../../utils/localeContext';
import messages from '../../i18n/messages';
import { Toolbar } from '@material-ui/core';
import { SirPlusHView } from '../../components/sirPlusH/SirPlusHView';
import { MainAppBar } from '../../components/appBar/MainAppBar';

const ExperimentsApp = (props) => {
    const initialLocale = 'fr';
    const localeStateHook = React.useState(initialLocale);
    const [locale] = localeStateHook;

    return (
        <LocaleContext.Provider value={localeStateHook}>
            <I18n locale={locale} messages={locale === 'fr' ? messages.fr : messages.en}>
                <div className="App">
                    <MainAppBar />
                    <header>
                        <Toolbar />
                    </header>
                    <main>
                        <SirPlusHView />
                    </main>
                </div>
            </I18n>
        </LocaleContext.Provider>
    );
};

export default ExperimentsApp;
