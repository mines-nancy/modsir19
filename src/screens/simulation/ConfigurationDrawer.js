import React from 'react';
import { Form } from 'react-final-form';
import { Hidden, Drawer, CardContent, makeStyles } from '@material-ui/core';

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
        paddingTop: 100,
        zIndex: 'initial',
        width: DRAWER_WIDTH,
        [theme.breakpoints.up('lg')]: {
            paddingTop: 0,
        },
    },
}));

const ConfigurationForm = ({ parameters, handleSubmit, expanded, setExpanded }) => {
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
                                    <AverageDurationBlock name="dm_si" label="Soins intensifs" />
                                ),
                                followUpCare: (
                                    <AverageDurationBlock name="dm_ss" label="Soins de suite" />
                                ),
                                death: <CardContent>Décès</CardContent>,
                                recovery: <CardContent>Guérison</CardContent>,
                            }}
                        />
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
