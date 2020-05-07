import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { Hidden, Drawer, makeStyles, Tabs, Tab, AppBar } from '@material-ui/core';

import AutoSave from '../../../components/fields/AutoSave';
import ParametersDiagram from './ParametersDiagram';
import EventsList from './EventsList';

const DRAWER_WIDTH = 700;

const container = window !== undefined ? () => window.document.body : undefined;

const useStyles = makeStyles((theme) => ({
    drawer: {
        position: 'relative',
        [theme.breakpoints.up('lg')]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        backgroundColor: '#eee',
        paddingTop: 64,
        zIndex: 'initial',
        width: DRAWER_WIDTH,
        [theme.breakpoints.up('lg')]: {
            paddingTop: 0,
        },
    },
    appBar: {
        height: 64,
    },
    tabs: {
        height: '100%',
    },
    tabsFlexContainer: {
        height: '100%',
    },
    tabsIndicator: {
        backgroundColor: 'white',
    },
}));

const ConfigurationForm = ({ parameters, handleSubmit, expanded, setExpanded }) => {
    const classes = useStyles();
    const [tab, setTab] = useState(0);

    const handleTabChange = (evt, value) => {
        setTab(value);
    };

    return (
        <Form
            subscription={{}}
            onSubmit={() => {
                /* Useless since we use a listener on autosave */
            }}
            initialValues={parameters}
            render={({ form }) => {
                const { values } = form.getState();

                return (
                    <div>
                        <AutoSave save={handleSubmit} debounce={200} />
                        <div>
                            <AppBar position="relative" className={classes.appBar}>
                                <Tabs
                                    value={tab}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    classes={{
                                        root: classes.tabs,
                                        flexContainer: classes.tabsFlexContainer,
                                        indicator: classes.tabsIndicator,
                                    }}
                                >
                                    <Tab label="Configuration" />
                                    <Tab label="Evènements" />
                                </Tabs>
                            </AppBar>
                            {tab === 0 && (
                                <ParametersDiagram expanded={expanded} setExpanded={setExpanded} />
                            )}
                            {tab === 1 && <EventsList initialDate={values.start_date} />}
                        </div>
                    </div>
                );
            }}
        />
    );
};

const ConfigurationDrawer = ({
    parameters,
    handleSubmit,
    expanded,
    setExpanded,
    refreshLines,
    mobileOpen,
    handleDrawerToggle,
}) => {
    const classes = useStyles();

    return (
        <aside className={classes.drawer}>
            <Hidden smUp implementation="css">
                <Drawer
                    PaperProps={{ onScroll: refreshLines }}
                    container={container}
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{ paper: classes.drawerPaper }}
                >
                    <ConfigurationForm
                        parameters={parameters}
                        handleSubmit={handleSubmit}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    />
                </Drawer>
            </Hidden>
            <Hidden mdDown implementation="css">
                <div>
                    <Drawer
                        PaperProps={{ onScroll: refreshLines }}
                        classes={{ paper: classes.drawerPaper }}
                        anchor="right"
                        variant="permanent"
                        open
                    >
                        <ConfigurationForm
                            parameters={parameters}
                            handleSubmit={handleSubmit}
                            expanded={expanded}
                            setExpanded={setExpanded}
                        />
                    </Drawer>
                </div>
            </Hidden>
        </aside>
    );
};

export default ConfigurationDrawer;
