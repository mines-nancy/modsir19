import React, { useState, useEffect, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import Layout from '../../components/Layout';
import DateField from '../../components/fields/DateField';
import NumberField from '../../components/fields/NumberField';
import DurationField from '../../components/fields/DurationField';
import ExpandableNumberField from '../../components/fields/ExpandableNumberField';
import ProportionField from '../../components/fields/ProportionField';
import { Percent } from '../../components/fields/Percent';
import AutoSave from '../../components/fields/AutoSave';
import { PercentField } from '../../components/fields/PercentField';

import api from '../../api';
import Chart from './Chart';
import ExposedPopulation from './ExposedPopulation';

const round = (x) => Math.round(x * 100) / 100;

const mapObject = (obj, keys, fn) =>
    obj
        ? keys.reduce((acc, key) => {
              acc[key] = fn(obj[key]);
              return acc;
          }, {})
        : {};

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
    beta: 15,
    pc_ir: 84,
    pc_ih: round(100 - 84),
    pc_sm: 80,
    pc_si: round(100 - 80),
    pc_sm_si: 20,
    pc_sm_out: round(100 - 20),
    pc_si_dc: 50,
    pc_si_out: 50,
    pc_h_ss: 20,
    pc_h_r: round(1 - 20),
    lim_time: 250,
    j_0: startDate,
    rules: [],
};

const percentFields = [
    'kpe',
    'beta',
    'pc_ir',
    'pc_ih',
    'pc_sm',
    'pc_si',
    'pc_sm_si',
    'pc_sm_out',
    'pc_si_dc',
    'pc_si_out',
    'pc_h_ss',
    'pc_h_r',
];

const formatParametersForModel = (parameters) => ({
    ...parameters,
    ...mapObject(parameters, percentFields, (x) => x / 100),
});

const parseParametersFromModel = (parameters) => ({
    ...parameters,
    ...mapObject(parameters, percentFields, (x) => x * 100),
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
    const [expanded, setExpanded] = useState(false);
    const topShift = expanded ? 220 : 0;

    const handleSubmit = useCallback((values) => {
        setParameters(values);
    }, []);

    const handleExpansionChange = (evt, value) => {
        setExpanded(value);
    };

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
                <Grid item xs={7} style={{ paddingRight: 64 }}>
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
                                        top={-10}
                                        left="50%"
                                    >
                                        <Field
                                            name="population"
                                            label="Population totale"
                                            component={ExpandableNumberField}
                                            expanded={expanded}
                                            onChange={handleExpansionChange}
                                        >
                                            <Field
                                                className="small-margin-bottom"
                                                name="j_0"
                                                label="Début"
                                                component={DateField}
                                            />
                                            <Field
                                                className="small-margin-bottom"
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
                                        top={topShift + 100}
                                        left="50%"
                                    >
                                        <ExposedPopulation />
                                    </Node>
                                    <Node
                                        name="incubation"
                                        targets={[]}
                                        top={topShift + 380}
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
                                        top={topShift + 450}
                                        left="50%"
                                    >
                                        <Field name="pc_ih" component={PercentField} />
                                    </Node>
                                    <Node
                                        name="retablissement_spontane"
                                        targets={['guerison']}
                                        top={topShift + 550}
                                        left="30%"
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
                                        targets={[]}
                                        top={topShift + 550}
                                        left="70%"
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
                                        top={topShift + 620}
                                        left="70%"
                                    >
                                        <Percent percent={14} />
                                    </Node>
                                    <Node
                                        name="soins_medicaux"
                                        targets={[]}
                                        top={topShift + 800}
                                        left="45%"
                                    >
                                        SOINS MÉDICAUX
                                    </Node>
                                    <Node
                                        name="soins_intensifs"
                                        targets={[]}
                                        top={topShift + 800}
                                        left="85%"
                                    >
                                        SOINS INTENSIFS
                                    </Node>
                                    <Node
                                        name="percent_soins_medicaux"
                                        targets={['soins_suite', 'guerison']}
                                        top={topShift + 830}
                                        left="45%"
                                    >
                                        <Field name="pc_sm" component={PercentField} />
                                    </Node>
                                    <Node
                                        name="percent_si"
                                        targets={['percent_je_sais_pas_quoi', 'deces']}
                                        top={topShift + 830}
                                        left="85%"
                                    >
                                        <Percent percent={60} />
                                    </Node>
                                    <Node
                                        name="percent_je_sais_pas_quoi"
                                        targets={['soins_suite', 'guerison']}
                                        top={topShift + 1000}
                                        left="60%"
                                    >
                                        <Percent percent={35} />
                                    </Node>
                                    <Node
                                        name="soins_suite"
                                        targets={['guerison']}
                                        top={topShift + 1200}
                                        left="50%"
                                    >
                                        SOINS DE SUITE
                                    </Node>
                                    <Node name="guerison" top={topShift + 1200} left="25%">
                                        GUERISON
                                    </Node>
                                    <Node name="deces" top={topShift + 1200} left="85%">
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
