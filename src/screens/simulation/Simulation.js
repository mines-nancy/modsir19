import React, { useState, useEffect, useRef } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { difference, pick } from 'lodash';
import { makeStyles, Toolbar, AppBar, Typography, CircularProgress } from '@material-ui/core';
import { differenceInDays, endOfDay, startOfDay, format } from 'date-fns';

import './Simulation.css';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { ImportButton, ExportButton } from './ExportImport';
import { ZoomSlider, useZoom } from './ZoomSlider';
import ConfigurationDrawer from './configuration/ConfigurationDrawer';

import {
    formatParametersForModel,
    formatRuleForModel,
    defaultParameters as defaultParametersValues,
} from './common';

const getModel = async ({ rules, ...parameters }) => {
    const { data } = await api.get('/get_sir_h_rules', {
        params: {
            parameters,
            rules: { list: rules || [] },
        },
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

const extractRulesFromValues = (values, parameters) =>
    Object.keys(values).reduce((rules, key) => {
        if (key.startsWith('rule_')) {
            const [, date, ...field] = key.split('_');
            const fieldName = field.join('_');
            const dayDiff = differenceInDays(
                endOfDay(new Date(date)),
                startOfDay(parameters.start_date),
            );

            const rulesToAdd = formatRuleForModel(
                {
                    date: dayDiff,
                    type: 'change_field',
                    field: fieldName,
                    value: values[key],
                },
                parameters,
            );

            return rules.concat(rulesToAdd);
        }

        return rules;
    }, []);

const buildHashKeyDict = (obj) =>
    Object.keys(obj).reduce(
        (agg, key) => ({ ...agg, [`${key}_${JSON.stringify(obj[key])}`]: key }),
        {},
    );

const extractV1Data = ([parameters, ...data]) => {
    const parametersHashKeyDict = buildHashKeyDict(parameters);
    const newParameters = { ...parameters };

    const events = data.reduce((agg, timeframe) => {
        const timeframeHashKeyDict = buildHashKeyDict(timeframe);

        const diffKeys = Object.values(
            pick(
                timeframeHashKeyDict,
                difference(Object.keys(timeframeHashKeyDict), Object.keys(parametersHashKeyDict)),
            ),
        );

        const { start_date, name, ...changes } = pick(timeframe, diffKeys);
        const simpleDate = format(start_date, 'yyyy-MM-dd');

        // Populate event data which is in parameters in the same time
        Object.keys(changes).forEach((key) => {
            newParameters[`rule_${simpleDate}_${key}`] = changes[key];
        });

        return {
            ...agg,
            [simpleDate]: {
                name,
                date: start_date,
                changes: Object.keys(changes),
            },
        };
    }, {});

    return { parameters: newParameters, events };
};

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

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleSubmit = (values) => setParameters(values);

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

    const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
    useEffect(() => {
        (async () => {
            setLoading(true);
            const rules = extractRulesFromValues(parameters, parameters);

            const data = await getModelDebounced({
                ...formatParametersForModel(parameters),
                rules,
            });
            const I = zip([data.IR, data.IH]).map(([a, b]) => a + b);
            setValues({ ...data, I });
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(parameters)]);

    const handleImport = ({ version, data }) => {
        const { events, parameters } = version === 1 ? extractV1Data(data) : data;

        setEvents(events);
        setParameters(parameters);
    };

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
                    <ExportButton data={{ parameters, events }} />
                    <ImportButton onImport={handleImport} />
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
