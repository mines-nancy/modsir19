import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Chart } from './ComplexChartView';
import api from '../utils/api';
import ComplexSIRSliders from './ComplexSIRSliders';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingTop: theme.spacing(4),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        card: {
            margin: '3pt',
        },
    }),
);

const getModel = async (parameters) =>
    await api.get('/get_complex_sir', {
        params: { parameters },
    });
const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

export const ComplexSIRView = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState();

    const handleChange = React.useCallback(
        async (parameters) => {
            const response = await getModelDebounced(parameters);
            setValues(response.data);
        },
        [setValues],
    );

    return (
        <div className={classes.root}>
            <Grid container direction="column" justify="center" alignItems="stretch" spacing={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Paramètres du modèle SIR complexe
                        </Typography>
                        <Grid container justify="center" alignItems="center" spacing={3}>
                            <Grid item xs={12}>
                                <ComplexSIRSliders onChange={handleChange} />
                            </Grid>
                            {values && (
                                <Grid item xs={8}>
                                    {Chart(values)}
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
};
