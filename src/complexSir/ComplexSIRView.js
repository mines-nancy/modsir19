import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SIRForm } from './ComplexSIRForm';
import { Chart } from './ComplexChartView';
import api from '../utils/api';
import ComplexSIRSliders from './ComplexSIRSliders'

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

export const ComplexSIRView = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState();
    // eslint-disable-next-line no-console
    console.log({ values });

    const handleClick = async (parameters) => {
        const response = await api.get('/get_complex_sir', {
            params: { parameters },
        });
        setValues(response.data);
    };

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
                                <ComplexSIRSliders onChange={handleClick} />
                            </Grid>
                            {values && (
                                <Grid item xs={8}>
                                    {' '}
                                    {Chart(values)}{' '}
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
};
