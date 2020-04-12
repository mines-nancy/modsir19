import React from 'react';
import { Grid, Drawer, Toolbar } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Chart } from './ComplexChartView';
import api from '../utils/api';
import ComplexSIRSliders from './ComplexSIRSliders';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(4),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        grid: {
            alignItems: 'center',
        },
        card: {
            margin: '3pt',
        },

        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
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
    console.log(values)

    const handleChange = React.useCallback(
        async (parameters) => {
            const response = await getModelDebounced(parameters);
            setValues(response.data);
        },
        [setValues],
    );

    return (
        <div className={classes.root}>
                <Grid container direction="row">
                    <Grid container direction="row" item xs={12} md={7}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={10}>
                            {values ? <Chart values={values} /> : <p>No input values</p>}
                        </Grid>
                        <Grid item sm={1}>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <ComplexSIRSliders onChange={handleChange} />
                    </Grid>
                </Grid>

        </div>
    );
};
