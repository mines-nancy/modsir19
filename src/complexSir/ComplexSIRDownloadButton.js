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
    ];
    const d = new Date(2020, 11, 12).getDate();
    // eslint-disable-next-line no-console
    console.log(d);
    // eslint-disable-next-line no-console
    // console.log(headers);
    const csvRows = ['model_name;SIR+H', 'model_version;1.0', headers.join(';')];
    const j_0 = new Date(2020, 2, 3);
    const dateRange = generateDates(j_0, values.exposed.length);
    for (let itr = 0; itr < values.exposed.length; itr++) {
        csvRows.push(
            [
                itr,
                dateRange[itr],
                values.exposed[itr],
                values.infected[itr],
                values.hospitalized[itr],
                values.intensive_care[itr],
                values.exit_intensive_care[itr],
                values.recovered[itr],
                values.dead[itr],
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
