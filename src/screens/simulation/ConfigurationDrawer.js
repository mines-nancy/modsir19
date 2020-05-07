import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { Hidden, Drawer, CardContent, makeStyles, Tabs, Tab, AppBar } from '@material-ui/core';

import AutoSave from '../../components/fields/AutoSave';
import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from './blocks';
import Diagram from './Diagram';

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
        width: DRAWER_WIDTH,
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
            render={() => (
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
                            <Diagram
                                blocks={{
                                    totalPopulation: (
                                        <TotalPopulationBlock
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                        />
                                    ),
                                    exposedPopulation: <ExposedPopulationBlock />,
                                    incubation: (
                                        <AverageDurationBlock name="dm_incub" label="Incubation" />
                                    ),
                                    spontaneousRecovery: (
                                        <AverageDurationBlock
                                            name="dm_r"
                                            label="Rétablissement spontané"
                                        />
                                    ),
                                    hospitalisation: (
                                        <AverageDurationBlock name="dm_h" label="Hospitalisation" />
                                    ),
                                    medicalCare: (
                                        <AverageDurationBlock name="dm_sm" label="Soins médicaux" />
                                    ),
                                    intensiveCare: (
                                        <AverageDurationBlock
                                            name="dm_si"
                                            label="Soins intensifs"
                                        />
                                    ),
                                    followUpCare: (
                                        <AverageDurationBlock name="dm_ss" label="Soins de suite" />
                                    ),
                                    death: <CardContent>Décès</CardContent>,
                                    recovery: <CardContent>Guérison</CardContent>,
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
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
