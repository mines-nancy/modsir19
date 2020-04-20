import React, { useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-polyglot';
import { makeStyles } from '@material-ui/core/styles';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import c3 from 'c3';
import 'c3/c3.css';

import { useWindowSize } from '../../utils/useWindowSize';
import { Button } from '@material-ui/core';

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
        position: 'fixed',
        left: 24,
    },
    yAxisToggleButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

const data = ({ t, values, startDate }) => {
    const { SE, INCUB, R, I, SM, SI, SS, DC } = values;

    return {
        labels: generateDateInterval(startDate, SE.length),
        datasets: [
            {
                label: capitalize(t('chart.exposed')),
                data: SE,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
            {
                label: capitalize(t('chart.incub')),
                data: INCUB,
                backgroundColor: 'rgba(164, 18, 179, 0.6)',
            },
            {
                label: capitalize(t('chart.recovered')),
                data: R,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
            },
            {
                label: capitalize(t('chart.intensive_care')),
                data: SI,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: capitalize(t('chart.normal_care')),
                data: SM,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
            },
            {
                label: capitalize(t('chart.following_hospitalized')),
                data: SS,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
            },
            {
                label: capitalize(t('chart.dead')),
                data: DC,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
            },
            {
                label: capitalize(t('chart.infected')),
                data: I,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
            },
        ],
    };
};

const useDataCallback = (data, callback) => {
    useEffect(() => {
        callback && callback(data);
    }, [JSON.stringify(data)]);
};

const C3Graph = ({ config }) => {
    const elRef = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        if (elRef.current && !chart.current) {
            chart.current = c3.generate({ bindto: elRef.current, ...config });
        }

        return () => {
            try {
                chart.current && chart.current.destroy();
            } catch (e) {
                console.log('c3js error', e);
            }
        };
    }, []);

    // Handle chart resize
    useDataCallback(config.size, chart.current && chart.current.resize);

    // Handle grid vertical lines change
    useDataCallback(config.grid.x.lines, chart.current && chart.current.xgrids);

    // Handle data changes
    useDataCallback(config.data, chart.current && chart.current.load);

    // Handle Y axis type change
    useDataCallback(config.axis.y.type, chart.current && ((y) => chart.current.axis.types({ y })));

    return <div ref={elRef} />;
};

const CHART_HEIGHT_RATIO = 0.7;

const Chart = ({ values, startDate, timeframes = [] }) => {
    const classes = useStyles();
    const t = useTranslate();
    const { width: windowWidth } = useWindowSize();
    const [yType, setYType] = useState('linear');

    const handleYTypeToggle = () => setYType((type) => (type === 'linear' ? 'log' : 'linear'));

    const chartSize = windowWidth ? Math.max(windowWidth / 2 - 100, 350) : 850;

    const lineData = data({ t, values, startDate });

    const labels = lineData.labels.slice(0, 251).map((date) => {
        const [d, m, y] = date.split('/');
        return `${y}-${m}-${d}`;
    });

    const config = {
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
                // Sort legend by smaller values first
                return (
                    Math.max(
                        0,
                        d1.values.map((i) => i.value),
                    ) -
                    Math.max(
                        0,
                        d2.values.map((i) => i.value),
                    )
                );
            },
        },
        axis: {
            y: {
                type: yType,
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
            },
        },
        grid: {
            x: {
                lines: timeframes.map((timeframe) => ({
                    value: format(timeframe.date, 'yyyy-MM-dd'),
                    text: timeframe.label,
                })),
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
        size: { height: chartSize * CHART_HEIGHT_RATIO, width: chartSize },
        tooltip: {
            format: {
                title: (date) => format(date, 'dd/MM/yyyy'),
                value: (value) => Math.round((value + Number.EPSILON) * 100) / 100,
            },
        },
    };

    return (
        <div className={classes.root}>
            <div className={classes.container} style={config.size}>
                <C3Graph config={config} />
                <Button
                    variant="contained"
                    className={classes.yAxisToggleButton}
                    onClick={handleYTypeToggle}
                >
                    Affichage {yType === 'linear' ? 'Linéaire' : 'Logarithmique'}
                </Button>
            </div>
        </div>
    );
};

export default Chart;
