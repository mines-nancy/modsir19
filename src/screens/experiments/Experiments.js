import React from 'react';
import { Link as RouterLink, Redirect, Route, Switch } from 'react-router-dom';
import { I18n } from 'react-polyglot';
import LocaleContext from '../../utils/localeContext';
import messages from '../../i18n/messages';
import { Paper, Tab, Tabs, Toolbar } from '@material-ui/core';
import { useTranslate } from 'react-polyglot';
import { SIRView } from '../../components/simpleSir/SIRView';
import { ComplexSIRView } from '../../components/complexSir/ComplexSIRView';
import { SirPlusHView } from '../../components/sirPlusH/SirPlusHView';
import NotFound from '../NotFound';
import { MainAppBar } from '../../components/appBar/MainAppBar';

const ExperimentsHome = ({ match }) => {
    const path = '/experiments';
    const [value, setValue] = React.useState(`${path}/simpleSIR`);
    const t = useTranslate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <header>
                <Toolbar />
                <Paper square>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="disabled tabs example"
                    >
                        <Tab
                            label={t('home.simpleSIR')}
                            component={RouterLink}
                            value={`${path}/simpleSIR`}
                            to={`${path}/simpleSIR`}
                        />
                        <Tab
                            label={t('home.complexSIR')}
                            component={RouterLink}
                            value={`${path}/complexSIR`}
                            to={`${path}/complexSIR`}
                        />
                        <Tab
                            label={t('home.sirPlusH')}
                            component={RouterLink}
                            value={`${path}/sirHss`}
                            to={`${path}/sirHss`}
                        />
                    </Tabs>
                </Paper>
            </header>
            <main>
                <Switch>
                    <Route path={path} exact render={() => <Redirect to={`${path}/simpleSIR`} />} />
                    <Route
                        path={`${path}/simpleSIR`}
                        render={(routeProps) => {
                            setValue(`${path}/simpleSIR`);
                            return <SIRView />;
                        }}
                    />
                    <Route
                        path={`${path}/complexSIR`}
                        render={(routeProps) => {
                            setValue(`${path}/complexSIR`);
                            return <ComplexSIRView />;
                        }}
                    />
                    <Route
                        path={`${path}/sirHss`}
                        render={(routeProps) => {
                            setValue(`${path}/sirHss`);
                            return <SirPlusHView />;
                        }}
                    />
                    <Route render={() => <NotFound />} />
                </Switch>
            </main>
        </>
    );
};

const ExperimentsApp = (props) => {
    const initialLocale = 'fr';
    const localeStateHook = React.useState(initialLocale);
    const [locale] = localeStateHook;

    return (
        <LocaleContext.Provider value={localeStateHook}>
            <I18n locale={locale} messages={locale === 'fr' ? messages.fr : messages.en}>
                <div className="App">
                    <MainAppBar />
                    <ExperimentsHome {...props} />
                </div>
            </I18n>
        </LocaleContext.Provider>
    );
};

export default ExperimentsApp;
