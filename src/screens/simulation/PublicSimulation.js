import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles, Card, Grid, Switch } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { debounce } from 'lodash';
import { formatParametersForModel, defaultTimeframes, extractGraphTimeframes } from './common';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0,
    },
    legend: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 550,
        height: 350,
        zIndex: 999,
    },
    mobileLegend: {},
    card: {
        padding: 20,
        width: 80,
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: (props) => props.color || 'white',
    },
    yAxisToggleButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#888',
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

const Block = ({ children, ...props }) => {
    const classes = useStyles(props);

    return (
        <Card className={classes.card} elevation={3} {...props}>
            {children}
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
    const addMouseProps = (ids) => ({
        onMouseEnter: () => onLegendEnter(ids),
        onMouseLeave: () => onLegendLeave(),
    });

    if (mobile) {
        return (
            <div>
                {Object.keys(stats).map((name) => (
                    <div>
                        {name}: {stats[name]}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <GraphProvider>
            <div>
                <Grid container justify="center">
                    <Grid item xs={4}>
                        <Node
                            name="sain"
                            targets={[
                                straightLine('malade', {
                                    anchorStart: { x: 120, y: '50%' },
                                    anchorEnd: { x: '0%', y: '50%' },
                                }),
                            ]}
                        >
                            <Block {...addMouseProps(['Exposés'])}>
                                <div>
                                    <div>Sain</div>
                                    <div>{stats['Exposés'] || ''}</div>
                                </div>
                            </Block>
                        </Node>
                    </Grid>
                    <Grid item xs={4}>
                        <Node
                            name="malade"
                            targets={[
                                straightLine('gueri', {
                                    anchorStart: { x: 120, y: '50%' },
                                    anchorEnd: { x: '0%', y: '50%' },
                                }),
                                straightLine('hospitalisation', {
                                    anchorStart: { x: '33%', y: '100%' },
                                    anchorEnd: { x: '33%', y: '0%' },
                                }),
                            ]}
                        >
                            <Block {...addMouseProps(['Incubation', 'Infectés'])}>
                                <div>
                                    <div>Malade</div>
                                    <div>
                                        {(stats['Incubation'] || 0) + (stats['Infectés'] || 0) ||
                                            ''}
                                    </div>
                                </div>
                            </Block>
                        </Node>
                    </Grid>
                    <Grid item xs={4}>
                        <Node name="gueri" targets={[]}>
                            <Block {...addMouseProps(['Guéris'])}>
                                <div>
                                    <div>Guéri</div>
                                    <div>{stats['Guéris'] || ''}</div>
                                </div>
                            </Block>
                        </Node>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{ paddingTop: 40 }}>
                        <Node
                            name="hospitalisation"
                            targets={[
                                straightLine('decede', {
                                    anchorStart: { x: 120, y: '50%' },
                                    anchorEnd: { x: '0%', y: '50%' },
                                }),
                                straightLine('gueri', {
                                    anchorStart: { x: '66%', y: '0%' },
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
                            >
                                <div>
                                    <div>Hospitalisé</div>
                                    <div>
                                        {(stats['Soins de suite'] || 0) +
                                            (stats['Soins intensifs'] || 0) +
                                            (stats['Soins medicaux'] || 0) || ''}
                                    </div>
                                </div>
                            </Block>
                        </Node>
                    </Grid>
                    <Grid item xs={4} style={{ paddingTop: 40 }}>
                        <Node name="decede" targets={[]}>
                            <Block {...addMouseProps(['Décédés'])}>
                                <div>
                                    <div>Décédé</div>
                                    <div>{stats['Décédés'] || ''}</div>
                                </div>
                            </Block>
                        </Node>
                    </Grid>
                </Grid>
            </div>
            <Edges />
        </GraphProvider>
    );
};

const roundValue = (value) => Math.round(value);
const extractTooltipData = (data) =>
    data.reduce(
        (agg, value) => ({
            ...agg,
            [value.id]: roundValue(value.value),
        }),
        {},
    );

const PublicSimulation = () => {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false); // @FIXME Use the loading
    const [values, setValues] = useState();
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [currentStats, setCurrentStats] = useState({});
    const [yType, setYType] = useState('linear');
    const chartRef = useRef(null);

    const [graphTimeframes, setGraphTimeframes] = useState(
        extractGraphTimeframes(defaultTimeframes),
    );

    const [timeframes] = useState(defaultTimeframes);

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

    const handleYTypeToggle = () => setYType((type) => (type === 'linear' ? 'log' : 'linear'));

    const handleCaptureTooltipData = useCallback(
        debounce((data) => {
            setCurrentStats(extractTooltipData(data));
            return null;
        }, 50),
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

    const config = {
        zoom: { enabled: false },
        legend: {
            show: false,
        },
        tooltip: {
            // This is the only way to get data from current position
            contents: handleCaptureTooltipData,
        },
        axis: {
            x: {
                show: false,
            },
            y: {
                show: false,
                type: yType,
            },
        },
    };

    const isMobile = windowWidth < 800;

    return (
        <div className={classes.root}>
            <div className={isMobile ? classes.mobileLegend : classes.legend}>
                <Legend
                    stats={currentStats}
                    onLegendEnter={handleLegendEnter}
                    onLegendLeave={handleLegendLeave}
                    mobile={isMobile}
                />
            </div>
            <div>
                <Chart
                    values={values}
                    startDate={timeframes[0].start_date}
                    timeframes={graphTimeframes}
                    size={{ height: windowHeight, width: windowWidth }}
                    customConfig={config}
                    ref={chartRef}
                    style={{ padding: 0 }}
                >
                    {!isMobile && (
                        <div className={classes.yAxisToggleButton}>
                            <div style={{ color: yType === 'log' ? '#888' : 'black' }}>
                                Échelle linéaire
                            </div>
                            <div>
                                <Switch checked={yType === 'log'} onChange={handleYTypeToggle} />
                            </div>
                            <div style={{ color: yType === 'linear' ? '#888' : 'black' }}>
                                Échelle logarithmique
                            </div>
                        </div>
                    )}
                </Chart>
            </div>
        </div>
    );
};

export default PublicSimulation;
