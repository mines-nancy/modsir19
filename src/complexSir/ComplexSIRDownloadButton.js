import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-polyglot';
import Button from '@material-ui/core/Button';
import { zip, pick } from 'lodash';
import { generateDates } from '../utils/dateGenerator';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const generateCSV = function (values) {
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

    const headers = [
        'jour',
        'date',
        'exposed',
        'infected',
        'hospitalized',
        'intensive_care',
        'exit_intensive_care',
        'recovered',
        'dead',
        'input_recovered',
        'input_exposed',
        'input_infected',
        'input_dead',
        'input_hospitalized',
        'input_intensive_care',
        'input_exit_intensive_care',
    ];
    const csvRows = ['model_name;SIR+H', 'model_version;1.0', headers.join(';')];
    const j_init = new Date(j_0);
    const dateRange = generateDates(j_init, exposed.length);
    for (let itr = 0; itr < exposed.length; itr++) {
        csvRows.push(
            [
                itr,
                dateRange[itr],
                exposed[itr],
                infected[itr],
                hospitalized[itr],
                intensive_care[itr],
                exit_intensive_care[itr],
                recovered[itr],
                dead[itr],
                input_recovered[itr],
                input_exposed[itr],
                input_infected[itr],
                input_dead[itr],
                input_hospitalized[itr],
                input_intensive_care[itr],
                input_exit_intensive_care[itr],
            ]
                .join(';')
                .replace(/\./g, ','),
        );
    }
    return csvRows.join('\n');
};

const downloadData = function (values) {
    const csvData = generateCSV(values);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'courbes.csv');
    document.body.appendChild(a);
    a.click();
    //document.removeChild(a);
};

export const DownloadButton = ({ values }) => {
    const classes = useStyles();
    const t = useTranslate();

    const handleClick = () => {
        downloadData(values);
    };

    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={handleClick}>
                {t('download')};
            </Button>
        </div>
    );
};
