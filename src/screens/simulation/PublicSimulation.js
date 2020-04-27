import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { makeStyles, Card } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { format, startOfDay, addDays } from 'date-fns';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { parseSvg } from 'd3-interpolate/src/transform/parse';

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
        'pointer-events': 'none',
    },
    mobileLegend: {},
    blockContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: '33%',
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
                        />
                    </Node>
                    <Node name="gueri" targets={[]}>
                        <Block
                            {...addMouseProps(['Guéris'])}
                            label="Guéris"
                            value={stats['Guéris'] || ''}
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
                        />
                    </Node>
                    <Node name="decede" targets={[]}>
                        <Block
                            {...addMouseProps(['Décédés'])}
                            label="Décédés"
                            value={stats['Décédés'] || ''}
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

const PublicSimulation = () => {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false); // @FIXME Use the loading
    const [values, setValues] = useState();
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [currentStats, setCurrentStats] = useState({});
    const chartRef = useRef(null);

    const [graphTimeframes, setGraphTimeframes] = useState(
        extractGraphTimeframes(defaultTimeframes),
    );

    const [timeframes, setTimeframes] = useState(defaultTimeframes);

    const lines = useMemo(
        () =>
            graphTimeframes.map((timeframe) => ({
                value: format(timeframe.date, 'yyyy-MM-dd'),
                text: timeframe.label,
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            /* Leave this empty to keep same lines, d3 will change lines */
        ],
    );

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

    useEffect(() => {
        const chart = chartRef.current;
        console.log('reset');

        if (!chart) {
            return;
        }

        const getTimeframeFromDatum = ({ text }) =>
            timeframes.find((timeframe) => timeframe.name === text);

        const getOffsetBoundaries = (timeframe) => {
            const index = timeframes.indexOf(timeframe);
            const x = chart.internal.x(timeframe.start_date);

            const previous = timeframes[index - 1];
            const next = timeframes[index + 1];

            const min = chart.internal.x(addDays(previous.start_date, 1)) - x;
            const max = next ? chart.internal.x(addDays(next.start_date, -1)) - x : Infinity;

            return { min, max };
        };

        const drag = d3
            .drag()
            .subject(function () {
                const t = d3.select(this);
                const { translateX, translateY } = parseSvg(t.attr('transform'));
                return { x: translateX, y: translateY };
            })
            .on('drag', function (d) {
                const timeframe = getTimeframeFromDatum(d);
                const { min, max } = getOffsetBoundaries(timeframe);

                console.group('timeframe');
                console.log('CURRENT', d3.event.x);
                console.log('MIN', min);
                console.log('MAX', max);
                console.groupEnd();

                d3.select(this).attr(
                    'transform',
                    `translate(${Math.max(min, Math.min(max, d3.event.x))} 0)`,
                );
            })
            .on('end', function (d) {
                const timeframe = getTimeframeFromDatum(d);
                const { min, max } = getOffsetBoundaries(timeframe);

                const endPosition =
                    chart.internal.x(timeframe.start_date) +
                    Math.max(min, Math.min(max, d3.event.x));

                setTimeframes((timeframes) =>
                    timeframes.map((timeframe) => {
                        if (timeframe.name === d.text) {
                            return {
                                ...timeframe,
                                start_date: startOfDay(chart.internal.x.invert(endPosition)),
                            };
                        }

                        return timeframe;
                    }),
                );
            });

        d3.selectAll('.draggable-line').call(drag);

        return () => {
            d3.selectAll('.draggable-line').on('drag', null).on('end', null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartRef.current, JSON.stringify(timeframes)]);

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

    const config = {
        zoom: { enabled: false },
        legend: {
            show: false,
        },
        tooltip: {
            // This is the only way to get data from current position
            contents: handleCaptureTooltipData,
        },
        grid: {
            x: {
                lines,
            },
        },
        axis: {
            y: {
                show: false,
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
                />
            </div>
        </div>
    );
};

export default PublicSimulation;
