import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { makeStyles, Card, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { debounce } from 'lodash';
import { format, differenceInDays } from 'date-fns';

import { formatParametersForModel, defaultParameters, extractGraphTimeframes } from './common';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import DateField from '../../components/fields/DateField';
import ProportionField from '../../components/fields/ProportionField';
import AutoSave from '../../components/fields/AutoSave';
import colors from './colors';
import { ZoomSlider } from './ZoomSlider';
import { Footer } from '../../components/Footer';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    chartViewContainer: {
        flex: 1,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
        },
    },
    rangeSlider: {
        flex: '0 0 50px',
        padding: '80px 0 0 25px',
        [theme.breakpoints.down('sm')]: {
            padding: '0 12px',
        },
    },
    formContainer: {
        flex: '0 0 200px',
    },
    legend: {
        [theme.breakpoints.up('sm')]: {
            position: 'absolute',
            right: 20,
            top: 20,
            width: 550,
            height: 350,
            zIndex: 999,
            pointerEvents: 'none',
        },
    },
    blockContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: '33%',
        pointerEvents: 'none',
    },
    blockRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        '&:first-child': {
            marginBottom: 48,
        },
    },
    block: {
        padding: 8,
        width: 64,
        height: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: (props) => props.color || 'white',
    },
    blockLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    blockValue: {
        marginTop: 8,
    },
    yAxisToggleButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#888',
    },
    form: {
        marginTop: 16,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    formControl: {
        flex: '1 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        '& > *': {
            alignItems: 'center',
            minWidth: 200,
            marginBottom: 12,
        },
    },
}));

const getModel = async (timeframes) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: {
            parameters: { list: timeframes.filter((timeframe) => timeframe.enabled) },
        },
    });

    return data;
};

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const EmptyBlock = () => <div style={{ padding: 8, width: 64, height: 64 }} />;

const Block = ({ children, label, value, ...props }) => {
    const classes = useStyles(props);
    const intl = new Intl.NumberFormat();

    return (
        <Card className={classes.block} elevation={3} {...props}>
            <div>
                <div className={classes.blockLabel}>{label}</div>
                <div className={classes.blockValue}>{value ? intl.format(value) : value}</div>
            </div>
        </Card>
    );
};

const sirEdgesColorCode = '#00688B';
const straightLine = (name, options = {}) => ({
    name,
    options: {
        color: sirEdgesColorCode,
        path: 'straight',
        ...options,
    },
});

const Legend = ({ stats, onLegendEnter = () => {}, onLegendLeave = () => {}, mobile }) => {
    const classes = useStyles();

    const addMouseProps = (ids) => ({
        onMouseEnter: () => onLegendEnter(ids),
        onMouseLeave: () => onLegendLeave(),
    });

    if (mobile) {
        return null;
    }

    return (
        <GraphProvider>
            <div className={classes.blockContainer}>
                <div className={classes.blockRow}>
                    <Node
                        name="sain"
                        targets={[
                            straightLine('malade', {
                                anchorStart: { x: '100%', y: '50%' },
                                anchorEnd: { x: '0%', y: '50%' },
                            }),
                        ]}
                    >
                        <Block
                            {...addMouseProps(['Exposés'])}
                            label="Sains"
                            value={stats['Exposés'] || ''}
                            color={colors.exposed.bg}
                        />
                    </Node>
                    <Node
                        name="malade"
                        targets={[
                            straightLine('gueri', {
                                anchorStart: { x: '100%', y: '50%' },
                                anchorEnd: { x: '0%', y: '50%' },
                            }),
                            straightLine('hospitalisation', {
                                anchorStart: { x: '50%', y: '100%' },
                                anchorEnd: { x: '50%', y: '0%' },
                            }),
                        ]}
                    >
                        <Block
                            {...addMouseProps(['Incubation', 'Infectés'])}
                            label="Malades"
                            value={(stats['Incubation'] || 0) + (stats['Infectés'] || 0) || ''}
                            color={colors.infected.bg}
                        />
                    </Node>
                    <Node name="gueri" targets={[]}>
                        <Block
                            {...addMouseProps(['Guéris'])}
                            label="Guéris"
                            value={stats['Guéris'] || ''}
                            color={colors.recovered.bg}
                        />
                    </Node>
                </div>
                <div className={classes.blockRow}>
                    <EmptyBlock />
                    <Node
                        name="hospitalisation"
                        targets={[
                            straightLine('decede', {
                                anchorStart: { x: '100%', y: '50%' },
                                anchorEnd: { x: '0%', y: '50%' },
                            }),
                            straightLine('gueri', {
                                anchorStart: { x: '100%', y: '0%' },
                                anchorEnd: { x: '0%', y: '100%' },
                            }),
                        ]}
                    >
                        <Block
                            {...addMouseProps([
                                'Soins de suite',
                                'Soins intensifs',
                                'Soins medicaux',
                            ])}
                            label="Hospitalisés"
                            value={
                                (stats['Soins de suite'] || 0) +
                                    (stats['Soins intensifs'] || 0) +
                                    (stats['Soins medicaux'] || 0) || ''
                            }
                            color={colors.intensive_care.bg}
                        />
                    </Node>
                    <Node name="decede" targets={[]}>
                        <Block
                            {...addMouseProps(['Décédés'])}
                            label="Décédés"
                            value={stats['Décédés'] || ''}
                            color={colors.death.bg}
                        />
                    </Node>
                </div>
            </div>
            <Edges />
        </GraphProvider>
    );
};

