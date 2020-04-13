import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import { generateDates } from '../utils/dateGenerator';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 640,
        },
    }),
);

const options = {
    title: {
        display: false,
        text: 'Modèle SIR Complexe',
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

const data = ({ t, values }) => {
    const {
        recovered,
        exposed,
        infected,
        dead,
        hospitalized,
        intensive_care,
        exit_intensive_care,
        j_0,
    } = values;

    // eslint-disable-next-line no-console
    console.log(values);

    const day0 = new Date(j_0);

    return {
        labels: generateDates(day0, exposed.length),
        datasets: [
            {
                label: [t('chart.intensive_care')],
                data: intensive_care,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exit_intensive_care'),
                data: exit_intensive_care,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.hospitalized'),
                data: hospitalized,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.dead'),
                data: dead,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: infected,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.recovered'),
                data: recovered,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exposed'),
                data: exposed,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};

export const Chart = ({ values }) => {
    const classes = useStyles();
    const t = useTranslate();


    const lineData = data({ t, values });

    return (
        <div className={classes.root}>
            <Line data={lineData} width="300" height="300" options={options} />
        </div>
    );
};
