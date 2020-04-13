import React from 'react';
import {Link as RouterLink, Redirect, Route, Switch} from 'react-router-dom';
import NotFound from './NotFound';
import {Paper, Tab, Tabs, Toolbar} from '@material-ui/core';
import {useTranslate} from 'react-polyglot';
import {SIRView} from './simpleSir/SIRView';
import {ComplexSIRView} from './complexSir/ComplexSIRView';
import {SirPlusHView} from "./sirPlusH/SirPlusHView";

const Home = ({match}) => {
    const path = match ? (match.path === '/' ? '' : match.path) : '';
    const [value, setValue] = React.useState(`${path}/simpleSIR`);
    const t = useTranslate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <header>
                <Toolbar/>
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
                    <Route path={`/`} exact render={() => <Redirect to={`${path}/simpleSIR`}/>}/>
                    <Route
                        path={`${path}/simpleSIR`}
                        render={(routeProps) => {
                            setValue(`${path}/simpleSIR`);
                            return <SIRView/>;
                        }}
                    />
                    <Route
                        path={`${path}/complexSIR`}
                        render={(routeProps) => {
                            setValue(`${path}/complexSIR`);
                            return <ComplexSIRView/>;
                        }}
                    /><Route
                    path={`${path}/sirHss`}
                    render={(routeProps) => {
                        setValue(`${path}/sirHss`);
                        return <SirPlusHView/>;
                    }}
                />
                    <Route render={() => <NotFound/>}/>
                </Switch>
            </main>
        </>
    );
};
export default Home;
