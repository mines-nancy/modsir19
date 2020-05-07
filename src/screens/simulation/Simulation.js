import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-final-form';

import AwesomeDebouncePromise from 'awesome-debounce-promise';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import {
    makeStyles,
    CardContent,
    Switch,
    Hidden,
    Drawer,
    Toolbar,
    AppBar,
    Typography,
    CircularProgress,
} from '@material-ui/core';

import './Simulation.css';
import AutoSave from '../../components/fields/AutoSave';
import { formatParametersForModel, defaultParameters as defaultParametersValues } from './common';
import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from './blocks';
import Diagram from './Diagram';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { ImportButton, ExportButton } from './ExportImport';
import { ZoomSlider, useZoom } from './ZoomSlider';

const getModel = async (parameters) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: [parameters] } },
    });

    return data;
};

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const CHART_HEIGHT_RATIO = 0.7;

const drawerWidth = 700;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('lg')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('lg')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
        },
    },
    chartActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: '#888',
        padding: '0 30px',
    },
    chartContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    chartView: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    rangeSlider: {
        flex: '0 0 50px',
        padding: '60px 0px 30px 0px',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        paddingTop: 100,
        zIndex: 'initial',
        width: drawerWidth,
        [theme.breakpoints.up('lg')]: {
            paddingTop: 0,
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1),
        },
    },
    progress: {
        fill: 'white',
        marginLeft: theme.spacing(2),
    },
    loadingContainer: {
        minWidth: 64,
    },
}));

const defaultParameters = {
    ...defaultParametersValues,
    start_time: 0,
    name: 'Période initiale',
    enabled: true,
};

const Simulation = () => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [values, setValues] = useState();
    const { width: windowWidth } = useWindowSize();
    const [yType, setYType] = useState('linear');
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const classes = useStyles();

    const [parameters, setParameters] = useState(defaultParameters);

    const { zoom, value: zoomInnerValue, handleChange: handleZoomChange } = useZoom({
        min: 300,
        max: parameters.population,
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSubmit = (values) => {
        setParameters(values);
    };

    const refreshLines = () => {
        window.dispatchEvent(new CustomEvent('graph:refresh:start'));

        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('graph:refresh:stop'));
        }, 16);
    };

    const handleYTypeToggle = () => setYType((type) => (type === 'linear' ? 'log' : 'linear'));

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getModelDebounced(formatParametersForModel(parameters));
            setValues(data);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(parameters)]);

    const chartSize = windowWidth
        ? windowWidth < 1280 // lg
            ? windowWidth - 90
            : Math.max(windowWidth - drawerWidth - 60 - 100, 500)
        : 850;

    const customConfig = {
        axis: {
            y: { type: yType, max: zoom },
        },
        subchart: {
            show: true,
        },
    };

    const container = window !== undefined ? () => window.document.body : undefined;

    const drawer = (
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

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                        Projet MODSIR19
                    </Typography>
                    <ExportButton parameters={parameters} />
                    <ImportButton setParameters={setParameters} />
                    {typeof loading !== 'undefined' && (
                        <div className={classes.loadingContainer}>
                            {loading && (
                                <CircularProgress className={classes.progress} color="inherit" />
                            )}
                        </div>
                    )}
                </Toolbar>
            </AppBar>

            <main className={classes.content} style={{}}>
                <div className={classes.toolbar} />
                {values && (
                    <div className={classes.chartContainer}>
                        <div className={classes.chartView}>
                            <div className={classes.rangeSlider}>
                                <ZoomSlider onChange={handleZoomChange} value={zoomInnerValue} />
                            </div>
                            <div>
                                <Chart
                                    values={values}
                                    startDate={parameters.start_date}
                                    size={{
                                        height: chartSize * CHART_HEIGHT_RATIO,
                                        width: chartSize,
                                    }}
                                    ref={chartRef}
                                    customConfig={customConfig}
                                />
                            </div>
                        </div>
                        <div className={classes.chartActions}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        color: yType === 'log' ? '#888' : 'black',
                                    }}
                                >
                                    Échelle linéaire
                                </div>
                                <div>
                                    <Switch
                                        checked={yType === 'log'}
                                        onChange={handleYTypeToggle}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: yType === 'linear' ? '#888' : 'black',
                                    }}
                                >
                                    Échelle logarithmique
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <nav className={classes.drawer} style={{ position: 'relative' }}>
                <Hidden smUp implementation="css">
                    <Drawer
                        PaperProps={{ onScroll: refreshLines }}
                        container={container}
                        variant="temporary"
                        anchor={'right'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{ paper: classes.drawerPaper }}
                    >
                        {drawer}
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
                            {drawer}
                        </Drawer>
                    </div>
                </Hidden>
            </nav>
        </div>
    );
};

export default Simulation;
