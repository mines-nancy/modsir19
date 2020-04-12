import React from 'react';
import {
    Grid,
    Drawer,
    Toolbar,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Divider,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Chart } from './ComplexChartView';
import api from '../utils/api';
import ComplexSIRSliders from './ComplexSIRSliders';
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
    await api.get('/get_complex_sir', {
        params: { parameters },
    });

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

export const ComplexSIRView = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState();
    const [model, setModel] = React.useState('queue');

    const handleSlidersChange = React.useCallback(
        async (parameters) => {
            const response = await getModelDebounced(parameters);

            setValues(response.data);
        },
        [model],
    );

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Grid container direction="column" alignItems="stretch">
                    {values && (
                        <Grid item>
                            <Chart values={values} />
                        </Grid>
                    )}
                </Grid>
            </div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <FormControl className={classes.radio} component="fieldset">
                        <FormLabel component="legend">Modèle</FormLabel>
                        <RadioGroup
                            aria-label="model"
                            name="model"
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                        >
                            <FormControlLabel
                                value="past_input"
                                control={<Radio color="primary" />}
                                label="Delta t"
                            />
                            <FormControlLabel
                                value="queue"
                                control={<Radio color="primary" />}
                                label="File d'attente"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                    <ComplexSIRSliders onChange={handleSlidersChange} />
                </div>
            </Drawer>
        </div>
    );
};
