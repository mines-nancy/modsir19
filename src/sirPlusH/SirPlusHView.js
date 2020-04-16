import React from 'react';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Chart } from './SirPlusHChartView';
import api from '../utils/api';
import SirPlusHSliders from './SirPlusHSliders';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const drawerWidth = 270;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
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
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            // backgroundColor: theme.palette.background.default,
            // padding: theme.spacing(1),
        },
        radio: {
            margin: theme.spacing(2),
        },
    }),
);

const getModel = async (parameters) =>
    await api.get('/get_sir_h', {
        params: { parameters },
    });

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

export const SirPlusHView = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState();

    const handleSlidersChange = React.useCallback(async (parameters) => {
        const response = await getModelDebounced(parameters);
        setValues({ ...response.data, j_0: parameters.j_0 });
    }, []);

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid container direction="row" item xs={12} md={6}>
                    <Grid item sm={1}></Grid>
                    <Grid item sm={10}>
                        {values ? <Chart values={values} /> : <p>No input values</p>}
                    </Grid>
                    <Grid item sm={1}></Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <SirPlusHSliders onChange={handleSlidersChange} />
                </Grid>
            </Grid>
        </div>
    );
};
