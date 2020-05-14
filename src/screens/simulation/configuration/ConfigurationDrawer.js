import React, { useState, forwardRef } from 'react';
import { Form } from 'react-final-form';
import { Drawer, makeStyles, Tabs, Tab, AppBar, useTheme, useMediaQuery } from '@material-ui/core';

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

const ConfigurationForm = ({
    parameters,
    handleSubmit,
    expanded,
    setExpanded,
    events,
    setEvents,
}) => {
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
                                    <Tab label="configuration" />
                                    <Tab label={`évènements (${Object.keys(events).length})`} />
                                </Tabs>
                            </AppBar>
                            {tab === 0 && (
                                <ParametersDiagram expanded={expanded} setExpanded={setExpanded} />
                            )}
                            {tab === 1 && (
                                <EventsList
                                    events={events}
                                    setEvents={setEvents}
                                    initialDate={values.start_date}
                                />
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
};

const ConfigurationDrawer = forwardRef(
    (
        {
            parameters,
            handleSubmit,
            expanded,
            setExpanded,
            mobileOpen,
            handleDrawerToggle,
            events,
            setEvents,
        },
        ref,
    ) => {
        const classes = useStyles();
        const theme = useTheme();
        const small = useMediaQuery(theme.breakpoints.down('sm'));

        return (
            <aside className={classes.drawer}>
                {small ? (
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor="right"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{ paper: classes.drawerPaper }}
                        ref={ref}
                    >
                        <ConfigurationForm
                            parameters={parameters}
                            handleSubmit={handleSubmit}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            events={events}
                            setEvents={setEvents}
                        />
                    </Drawer>
                ) : (
                    <div>
                        <Drawer
                            classes={{ paper: classes.drawerPaper }}
                            anchor="right"
                            variant="permanent"
                            open
                            ref={ref}
                        >
                            <ConfigurationForm
                                parameters={parameters}
                                handleSubmit={handleSubmit}
                                expanded={expanded}
                                setExpanded={setExpanded}
                                events={events}
                                setEvents={setEvents}
                            />
                        </Drawer>
                    </div>
                )}
            </aside>
        );
    },
);

export default ConfigurationDrawer;
