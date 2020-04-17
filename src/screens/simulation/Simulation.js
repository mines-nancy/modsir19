import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

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

const Simulation = () => {
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
            {values ? <Chart values={values} startDate={startDate} /> : <CircularProgress />}
        </Layout>
    );
};

export default Simulation;
