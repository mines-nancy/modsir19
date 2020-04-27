import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { makeStyles, Card } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import * as d3Transform from 'd3-transform';
import { parseSvg } from 'd3-interpolate/src/transform/parse';

import { formatParametersForModel, defaultTimeframes, extractGraphTimeframes } from './common';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import { format } from 'date-fns';
console.log({ d3 });

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
            graphTimeframes.map(
                (timeframe) =>
                    console.log(timeframe.date) || {
                        value: format(timeframe.date, 'yyyy-MM-dd'),
                        text: timeframe.label,
                    },
            ),
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
        onrendered: () => {
            var drag = d3
                .drag()
                .on('start', function (d) {
                    d.startX = chartRef.current.internal.x(new Date(d.value));
                })
                .subject(function () {
                    const t = d3.select(this);
                    const { translateX, translateY } = parseSvg(t.attr('transform'));
                    return { x: translateX, y: translateY };
                })

                .on('drag', function () {
                    d3.select(this).attr('transform', 'translate(' + d3.event.x + ' 0)');
                })
                .on('end', function (d) {
                    const endPosition = d.startX + d3.event.x;
                    console.log('a', chartRef.current.internal.x.invert(endPosition));
                    setTimeframes((timeframes) =>
                        timeframes.map((t) => {
                            if (t.name === d.text) {
                                t.start_date = chartRef.current.internal.x.invert(endPosition);
                            }

                            return t;
                        }),
                    );
                });

            d3.selectAll('.c3-xgrid-line').call(drag);

            // d3.selectAll('.c3-xgrid-line')
            //     .enter()
            //     .append('span')
            //     .attr('data-id', function (id) {
            //         return id;
            //     })
            //     .html(function (id) {
            //         return id;
            //     })
            //     .each(function (id) {
            //         d3.select(this).style('background-color', 'red');
            //     });
        },
        axis: {
            // x: {
            //     show: false,
            // },
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
