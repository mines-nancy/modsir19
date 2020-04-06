import React from 'react';
import { SIRForm } from './SIRForm';
import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Chart } from './ChartView';
import api from '../utils/api';
import Sliders from './SIRSliders';

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
            <Grid container direction="column" justify="center" alignItems="stretch" spacing={3}>
                <Grid item  xs={12}>
                <Sliders />
                </Grid>
                <Grid item xs={12}>
                    <SIRForm onChange={handleClick} />
                </Grid>
                {values && <Grid item> {Chart(values)} </Grid>}
            </Grid>
        </div>
    );
};
