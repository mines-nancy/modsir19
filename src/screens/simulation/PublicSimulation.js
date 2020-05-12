import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import {
    makeStyles,
    Card,
    Typography,
    useMediaQuery,
    useTheme,
    CardContent,
    CardHeader,
    Button,
    Tooltip,
    CircularProgress,
} from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { debounce } from 'lodash';
import { format, differenceInDays } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { InfoOutlined, ArrowBackIos } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';

import config from '../../parameters.json';
import { formatTimeframesForModel, defaultParameters, extractGraphTimeframes } from './common';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import ProportionField from '../../components/fields/ProportionField';
import SwitchField from '../../components/fields/SwitchField';

import AutoSave from '../../components/fields/AutoSave';
import colors from './colors';
import { ZoomSlider, useZoom } from './ZoomSlider';
import { Footer } from '../../components/Footer';
import InstructionsButton from './InstructionsButton';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const useStyles = makeStyles((theme) => ({
    loader: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#eee',
    },
    chartViewContainer: {
        // Safari understands flex-basis: 0 as height: auto
        // Since the chart is absolute, its parent have 0 height
        // Removing flex-basis fix the issue
        flex: isSafari ? '1 0' : '1 0 0',
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
    legendContainer: { flex: '1 0 0', position: 'relative' },
    legend: {
        position: 'absolute',
        zIndex: 999,
        [theme.breakpoints.down('sm')]: {
            top: 10,
            width: '100%',
            textAlign: 'center',
            '& > *': {
                marginRight: theme.spacing(1),
            },
        },
        [theme.breakpoints.up('sm')]: {
            top: 20,
            right: 20,
            left: -50, // Zoom handler width
            height: 350,
            pointerEvents: 'none',
        },
    },
    legendActions: {
        pointerEvents: 'all',
        position: 'absolute',
        top: 0,
        left: 0,
        '& > *': {
            marginRight: theme.spacing(1),
        },
    },
    legendTitle: {
        position: 'absolute',
        top: 0,
        width: '100%',
        textAlign: 'center',
    },
    legendBlockContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        width: 350,
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
    },
    blockRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 48,
    },
    block: {
        pointerEvents: 'all',
        cursor: 'pointer',
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
        padding: '16px 30px 8px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            padding: 0,
        },
    },
    formControl: {
        flex: '2 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        '& > *': {
            minWidth: 200,
            marginBottom: 12,
        },
        '&:nth-child(3)': {
            flex: '3 0 auto',
            alignItems: 'flex-end',
        },
    },
    formCard: {
        minWidth: 310,
        position: 'relative',
        marginBottom: 0,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
    },
    formCardHeader: {
        paddingBottom: 0,
    },
    formCardContent: {
        paddingTop: 0,
    },
    formSlider: {
        marginTop: theme.spacing(2),
    },
    toggle: {
        position: 'absolute',
        top: 12,
        right: 8,
    },
    legendPercent: {
        fontSize: '0.9rem',
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

const formatNumber = (value) => {
    const intl = new Intl.NumberFormat();
    return value ? intl.format(value) : value;
};

const Block = ({ children, label, value, ...props }) => {
    const classes = useStyles(props);

    return (
        <Card className={classes.block} elevation={3} {...props}>
            <div>
                <div className={classes.blockLabel}>{label}</div>
                <div className={classes.blockValue}>{value}</div>
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

const BackButton = ({ onClick }) => (
    <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<ArrowBackIos />}
        onClick={onClick}
    >
        Retour
    </Button>
);

const Legend = ({
    date: { date, index },
    values,
    onLegendEnter = () => {},
    onLegendLeave = () => {},
    onLegendClick,
    mobile,
    total,
}) => {
    const classes = useStyles();
    const history = useHistory();

    const addMouseProps = (key, ids) => ({
        onMouseEnter: () => onLegendEnter(ids),
        onMouseLeave: () => onLegendLeave(),
        onClick: () => onLegendClick(key),
    });

    const handleGoBack = () => history.push('/');

    if (!values) {
        return null;
    }

    if (mobile) {
        return (
            <div className={classes.legend}>
                <BackButton onClick={handleGoBack} />
                <InstructionsButton />
            </div>
        );
    }

    const i = index || values.R.length - 1;

    const R = Math.round(values.R[i], 0);
    const H = Math.round(values.SM[i] + values.SI[i] + values.SS[i]);
    const DC = Math.round(values.DC[i]);
    const SE = Math.round(values.SE[i]);
    const M = Math.round(values.I[i] + values.INCUB[i]);

    const DCPercent = Math.round((DC / total) * 100);
    const RPercent = Math.round((R / total) * 100);

    return (
        <GraphProvider>
            <div className={classes.legendActions}>
                <BackButton onClick={handleGoBack} />
                <InstructionsButton />
            </div>
            <div className={classes.legendTitle}>
                {!date ? (
                    <>
                        <strong>Population impactée</strong>
                        <br />
                        <Typography color="textSecondary" gutterBottom>
                            Déplacez la souris sur le graph pour suivre l'évolution
                        </Typography>
                    </>
                ) : (
                    <>
                        <strong>
                            {date
                                ? `Population au ${format(date, 'dd/MM/yyyy')}`
                                : 'Population impactée '}
                            <br />
                        </strong>
                        <Typography color="textSecondary" gutterBottom>
                            sur un échantillon de {Intl.NumberFormat().format(total)} individus
                        </Typography>
                    </>
                )}
            </div>
            <div className={classes.legendBlockContainer}>
                <Typography gutterBottom>
                    Cliquez sur un boutton pour la mise à l'échelle
                </Typography>
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
                            {...addMouseProps('SE', ['Exposés'])}
                            label="Sains"
                            value={Number.isInteger(SE) ? formatNumber(SE) : ''}
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
                            {...addMouseProps('I', ['Incubation', 'Infectés'])}
                            label="Malades"
                            value={Number.isInteger(M) ? formatNumber(M) : M}
                            color={colors.infected.bg}
                        />
                    </Node>
                    <Node name="gueri" targets={[]}>
                        <Block
                            {...addMouseProps('R', ['Guéris'])}
                            label="Guéris"
                            value={
                                <div>
                                    <div>{`${Number.isInteger(R) ? formatNumber(R) : R}`}</div>
                                    <div className={classes.legendPercent}>{`${
                                        RPercent < 1 ? '< 1%' : `${RPercent}%`
                                    }`}</div>
                                </div>
                            }
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
                            {...addMouseProps('SI', [
                                'Soins de suite',
                                'Soins intensifs',
                                'Soins medicaux',
                            ])}
                            label="Hospitalisés"
                            value={Number.isInteger(H) ? formatNumber(H) : H}
                            color={colors.intensive_care.bg}
                        />
                    </Node>
                    <Node name="decede" targets={[]}>
                        <Block
                            {...addMouseProps('DC', ['Décédés'])}
                            label="Décédés"
                            value={
                                <div>
                                    <div>{`${Number.isInteger(DC) ? formatNumber(DC) : DC}`}</div>
                                    <div className={classes.legendPercent}>{`${
                                        DCPercent < 1 ? '< 1%' : `${DCPercent}%`
                                    }`}</div>
                                </div>
                            }
                            color={colors.death.bg}
                        />
                    </Node>
                </div>
            </div>
            <Edges />
        </GraphProvider>
    );
};

const initialValues = Object.keys(config).reduce((acc, key) => {
    if (key.endsWith('_date')) {
        acc[key] = new Date(config[key]);
    } else {
        acc[key] = config[key];
    }

    return acc;
}, {});

const getTimeframesFromValues = ({
    initial_start_date,
    initial_r0,
    lockdown_start_date,
    lockdown_r0,
    lockdown_enabled,
    deconfinement_r0,
    deconfinement_enabled,
    deconfinement_start_date,
}) => [
    {
        ...defaultParameters,
        population: initialValues.population,
        patient0: initialValues.patient0,
        r0: initial_r0,
        start_date: initial_start_date,
        name: '', // Before lockdown
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: true,
    },
    {
        ...defaultParameters,
        population: initialValues.population,
        patient0: initialValues.patient0,
        r0: lockdown_r0,
        start_date: lockdown_start_date,
        name: 'Confinement',
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: lockdown_enabled,
    },
    {
        ...defaultParameters,
        population: initialValues.population,
        patient0: initialValues.patient0,
        r0: deconfinement_r0,
        start_date: deconfinement_start_date,
        name: 'Déconfinement',
        lim_time: 365 + differenceInDays(new Date(), initial_start_date),
        enabled: deconfinement_enabled,
    },
];

const decorator = createDecorator({
    field: 'lockdown_enabled',
    updates: {
        deconfinement_enabled: (lockdown_enabled, { deconfinement_enabled }) =>
            lockdown_enabled && deconfinement_enabled,
    },
});

const HelpIcon = ({ title, description, children }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>{title}</div>
        {description && (
            <div>
                <Tooltip title={description}>
                    <InfoOutlined
                        style={{
                            marginBottom: -5,
                            paddingLeft: 10,
                        }}
                        fontSize="small"
                    />
                </Tooltip>
            </div>
        )}
        {children}
    </div>
);

const removeNegativeValues = (data) =>
    Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].map((value) => Math.max(0, value));
        return acc;
    }, {});

