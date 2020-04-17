import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import { generateDates } from '../../utils/dateGenerator';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 700,
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
        input_recovered,
        input_exposed,
        input_infected,
        input_dead,
        input_hospitalized,
        input_intensive_care,
        input_exit_intensive_care,
        output_recovered,
        output_exposed,
        output_infected,
        output_dead,
        output_hospitalized,
        output_intensive_care,
        output_exit_intensive_care,
        j_0,
    } = values;


    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
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

const inputData = ({ t, values }) => {
    const {
        recovered,
        exposed,
        infected,
        dead,
        hospitalized,
        intensive_care,
        exit_intensive_care,
        input_recovered,
        input_exposed,
        input_infected,
        input_dead,
        input_hospitalized,
        input_intensive_care,
        input_exit_intensive_care,
        output_recovered,
        output_exposed,
        output_infected,
        output_dead,
        output_hospitalized,
        output_intensive_care,
        output_exit_intensive_care,
        j_0,
    } = values;


    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
    return {
        labels: generateDates(day0, exposed.length),
        datasets: [
            {
                label: [t('chart.intensive_care')],
                data: input_intensive_care,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exit_intensive_care'),
                data: input_exit_intensive_care,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.hospitalized'),
                data: input_hospitalized,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.dead'),
                data: input_dead,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: input_infected,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.recovered'),
                data: input_recovered,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exposed'),
                data: input_exposed,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};

const outputData = ({ t, values }) => {
    const {
        recovered,
        exposed,
        infected,
        dead,
        hospitalized,
        intensive_care,
        exit_intensive_care,
        input_recovered,
        input_exposed,
        input_infected,
        input_dead,
        input_hospitalized,
        input_intensive_care,
        input_exit_intensive_care,
        output_recovered,
        output_exposed,
        output_infected,
        output_dead,
        output_hospitalized,
        output_intensive_care,
        output_exit_intensive_care,
        j_0,
    } = values;


    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
    return {
        labels: generateDates(day0, exposed.length),
        datasets: [
            {
                label: [t('chart.intensive_care')],
                data: output_intensive_care,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exit_intensive_care'),
                data: output_exit_intensive_care,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.hospitalized'),
                data: output_hospitalized,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.dead'),
                data: output_dead,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: output_infected,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.recovered'),
                data: output_recovered,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.exposed'),
                data: output_exposed,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};

export const Chart = ({ values }) => {
    const classes = useStyles();
    const t = useTranslate();

    const {
        recovered,
        exposed,
        infected,
        dead,
        hospitalized,
        intensive_care,
        exit_intensive_care,
        input_recovered,
        input_exposed,
        input_infected,
        input_dead,
        input_hospitalized,
        input_intensive_care,
        input_exit_intensive_care,
        output_recovered,
        output_exposed,
        output_infected,
        output_dead,
        output_hospitalized,
        output_intensive_care,
        output_exit_intensive_care,
        j_0,
    } = values;

    const lineData = data({ t, values });
    const lineInputData = inputData({ t, values });
    const lineOutputData = outputData({ t, values });

    const cumulated_hospitalized =
        input_hospitalized.reduce((a, b) => a + b, 0) ;
    const cumulated_intensive_care = input_intensive_care.reduce((a, b) => a + b, 0);

    return (
        <div className={classes.root}>
            <Line data={lineData} width="300" height="300" options={options} />
            Hospitalisés cumulés : {cumulated_hospitalized} <br />
            Soins intensifs cumulés : {cumulated_intensive_care} <br />
            <br />
            Flux entrants
            <Line data={lineInputData} width="300" height="300" options={options} />
            <br />
            Flux sortants
            <Line data={lineOutputData} width="300" height="300" options={options} />
        </div>
    );
};
