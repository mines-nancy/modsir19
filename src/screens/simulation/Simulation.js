import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';

import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';

import api from '../../api';
import Chart from './Chart';
import Layout from '../../components/Layout';
import NumberField from '../../components/fields/NumberField';
import DurationField from '../../components/fields/DurationField';
import ExpandableNumberField from '../../components/fields/ExpandableNumberField';

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
        width: '100%',
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
                <Grid item xs={5}>
                    {values ? (
                        <Chart values={values} startDate={startDate} />
                    ) : (
                        <CircularProgress />
                    )}
                </Grid>
                <Grid item xs={7}>
                    <Form
                        onSubmit={console.log}
                        initialValues={parameters}
                        render={() => (
                            <div className={classes.configuration}>
                                <GraphProvider>
                                    <Node name="ref1" targets={['ref2']} top={0} left="50%">
                                        <Field
                                            name="population"
                                            label="Population totale"
                                            component={ExpandableNumberField}
                                        >
                                            <Field
                                                name="patient0"
                                                label="Nombre de patient infectés"
                                                component={NumberField}
                                                cardless
                                            />
                                        </Field>
                                    </Node>
                                    <Node name="ref2" targets={['ref3']} top={150} left="50%">
                                        POPULATION SAINE EXPOSÉE
                                    </Node>
                                    <Node
                                        name="ref3"
                                        targets={['percent_incubation']}
                                        top={300}
                                        left="50%"
                                    >
                                        <Field
                                            name="dm_incub"
                                            label="Incubation"
                                            component={DurationField}
                                            color="rgba(164, 18, 179, 0.6)"
                                        />
                                    </Node>
                                    <Node
                                        name="percent_incubation"
                                        targets={['ref4', 'ref5']}
                                        top={350}
                                        left="50%"
                                    >
                                        POURCENT INCUBATION
                                    </Node>
                                    <Node name="ref4" targets={['ref9']} top={500} left="25%">
                                        <Field
                                            name="dm_r"
                                            label="Rétablissement spontané"
                                            component={DurationField}
                                            color="rgba(88, 235, 88, 0.6)"
                                        />
                                    </Node>
                                    <Node
                                        name="ref5"
                                        targets={['percent_hospital']}
                                        top={500}
                                        left="75%"
                                    >
                                        <Field
                                            name="dm_h"
                                            label="Hospitalisation"
                                            component={DurationField}
                                        />
                                    </Node>
                                    <Node
                                        name="percent_hospital"
                                        targets={['ref6', 'ref7']}
                                        top={550}
                                        left="75%"
                                    >
                                        POURCENT HOSPITALISATION
                                    </Node>
                                    <Node name="ref6" targets={['percent_sm']} top={700} left="45%">
                                        SOINS MÉDICAUX
                                    </Node>
                                    <Node
                                        name="percent_sm"
                                        targets={['ref8', 'ref9']}
                                        top={750}
                                        left="45%"
                                    >
                                        POURCENT SOINS MÉDICAUX
                                    </Node>
                                    <Node name="ref7" targets={['percent_si']} top={700} left="85%">
                                        SOINS INTENSIFS
                                    </Node>
                                    <Node
                                        name="percent_si"
                                        targets={['percent_je_sais_pas_quoi', 'ref10']}
                                        top={750}
                                        left="85%"
                                    >
                                        POURCENT SOINS INTENSIFS
                                    </Node>
                                    <Node
                                        name="percent_je_sais_pas_quoi"
                                        targets={['ref8', 'ref9']}
                                        top={900}
                                        left="65%"
                                    >
                                        POURCENT JE SAIS PAS QUOI
                                    </Node>
                                    <Node name="ref8" targets={['ref9']} top={1100} left="50%">
                                        SOINS DE SUITE
                                    </Node>
                                    <Node name="ref9" targets={['ref8']} top={1300} left="25%">
                                        GUERISON
                                    </Node>
                                    <Node name="ref10" top={1300} left="75%">
                                        DECES
                                    </Node>
                                    <Edges />
                                </GraphProvider>
                            </div>
                        )}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Simulation;
