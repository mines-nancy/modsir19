import React, { useState, useEffect, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';

import api from '../../api';
import Chart from './Chart';
import Layout from '../../components/Layout';
import DateField from '../../components/fields/DateField';
import NumberField from '../../components/fields/NumberField';
import DurationField from '../../components/fields/DurationField';
import ExpandableNumberField from '../../components/fields/ExpandableNumberField';
import ProportionField from '../../components/fields/ProportionField';
import { Percent } from '../../components/fields/Percent';
import AutoSave from '../../components/fields/AutoSave';
// import { PercentField } from '../../components/fields/PercentField';

const round = (x) => Math.round(x * 100) / 100;

const startDate = new Date(2020, 0, 23);

const defaultParameters = {
    population: 500000,
    patient0: 1,
    kpe: 60,
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

const formatParametersForModel = (parameters) => ({
    ...parameters,
    kpe: parameters.kpe / 100,
});

const parseParametersFromModel = (parameters) => ({
    ...parameters,
    kpe: parameters.kpe * 100,
});

const useStyles = makeStyles(() => ({
    configuration: {
        marginTop: 30,
        position: 'relative',
        width: '100%',
        height: 800,
    },
}));

const getModel = async (parameters) => {
    const { data } = await api.get('/get_sir_h', {
        params: { parameters },
    });

    return data;
};

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const Simulation = () => {
    const classes = useStyles();
    const [values, setValues] = useState();
    const [parameters, setParameters] = useState(defaultParameters);

    const handleSubmit = useCallback((values) => {
        setParameters(values);
    }, []);

    useEffect(() => {
        (async () => {
            const data = await getModelDebounced(formatParametersForModel(parameters));
            setValues(parseParametersFromModel(data));
        })();
    }, [parameters]);

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
                        subscription={{}}
                        onSubmit={() => {
                            /* Useless since we use a listener on autosave */
                        }}
                        initialValues={parameters}
                        render={() => (
                            <div className={classes.configuration}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <GraphProvider>
                                    <Node
                                        name="population_totale"
                                        targets={['population_saine_exposee']}
                                        top={0}
                                        left="50%"
                                    >
                                        <Field
                                            name="population"
                                            label="Population totale"
                                            component={ExpandableNumberField}
                                        >
                                            <Field name="j_0" label="Début" component={DateField} />
                                            <Field
                                                name="patient0"
                                                label="Patients infectés à J-0"
                                                component={NumberField}
                                                cardless
                                            />
                                            <Field
                                                name="kpe"
                                                label="Taux de population exposée"
                                                numberInputLabel="Kpe"
                                                component={ProportionField}
                                            />
                                        </Field>
                                    </Node>
                                    <Node
                                        name="population_saine_exposee"
                                        targets={['incubation']}
                                        top={150}
                                        left="50%"
                                    >
                                        POPULATION SAINE EXPOSÉE
                                    </Node>
                                    <Node
                                        name="incubation"
                                        targets={['percent_incubation']}
                                        top={250}
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
                                        targets={['retablissement_spontane', 'hospitalisation']}
                                        top={350}
                                        left="50%"
                                    >
                                        <Percent percent={12} />
                                        {/* <Field name="pc_ih" component={PercentField} /> */}
                                    </Node>
                                    <Node
                                        name="retablissement_spontane"
                                        targets={['guerison']}
                                        top={500}
                                        left="25%"
                                    >
                                        <Field
                                            name="dm_r"
                                            label="Rétablissement spontané"
                                            component={DurationField}
                                            color="rgba(88, 235, 88, 0.6)"
                                        />
                                    </Node>
                                    <Node
                                        name="hospitalisation"
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
                                        targets={['soins_medicaux', 'soins_intensifs']}
                                        top={700}
                                        left="60%"
                                    >
                                        <Percent percent={14} />
                                    </Node>
                                    <Node
                                        name="soins_medicaux"
                                        targets={['percent_soins_medicaux']}
                                        top={850}
                                        left="45%"
                                    >
                                        SOINS MÉDICAUX
                                    </Node>
                                    <Node
                                        name="percent_soins_medicaux"
                                        targets={['soins_suite', 'guerison']}
                                        top={900}
                                        left="45%"
                                    >
                                        <Percent percent={40} />
                                        {/* <Field name="pc_sm" component={PercentField} /> */}
                                    </Node>
                                    <Node
                                        name="soins_intensifs"
                                        targets={['percent_si']}
                                        top={850}
                                        left="85%"
                                    >
                                        SOINS INTENSIFS
                                    </Node>
                                    <Node
                                        name="percent_si"
                                        targets={['percent_je_sais_pas_quoi', 'deces']}
                                        top={900}
                                        left="85%"
                                    >
                                        <Percent percent={60} />
                                    </Node>
                                    <Node
                                        name="percent_je_sais_pas_quoi"
                                        targets={['soins_suite', 'guerison']}
                                        top={1100}
                                        left="60%"
                                    >
                                        <Percent percent={35} />
                                    </Node>
                                    <Node
                                        name="soins_suite"
                                        targets={['guerison']}
                                        top={1100}
                                        left="50%"
                                    >
                                        SOINS DE SUITE
                                    </Node>
                                    <Node name="guerison" top={1400} left="25%">
                                        GUERISON
                                    </Node>
                                    <Node name="deces" top={1400} left="85%">
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
