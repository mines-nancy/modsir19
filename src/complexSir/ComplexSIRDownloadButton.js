import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-polyglot';
import Button from '@material-ui/core/Button';
import { zip } from 'lodash';

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
        j_0,
    } = values;

    const headers = [
        'exposed',
        'infected',
        'hospitalized',
        'intensive_care',
        'exit_intensive_care',
        'recovered',
        'dead',
    ];

    const series = [
        exposed,
        infected,
        hospitalized,
        intensive_care,
        exit_intensive_care,
        recovered,
        dead,
    ];
    const rows = zip(...series);
    const csvRows = [headers.join(','), ...rows.map((r) => r.join(','))];
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