const PublicSimulation = () => {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false); // @FIXME Use the loading
    const [values, setValues] = useState();
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [currentDate, setCurrentDate] = useState({});
    const chartRef = useRef(null);
    const [showAlert, setShowAlert] = React.useState(true);

    useEffect(() => {
        if (!showAlert) {
            window.dispatchEvent(new CustomEvent('graph:refresh:stop'));
        }
    }, [showAlert]);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down('md'));

    const [graphTimeframes, setGraphTimeframes] = useState(
        extractGraphTimeframes(getTimeframesFromValues(initialValues)),
    );

    const [timeframes, setTimeframes] = useState(getTimeframesFromValues(initialValues));
    const { zoom, setZoom, value: zoomInnerValue, handleChange: handleZoomChange } = useZoom({
        min: 300,
        max: timeframes[0].population,
    });

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
                    formatTimeframesForModel(parameters, timeframes[0].start_date),
                ),
            );
            setValues(removeNegativeValues(data));
            setGraphTimeframes(extractGraphTimeframes(timeframes));
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(timeframes)]);

    const handleCaptureTooltipData = useCallback(
        debounce((data) => {
            const date = data.length > 0 ? { index: data[0].index, date: data[0].x } : {};
            setCurrentDate(date);
            return null;
        }, 10),
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
        return (
            <div className={classes.loader}>
                <CircularProgress />
            </div>
        );
    }

    const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
    const mergedValues = {
        SE: values.SE,
        DC: values.DC,
        R: values.R,
        I: zip([values.I, values.INCUB]).map(([a, b]) => a + b),
        SI: zip([values.SM, values.SI, values.SS]).map(([a, b, c]) => a + b + c),
    };

    const handleLegendClick = (key) => {
        const max = Math.max(...mergedValues[key]);

        if (zoom === max) {
            setZoom(timeframes[0].population);
        } else {
            setZoom(max);
        }
    };

    const handleSubmit = (values) => {
        setTimeframes(getTimeframesFromValues(values));
    };

    const chartConfig = {
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
                max: zoom,
            },
        },
    };

    const visibleValues = Object.keys(mergedValues).reduce((acc, key) => {
        if (Math.max(...mergedValues[key]) <= 10.0 * zoom) {
            acc[key] = mergedValues[key];
        } else {
            acc[key] = Array.from({ length: mergedValues[key].length }, (v, i) => 0);
        }
        return acc;
    }, {});

    return (
        <>
            <div className={classes.root}>
                {showAlert && (
                    <Alert
                        severity="warning"
                        onClose={() => {
                            setShowAlert(false);
                            window.dispatchEvent(new CustomEvent('graph:refresh:start'));
                        }}
                    >
                        <strong>
                            Pour usage pédagogique uniquement. Non destiné à servir de prévision ou
                            d’aide à la décision.
                        </strong>
                    </Alert>
                )}
                <div className={classes.chartViewContainer}>
                    <div className={classes.rangeSlider}>
                        <ZoomSlider onChange={handleZoomChange} value={zoomInnerValue} />
                    </div>
                    <div className={classes.legendContainer}>
                        <div className={classes.legend}>
                            <Legend
                                date={currentDate}
                                values={values}
                                onLegendEnter={handleLegendEnter}
                                onLegendLeave={handleLegendLeave}
                                onLegendClick={handleLegendClick}
                                total={timeframes[0].population}
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
                                                  windowHeight -
                                                  (showAlert ? 48 : 0) /* alert header */ -
                                                  140 /* form */ -
                                                  36 /* footer */ -
                                                  54 /* legend */,
                                              width: windowWidth - 100,
                                          }
                                }
                                customConfig={chartConfig}
                                ref={chartRef}
                                style={{ padding: 0 }}
                            />
                        </div>
                    </div>
                </div>
                <Form
                    subscription={{}}
                    onSubmit={() => {
                        /* Useless since we use a listener on autosave */
                    }}
                    initialValues={initialValues}
                    decorators={[decorator]}
                    render={({ form }) => {
                        const { values } = form.getState();

                        return (
                            <div className={classes.form}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <div className={classes.formControl}>
                                    <Card className={classes.formCard} elevation={2}>
                                        <CardHeader
                                            className={classes.formCardHeader}
                                            title="Avant confinement"
                                        />
                                        <CardContent className={classes.formCardContent}>
                                            <Typography color="textSecondary" gutterBottom>
                                                A partir du{' '}
                                                {format(values.initial_start_date, 'dd/MM/yyyy')}
                                            </Typography>
                                            <div className={classes.formSlider}>
                                                <Field
                                                    name="initial_r0"
                                                    label={
                                                        <HelpIcon
                                                            title="R0"
                                                            description={config.initial_tooltip}
                                                        />
                                                    }
                                                    component={ProportionField}
                                                    unit=""
                                                    max="5"
                                                    step={0.1}
                                                    disabled
                                                    forceDisabledColor
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className={classes.formControl}>
                                    <Card className={classes.formCard} elevation={2}>
                                        <CardHeader
                                            className={classes.formCardHeader}
                                            title={
                                                <Typography variant="h5" component="h2">
                                                    Confinement
                                                </Typography>
                                            }
                                            action={
                                                <Field
                                                    className={classes.toggle}
                                                    name="lockdown_enabled"
                                                    component={SwitchField}
                                                    type="checkbox"
                                                    onLabel="Avec"
                                                    offLabel="Sans"
                                                    tooltip="Active ou désactive le confinement"
                                                />
                                            }
                                        />
                                        <CardContent className={classes.formCardContent}>
                                            <Typography color="textSecondary" gutterBottom>
                                                A partir du{' '}
                                                {format(values.lockdown_start_date, 'dd/MM/yyyy')}
                                            </Typography>
                                            <div className={classes.formSlider}>
                                                <Field
                                                    name="lockdown_r0"
                                                    label={
                                                        <HelpIcon
                                                            title="R0"
                                                            description={config.lockdown_tooltip}
                                                        />
                                                    }
                                                    component={ProportionField}
                                                    unit=""
                                                    max="5"
                                                    step={0.1}
                                                    disabled
                                                    forceDisabledColor={values.lockdown_enabled}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className={classes.formControl}>
                                    <Card className={classes.formCard} elevation={2}>
                                        <CardHeader
                                            className={classes.formCardHeader}
                                            title="Déconfinement"
                                            action={
                                                <Field
                                                    className={classes.toggle}
                                                    name="deconfinement_enabled"
                                                    component={SwitchField}
                                                    type="checkbox"
                                                    onLabel="Avec"
                                                    offLabel="Sans"
                                                    tooltip="Active ou désactive le déconfinement"
                                                />
                                            }
                                        />
                                        <CardContent className={classes.formCardContent}>
                                            <Typography color="textSecondary" gutterBottom>
                                                A partir du{' '}
                                                {format(
                                                    values.deconfinement_start_date,
                                                    'dd/MM/yyyy',
                                                )}
                                            </Typography>
                                            <div className={classes.formSlider}>
                                                <Field
                                                    name="deconfinement_r0"
                                                    label={
                                                        <HelpIcon
                                                            title="R0"
                                                            description={
                                                                config.deconfinement_tooltip
                                                            }
                                                        >
                                                            <Typography
                                                                style={{
                                                                    paddingLeft: 20,
                                                                }}
                                                                color="textSecondary"
                                                                gutterBottom
                                                            >
                                                                Faites varier le R0 pour en voir
                                                                l'impact
                                                            </Typography>
                                                        </HelpIcon>
                                                    }
                                                    component={ProportionField}
                                                    unit=""
                                                    max="5"
                                                    step={0.1}
                                                    disabled={!values.deconfinement_enabled}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
            <Footer />
        </>
    );
};

export default PublicSimulation;
