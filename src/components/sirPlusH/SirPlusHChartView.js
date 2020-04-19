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

const data = ({ t, values }) => {
    const { SE, INCUB, R, I, SM, SI, SS, DC, j_0 } = values;

    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
    return {
        labels: generateDates(day0, SE.length),
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

const inputData = ({ t, values }) => {
    const {
        SE,
        input_INCUB,
        input_R,
        input_I,
        input_SM,
        input_SI,
        input_SS,
        input_DC,
        j_0,
    } = values;

    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
    return {
        labels: generateDates(day0, SE.length),
        datasets: [
            {
                label: t('chart.incub'),
                data: input_INCUB,
                backgroundColor: 'rgba(164, 18, 179, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.recovered'),
                data: input_R,
                backgroundColor: 'rgba(88, 235, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.intensive_care'),
                data: input_SI,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.normal_care'),
                data: input_SM,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.following_hospitalized'),
                data: input_SS,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.dead'),
                data: input_DC,
                backgroundColor: 'rgba(88, 88, 88, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: input_I,
                backgroundColor: 'rgba(255, 158, 132, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};

const outputData = ({ t, values }) => {
    const { SE, output_SE, output_INCUB, output_I, output_SM, output_SI, output_SS, j_0 } = values;

    const day0 = j_0 ? j_0 : Date(2020, 0, 23);
    return {
        labels: generateDates(day0, SE.length),
        datasets: [
            {
                label: t('chart.exposed'),
                data: output_SE,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.incub'),
                data: output_INCUB,
                backgroundColor: 'rgba(164, 18, 179, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.intensive_care'),
                data: output_SI,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.normal_care'),
                data: output_SM,
                backgroundColor: 'rgba(255, 88, 132, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.following_hospitalized'),
                data: output_SS,
                backgroundColor: 'rgba(54, 54, 255, 0.6)',
                borderWidth: 2,
            },
            {
                label: t('chart.infected'),
                data: output_I,
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

    const lineData = data({ t, values });
    const lineInputData = inputData({ t, values });
    const lineOutputData = outputData({ t, values });
    const { input_SM, input_SI } = values;

    const cumulated_hospitalized =
        input_SM.reduce((a, b) => a + b, 0) + input_SI.reduce((a, b) => a + b, 0);
    const cumulated_intensive_care = input_SI.reduce((a, b) => a + b, 0);

    return (
        <div className={classes.root}>
            <Line data={lineData} width="300" height="300" options={options} />
            <br />
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
