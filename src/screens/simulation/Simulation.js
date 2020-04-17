import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';

import api from '../../api';
import Chart from './Chart';
import Layout from '../../components/Layout';

const round = (x) => Math.round(x * 100) / 100;

const startDate = new Date(2020, 0, 23);

const parameters = {
    population: 500000,
    patient0: 1,
    kpe: 0.6,
    r: 2.3,
    dm_incub: 3,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 8,
    dm_ss: 14,
    beta: 0.15,
    pc_ir: 0.84,
    pc_ih: round(1 - 0.84),
    pc_sm: 0.8,
    pc_si: round(1 - 0.8),
    pc_sm_si: 0.2,
    pc_sm_out: round(1 - 0.2),
    pc_si_dc: 0.5,
    pc_si_out: 0.5,
    pc_h_ss: 0.2,
    pc_h_r: round(1 - 0.2),
    lim_time: 250,
    j_0: startDate,
    rules: [],
};

const useStyles = makeStyles(() => ({
    configuration: {
        marginTop: 30,
        position: 'relative',
        width: 500,
        height: 800,
    },
}));

const Simulation = () => {
    const classes = useStyles();
    const [values, setValues] = useState();

    useEffect(() => {
        (async () => {
            const { data } = await api.get('/get_sir_h', {
                params: { parameters },
            });

            setValues(data);
        })();
    }, []);

    return (
        <Layout>
            <Grid container>
                <Grid item xs={7}>
                    {values ? (
                        <Chart values={values} startDate={startDate} />
                    ) : (
                        <CircularProgress />
                    )}
                </Grid>
                <Grid item xs={5}>
                    <div className={classes.configuration}>
                        <GraphProvider>
                            <Node name="ref1" targets={['ref2']} top={0} left="50%">
                                FOOBAR
                            </Node>
                            <Node name="ref2" targets={['ref3']} top={150} left="50%">
                                FOOBAZ
                            </Node>
                            <Node name="ref3" targets={['ref4', 'ref5']} top={300} left="50%">
                                FOOBAZ
                            </Node>
                            <Node name="ref4" top={500} left="25%">
                                FOOBAZ
                            </Node>
                            <Node name="ref5" top={500} left="75%">
                                FOOBAZ
                            </Node>
                            <Edges />
                        </GraphProvider>
                    </div>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Simulation;
