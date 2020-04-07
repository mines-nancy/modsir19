import React from 'react';
import { SIRForm } from './SIRForm';
import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Chart } from './ChartView';
import api from '../utils/api';

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

    const handleClick = async (parameters) => {
        const response = await api.get('/get_simple_sir', {
            params: { parameters },
        });
        setValues(response.data);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h5" component="h2">
                Entrer les paramètres du modèle SIR dans les champs suivants puis cliquer sur
                CALCULER.
            </Typography>
            <Grid container justify="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <SIRForm onChange={handleClick} />
                </Grid>
                {values && (
                    <Grid item xs={6}>
                        {' '}
                        {Chart(values)}{' '}
                    </Grid>
                )}
            </Grid>
        </div>
    );
};
