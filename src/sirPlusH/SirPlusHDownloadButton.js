import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-polyglot';
import Button from '@material-ui/core/Button';
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
        SE,
        INCUB,
        R,
        I,
        SM,
        SI,
        SS,
        DC,
        input_SE,
        input_INCUB,
        input_R,
        input_I,
        input_SM,
        input_SI,
        input_SS,
        input_DC,
        j_0,
    } = values;

    const headers = [
        'jour',
        'date',
        'SE',
        'INCUB',
        'R',
        'I',
        'SM',
        'SI',
        'SS',
        'DC',
        'input_SE',
        'input_INCUB',
        'input_R',
        'input_I',
        'input_SM',
        'input_SI',
        'input_SS',
        'input_DC',
    ];
    const csvRows = ['model_name;SIR+H', 'model_version;1.0', headers.join(';')];
    const j_init = new Date(j_0);
    const dateRange = generateDates(j_init, SE.length);
    for (let itr = 0; itr < SE.length; itr++) {
        csvRows.push(
            [
                itr,
                dateRange[itr],
                SE[itr],
                INCUB[itr],
                R[itr],
                I[itr],
                SM[itr],
                SI[itr],
                SS[itr],
                DC[itr],
                input_SE[itr],
                input_INCUB[itr],
                input_R[itr],
                input_I[itr],
                input_SM[itr],
                input_SI[itr],
                input_SS[itr],
                input_DC[itr],
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
