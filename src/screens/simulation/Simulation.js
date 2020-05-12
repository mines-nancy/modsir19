import React, { useState, useEffect, useRef } from 'react';

import AwesomeDebouncePromise from 'awesome-debounce-promise';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles, Toolbar, AppBar, Typography, CircularProgress } from '@material-ui/core';

import './Simulation.css';
import { formatParametersForModel, defaultParameters as defaultParametersValues } from './common';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { ImportButton, ExportButton } from './ExportImport';
import { ZoomSlider, useZoom } from './ZoomSlider';
import ConfigurationDrawer from './configuration/ConfigurationDrawer';

const getModel = async (parameters) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: [parameters] } },
    });

    // example:
    // const res = await api.get('/get_sir_h_rules', {
    //     params: {
    //         parameters: { ...timeframes[0] },
    //         rules: { list: [{ date: 12, type: 'change_field', field: 'beta', value: 0.5 }] },
    //     },
    // });

    return data;
};

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const CHART_HEIGHT_RATIO = 0.7;

const drawerWidth = 700;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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

const eventstoTimeframes = (events) =>
    Object.values(events).map((event) => ({
        date: event.date,
        label: event.name,
    }));

const Simulation = () => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [values, setValues] = useState();
    const { width: windowWidth } = useWindowSize();
    const [mobileOpen, setMobileOpen] = useState(false);
    const classes = useStyles();
    const drawerRef = useRef();

    const [parameters, setParameters] = useState(defaultParameters);
    /**
     * Parameters changes normalized by day
     * @example
     * {
     *   '2020-03-16': { name: 'Déconfinement', changes: ['r0'] },
     *   '2020-05-11': { name: 'Déconfinement', changes: ['r0'] },
     * }
     */
    const [events, setEvents] = useState([]);

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

    const refreshLines = (() => {
        let refreshing = false;
        let timeout;

        return () => {
            if (!refreshing) {
                window.dispatchEvent(new CustomEvent('graph:refresh:start'));
                refreshing = true;
            }

            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                refreshing = false;
                window.dispatchEvent(new CustomEvent('graph:refresh:stop'));
            }, 200);
        };
    })();

    useEffect(() => {
        let drawer = drawerRef && drawerRef.current;

        if (drawer) {
            drawer.children[0].addEventListener('scroll', refreshLines);
        }

        return () => {
            if (drawer) {
                drawer.children[0].removeEventListener('scroll', refreshLines);
            }
        };
    }, [drawerRef, refreshLines]);

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
            y: { max: zoom },
        },
        subchart: {
            show: true,
        },
    };

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
                                    timeframes={eventstoTimeframes(events)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <ConfigurationDrawer
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                parameters={parameters}
                handleSubmit={handleSubmit}
                expanded={expanded}
                setExpanded={setExpanded}
                events={events}
                setEvents={setEvents}
                ref={drawerRef}
            />
        </div>
    );
};

export default Simulation;
