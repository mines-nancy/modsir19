import React from 'react';
import './App.css';
import { I18n } from 'react-polyglot';
import LocaleContext from './utils/localeContext';
import messages from './messages';
import { MainAppBar } from './appBar/MainAppBar';
import { Route, Switch, HashRouter } from 'react-router-dom';
import NotFound from './NotFound';
import Home from './Home';

const App = () => {
    const initialLocale = 'fr';
    const localeStateHook = React.useState(initialLocale);
    const [locale, setLocale] = localeStateHook;

    return (
        <LocaleContext.Provider value={localeStateHook}>
            <I18n locale={locale} messages={locale === 'fr' ? messages.fr : messages.en}>
                <div className="App">
                    <HashRouter basename="/">
                        <MainAppBar />
                        <Switch>
                            <Route path="/" render={(routeProps) => <Home {...routeProps} />} />

                            <Route render={() => <NotFound />} />
                        </Switch>
                    </HashRouter>
                </div>
            </I18n>
        </LocaleContext.Provider>
    );
};

export default App;
