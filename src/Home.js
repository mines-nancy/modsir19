import React from 'react';
import { Route, Switch, Redirect, Link as RouterLink } from 'react-router-dom';
import NotFound from './NotFound';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { useTranslate } from 'react-polyglot';
import { TestAPI } from './testApi/TestAPI';
import { SIRView } from './simpleSir/SIRView';
import { ComplexSIRView } from './complexSir/ComplexSIRView';

const Home = ({ match }) => {
    const path = match ? match.path : '';
    const [value, setValue] = React.useState(`${path}/simpleSIR`);
    const t = useTranslate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <header>
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
                            label={t('home.testAPI')}
                            component={RouterLink}
                            value={`${path}/testAPI`}
                            to={`${path}/testAPI`}
                        />
                    </Tabs>
                </Paper>
            </header>
            <main>
                <Switch>
                    <Route
                        path={`${path}`}
                        exact
                        render={() => <Redirect to={`${path}/simpleSIR`} />}
                    />
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
                        path={`${path}/testAPI`}
                        render={(routeProps) => {
                            setValue(`${path}/testAPI`);
                            return <TestAPI />;
                        }}
                    />
                    <Route render={() => <NotFound />} />
                </Switch>
            </main>
        </>
    );
};
export default Home;
