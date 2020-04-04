import React from 'react';
import { SIRForm } from './SIRForm';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Chart } from './ChartView';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);
export const SIRView = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState();
    // eslint-disable-next-line no-console
    console.log({ values });
    return (
        <div className={classes.root}>
            <Grid container justify="center" alignItems="center" spacing={3}>
                <Grid item xs={4}>
                    <SIRForm onChange={(values) => setValues(values)} />
                </Grid>
                <Grid item xs={8}>
                    {values && Chart(values)}
                </Grid>
            </Grid>
        </div>
    );
};
