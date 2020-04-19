import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { useMediaQuery } from '@material-ui/core';

const generateDateInterval = (startDate, numberOfDays) =>
    eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, numberOfDays),
    }).map((date) => format(date, 'dd/MM/yyyy'));

const useStyles = makeStyles({
    root: {
        padding: 32,
    },
    container: {
        position: 'fixed',
    },
});

const data = ({ t, values, startDate }) => {
    const { SE, INCUB, R, I, SM, SI, SS, DC } = values;

    return {
        labels: generateDateInterval(startDate, SE.length),
        datasets: [
            {
                label: t('chart.exposed'),
                data: SE,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.incub'),
                data: INCUB,
                backgroundColor: 'rgba(164, 18, 179, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.recovered'),
                data: R,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.intensive_care'),
                data: SI,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.normal_care'),
                data: SM,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.following_hospitalized'),
                data: SS,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.dead'),
                data: DC,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: I,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};

const getOptions = (t) => ({
    title: {
        display: false,
        text: t('chart.title'),
        fontSize: 25,
    },
    tooltips: {
        callbacks: {
            label: (tooltipItem, data) => {
                const value = Math.round(tooltipItem.yLabel * 100) / 100;
                const label = data.datasets[tooltipItem.datasetIndex].label;

                if (label) {
                    return `${label}: ${value}`;
                }

                return value.toString();
            },
        },
    },
    scales: {
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: t('chart.y_scale_label'),
                    fontSize: 18,
                },
            },
        ],
        xAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: t('chart.x_scale_label'),
                    fontSize: 18,
                },
            },
        ],
    },
});

const Chart = ({ values, startDate }) => {
    const classes = useStyles();
    const t = useTranslate();
    const theme = useTheme();
    const medium = useMediaQuery(theme.breakpoints.up('md'));
    const large = useMediaQuery(theme.breakpoints.up('lg'));
    const chartSize = medium ? (large ? 700 : 500) : 300;

    const lineData = data({ t, values, startDate });

    return (
        <div className={classes.root}>
            <div className={classes.container} style={{ width: chartSize, height: chartSize }}>
                <Line
                    data={lineData}
                    width={chartSize}
                    height={chartSize}
                    options={getOptions(t)}
                />
            </div>
        </div>
    );
};

export default Chart;
