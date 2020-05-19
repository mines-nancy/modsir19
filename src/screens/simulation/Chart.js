import React, { useEffect, useRef } from 'react';
import { useTranslate } from 'react-polyglot';
import { makeStyles } from '@material-ui/core/styles';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { merge } from 'lodash';
import c3 from 'c3';
import 'c3/c3.css';

import colors from './colors';
import './Chart.css';
import parameters from '../../parameters.json';

const generateDateInterval = (startDate, numberOfDays) =>
    eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, numberOfDays),
    }).map((date) => format(date, 'dd/MM/yyyy'));

const useStyles = makeStyles({
    root: {
        padding: 16,
    },
    container: {
        margin: '0 auto',
    },
});

const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

const data = ({ t, values, startDate }) => {
    const { SE, INCUB, R, I, SM, SI, SS, DC } = values;
    const datasets = [
        SE && {
            label: capitalize(t('chart.exposed')),
            data: SE,
            backgroundColor: colors.exposed.main,
        },
        INCUB && {
            label: capitalize(t('chart.incub')),
            data: INCUB,
            backgroundColor: colors.incubation.main,
        },
        R && {
            label: capitalize(t('chart.recovered')),
            data: R,
            backgroundColor: colors.recovered.main,
        },
        SI && {
            label: capitalize(t('chart.intensive_care')),
            data: SI,
            backgroundColor: colors.intensive_care.main,
        },
        SM && {
            label: capitalize(t('chart.normal_care')),
            data: SM,
            backgroundColor: colors.normal_care.main,
        },
        SS && {
            label: capitalize(t('chart.following_hospitalized')),
            data: SS,
            backgroundColor: colors.following_care.main,
        },
        DC && {
            label: capitalize(t('chart.dead')),
            data: DC,
            backgroundColor: colors.death.main,
        },
        I && {
            label: capitalize(t('chart.infected')),
            data: I,
            backgroundColor: colors.infected.main,
        },
    ];
    const filteredDatasets = datasets.filter((value) => !!value);
    const nbValues = filteredDatasets.length > 0 ? filteredDatasets[0].data.length - 1 : 0;
    return {
        labels: generateDateInterval(startDate, nbValues),
        datasets: filteredDatasets,
    };
};

const useDataCallback = (data, callback) => {
    useEffect(() => {
        callback && callback(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(data)]);
};

const C3Graph = React.forwardRef(({ config }, chartRef) => {
    const elRef = useRef(null);

    useEffect(() => {
        if (elRef.current && !chartRef.current) {
            chartRef.current = c3.generate({ bindto: elRef.current, ...config });
        }

        return () => {
            try {
                chartRef.current && chartRef.current.destroy();
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error while destroying the chart', e);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle chart resize
    useDataCallback(config.size, chartRef.current && chartRef.current.resize);

    // Handle grid vertical lines change
    useDataCallback(config.grid.x.lines, chartRef.current && chartRef.current.xgrids);

    // Handle data changes
    useDataCallback(config.data, chartRef.current && chartRef.current.load);

    // Handle Y axis type change
    useDataCallback(
        config.axis.y.type,
        chartRef.current && ((y) => chartRef.current.axis.types({ y })),
    );

    // Handle Y axis max zoom change
    useDataCallback(
        config.axis.y.max,
        chartRef.current && ((y) => chartRef.current.axis.range({ max: { y } })),
    );

    return <div ref={elRef} />;
});

const Chart = React.forwardRef(
    (
        { values, startDate, timeframes = [], size, customConfig = {}, children, ...rest },
        chartRef,
    ) => {
        const classes = useStyles();
        const t = useTranslate();

        const lineData = data({ t, values, startDate });
        const labels = lineData.labels.slice(0, lineData.labels.length).map((date) => {
            const [d, m, y] = date.split('/');
            return `${y}-${m}-${d}`;
        });

        const onMouseOver = () => {
            const eventGroup = document.querySelector('.c3-event-rects');

            if (eventGroup) {
                // C3.js adds a 'ew-resize' cursor on the mouse hover, if we enable the zoom
                // We want the zoom but we find the cursor confusing,
                // and C3 do not provide a way to remove it, so here we go
                // @see https://github.com/c3js/c3/blob/59ca1630ee922004d0056d2f2b8086e771b1756b/c3.js#L8786
                eventGroup.style.cursor = 'inherit';
            }
        };

        const config = merge(
            {
                padding: {
                    top: 80,
                },
                point: {
                    show: false,
                },
                data: {
                    x: 'x',
                    columns: [
                        ['x', ...labels],
                        ...lineData.datasets.map((dataSet) => [dataSet.label, ...dataSet.data]),
                    ],
                    types: lineData.datasets.reduce(
                        (agg, dataSet) => ({
                            ...agg,
                            [dataSet.label]: 'area',
                        }),
                        {},
                    ),
                    colors: lineData.datasets.reduce(
                        (agg, dataSet) => ({
                            ...agg,
                            [dataSet.label]: dataSet.backgroundColor,
                        }),
                        {},
                    ),
                    order: (d1, d2) => {
                        // Sort legend by bigger values first
                        return (
                            Math.max(
                                0,
                                d2.values.map((i) => i.value),
                            ) -
                            Math.max(
                                0,
                                d1.values.map((i) => i.value),
                            )
                        );
                    },
                },
                axis: {
                    y: {
                        type: 'linear',
                        tick: {
                            format: (value) => Math.round(value),
                        },
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            count: 8,
                            format: '%d/%m/%Y',
                        },
                        padding: { left: -10 },
                    },
                },
                grid: {
                    x: {
                        lines: timeframes.map((timeframe) => ({
                            value: format(timeframe.date, 'yyyy-MM-dd'),
                            text: timeframe.label,
                            class: 'draggable-line',
                        })),
                    },
                    y: {
                        lines: [
                            {
                                value: parameters.intensive_care_capacity,
                                text: 'Capacité maximale en réanimation',
                                position: 'start',
                                class: 'color-grid',
                            },
                        ],
                    },
                },
                legend: {
                    inset: {
                        anchor: 'top-right',
                        x: 20,
                        y: 10,
                        step: 2,
                    },
                },
                zoom: {
                    enabled: true,
                },
                size,
                tooltip: {
                    format: {
                        title: (date) => format(date, 'dd/MM/yyyy'),
                        value: (value) => Math.round((value + Number.EPSILON) * 100) / 100,
                    },
                },
                onmouseover: onMouseOver,
            },
            customConfig,
        );

        return (
            <div className={classes.root} {...rest}>
                <div className={classes.container} style={config.size}>
                    <C3Graph config={config} ref={chartRef} />
                    {children}
                </div>
            </div>
        );
    },
);

export default Chart;