const roundValue = (value) => Math.round(value);
const extractTooltipData = (points) =>
    points.reduce(
        (agg, d) => ({
            ...agg,
            [d.id]: roundValue(d.value),
            date: d.x,
        }),
        {},
    );

const initialValues = {
    initial_start_date: new Date('2020-01-09'),
    initial_r0: 3.4,
    lockdown_start_date: new Date('2020-03-17'),
    lockdown_r0: 0.5,
    deconfinement_start_date: new Date('2020-05-11'),
    deconfinement_r0: 1.1,
};

const getTimeframesFromValues = ({
    initial_start_date,
    initial_r0,
    lockdown_start_date,
    lockdown_r0,
    deconfinement_start_date,
    deconfinement_r0,
}) => [
    {
        ...defaultParameters,
        r0: initial_r0,
        start_time: initial_start_date,
        name: 'Période initiale',
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: true,
    },
    {
        ...defaultParameters,
        r0: lockdown_r0,
        start_date: lockdown_start_date,
        name: 'Confinement',
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: true,
    },
    {
        ...defaultParameters,
        r0: deconfinement_r0,
        start_date: deconfinement_start_date,
        name: 'Déconfinement',
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: true,
    },
];

const PublicSimulation = () => {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false); // @FIXME Use the loading
    const [values, setValues] = useState();
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [currentStats, setCurrentStats] = useState({});
    const chartRef = useRef(null);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down('sm'));

    const [graphTimeframes, setGraphTimeframes] = useState(
        extractGraphTimeframes(getTimeframesFromValues(initialValues)),
    );

    const [timeframes, setTimeframes] = useState(getTimeframesFromValues(initialValues));
    const [zoomMax, setZoomMax] = useState(timeframes[0].population);

    const lines = graphTimeframes.map((timeframe) => ({
        value: format(timeframe.date, 'yyyy-MM-dd'),
        text: timeframe.label,
        class: 'draggable-line',
    }));

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getModelDebounced(
                timeframes.map((parameters) =>
                    formatParametersForModel(parameters, timeframes[0].start_date),
                ),
            );
            setValues(data);
            setGraphTimeframes(extractGraphTimeframes(timeframes));
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(timeframes)]);

    const handleCaptureTooltipData = useCallback(
        debounce((data) => {
            setCurrentStats(extractTooltipData(data));
            return null;
        }, 30),
        [],
    );

    const handleLegendEnter = useCallback(
        (ids) => {
            chartRef.current && chartRef.current.focus(ids);
        },
        [chartRef],
    );

    const handleLegendLeave = useCallback(() => {
        chartRef.current && chartRef.current.focus();
    }, [chartRef]);

    if (!values) {
        return null;
    }

    const handleSubmit = (values) => {
        setTimeframes(getTimeframesFromValues(values));
    };

    const config = {
        zoom: { enabled: true, rescale: true },
        legend: {
            show: false,
        },
        tooltip: {
            // This is the only way to get data from current position
            contents: handleCaptureTooltipData,
        },
        grid: {
            x: { lines },
        },
        axis: {
            y: {
                show: true,
                max: zoomMax,
            },
        },
    };

    const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
    const mergedValues = {
        SE: values.SE,
        DC: values.DC,
        R: values.R,
        I: zip([values.I, values.INCUB]).map(([a, b]) => a + b),
        SI: zip([values.SM, values.SI, values.SS]).map(([a, b, c]) => a + b + c),
    };
    const visibleValues = Object.keys(mergedValues).reduce((acc, key) => {
        if (Math.max(...mergedValues[key]) <= 10.0 * zoomMax) {
            acc[key] = mergedValues[key];
        } else {
            acc[key] = Array.from({ length: mergedValues[key].length }, (v, i) => 0);
        }
        return acc;
    }, {});

    return (
        <>
            <div className={classes.root}>
                <div className={classes.chartViewContainer}>
                    <div className={classes.rangeSlider}>
                        <ZoomSlider
                            onChange={setZoomMax}
                            min={300}
                            max={timeframes[0].population}
                            initValue={timeframes[0].population}
                        />
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <div className={classes.legend}>
                            <Legend
                                stats={currentStats}
                                onLegendEnter={handleLegendEnter}
                                onLegendLeave={handleLegendLeave}
                                mobile={small}
                            />
                        </div>
                        <div>
                            <Chart
                                values={visibleValues}
                                startDate={timeframes[0].start_date}
                                timeframes={graphTimeframes}
                                size={
                                    small
                                        ? {
                                              width: windowWidth,
                                              height: windowWidth * 0.7, // mobile scale
                                          }
                                        : {
                                              height:
                                                  windowHeight - 200 /* form */ - 32 /* footer */,
                                              width: windowWidth - 100,
                                          }
                                }
                                customConfig={config}
                                ref={chartRef}
                                style={{ padding: 0 }}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.formContainer}>
                    <Form
                        subscription={{}}
                        onSubmit={() => {
                            /* Useless since we use a listener on autosave */
                        }}
                        initialValues={initialValues}
                        render={() => (
                            <div className={classes.form}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <div className={classes.formControl}>
                                    <Typography variant="h6">Période initiale</Typography>
                                    <Field
                                        className="small-margin-bottom"
                                        name="initial_start_date"
                                        label="Début"
                                        component={DateField}
                                    />
                                    <Field
                                        name="initial_r0"
                                        label="R0"
                                        component={ProportionField}
                                        unit=""
                                        max="5"
                                        step={0.1}
                                    />
                                </div>
                                <div className={classes.formControl}>
                                    <Typography variant="h6">Confinement</Typography>
                                    <Field
                                        className="small-margin-bottom"
                                        name="lockdown_start_date"
                                        label="Début"
                                        component={DateField}
                                    />
                                    <Field
                                        name="lockdown_r0"
                                        label="R0"
                                        component={ProportionField}
                                        unit=""
                                        max="5"
                                        step={0.1}
                                    />
                                </div>
                                <div className={classes.formControl}>
                                    <Typography variant="h6">Déconfinement</Typography>
                                    <Field
                                        className="small-margin-bottom"
                                        name="deconfinement_start_date"
                                        label="Début"
                                        component={DateField}
                                    />
                                    <Field
                                        name="deconfinement_r0"
                                        label="R0"
                                        component={ProportionField}
                                        unit=""
                                        max="5"
                                        step={0.1}
                                    />
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PublicSimulation;
