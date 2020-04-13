import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import { generateDates } from '../utils/dateGenerator';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const day0 = new Date(2020, 0, 23);

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 700,
        },
    }),
);

const data = ({ t, day0, values }) => {
    const { SE, R, I, SM, SI, SS, DC } = values;

    return {
        labels: generateDates(day0, SE.length),
        datasets: [
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

const options = {
    title: {
        display: false,
        text: 'Modèle SIR+H',
        fontSize: 25,
    },
    tooltips: {
        callbacks: {
            label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                label += Math.round(tooltipItem.yLabel * 100) / 100;
                return label;
            },
        },
    },
    scales: {
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Volume de population',
                    fontSize: 18,
                },
            },
        ],
        xAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Temps',
                    fontSize: 18,
                },
            },
        ],
    },
};

export const Chart = ({ values }) => {
    const classes = useStyles();
    const t = useTranslate();

    const lineData = data({ t, day0, values });

    return (
        <div className={classes.root}>
            <Line data={lineData} width="300" height="300" options={options} />
        </div>
    );
};
