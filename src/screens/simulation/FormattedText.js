import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formatted: {
        '& p:first-child': {
            marginTop: 0,
        },
        '& img': {
            maxWidth: '100%',
        },
        '& ul': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            [theme.breakpoints.down('sm')]: {
                paddingLeft: theme.spacing(2),
            },
        },
        '& li': {
            marginBottom: theme.spacing(1),
        },
        '& h6:not(:first-child)': {
            paddingTop: theme.spacing(2),
        },
    },
}));

const FormattedText = ({ children }) => {
    const classes = useStyles();

    return <div className={classes.formatted}>{children}</div>;
};

export default FormattedText;
