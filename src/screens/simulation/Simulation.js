import React, { useState, useEffect, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { CircularProgress, Grid, makeStyles, Card, CardContent } from '@material-ui/core';
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
import AutoSave from '../../components/fields/AutoSave';

import api from '../../api';
import Chart from './Chart';
import ExposedPopulation from './ExposedPopulation';
import { SwitchPercentField } from '../../components/fields/SwitchPercentField';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';

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
    pc_sm_other: round(100 - 20), // This field is not sent to the API
    pc_sm_dc: 20,
    pc_sm_out: round(100 - 20),
    pc_si_dc: 50,
    pc_si_out: 50,
    pc_h_ss: 20,
    pc_h_r: round(100 - 20),
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
    'pc_sm_dc',
    'pc_sm_other',
    'pc_si_dc',
    'pc_si_out',
    'pc_h_ss',
    'pc_h_r',
];

const removeMedicalCareSplit = ({ pc_sm_other, ...parameters }) => ({
    ...parameters,
    pc_sm_dc: parameters.pc_sm_dc * pc_sm_other,
    pc_sm_out: parameters.pc_sm_out * pc_sm_other,
});

const formatParametersForModel = (parameters) =>
    removeMedicalCareSplit({
        ...parameters,
        ...mapObject(parameters, percentFields, (x) => x / 100),
    });

const useStyles = makeStyles(() => ({
    configuration: {
        marginTop: 30,
        position: 'relative',
        width: '100%',
        height: 800,
    },
}));

const getModel = async (parameterList) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: parameterList } },
    });

    return data;
};

const checkDateExists = (date) => ({ j_0 }) => isSameDay(j_0, date);

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const Simulation = () => {
    const classes = useStyles();
    const [values, setValues] = useState();
    const [parameterIndex, setParameterIndex] = useState(0);
    const [parametersList, setParametersList] = useState([{ ...defaultParameters, start_time: 0 }]);

    const [expanded, setExpanded] = useState(false);
    const topShift = expanded ? 220 : 0;

    const handleSubmit = useCallback(
        (values) => {
            const parametersListWithoutCurrent = [...parametersList];
            parametersListWithoutCurrent.splice(parameterIndex, 1);
            if (parametersListWithoutCurrent.some(checkDateExists(values.j_0))) {
                alert("Vous ne pouvez pas choisir la même date qu'une autre période");
                return;
            }

            setParametersList((list) => {
                const newList = [...list];
                newList[parameterIndex] = values;
                return newList;
            });
        },
        [parameterIndex],
    );

    const handleAddSimulation = useCallback(() => {
        setParametersList((list) => {
            const lastItem = list[list.length - 1];
            return [...list, { ...lastItem, j_0: addDays(lastItem.j_0, 1) }];
        });
    }, []);

    const handleRemoveParameter = (index) => () => {
        setParametersList((list) => {
            // Can't remove if there's only 1 parameter
            if (list.length === 1) {
                return;
            }

            const newList = [...list];
            newList.splice(index, 1);
            return newList;
        });

        // Reset index if current index is deleted
        if (parameterIndex === index) {
            setParameterIndex(0);
        }
    };

    const handleExpansionChange = (evt, value) => setExpanded(value);

    useEffect(() => {
        (async () => {
            const data = await getModelDebounced(
                parametersList.map((parameters) => formatParametersForModel(parameters)),
            );
            setValues(data);
        })();
    }, [JSON.stringify(parametersList)]);

    return (
        <Layout>
            <Grid container>
                <Grid item xs={6}>
                    <div style={{ display: 'flex' }}>
                        {parametersList.map((p, index) => (
                            <div style={{ paddingRight: 10 }}>
                                <button
                                    style={{
                                        color: index === parameterIndex ? 'blue' : 'black',
                                    }}
                                    onClick={() => setParameterIndex(index)}
                                >
                                    Période {`j${differenceInDays(p.j_0, startDate)}`} (
                                    {format(p.j_0, 'dd/MM/yyyy')})
                                </button>
                                {parametersList.length > 1 && (
                                    <button onClick={handleRemoveParameter(index)}>X</button>
                                )}
                            </div>
                        ))}
                        <button onClick={handleAddSimulation}>Ajouter plus de périodes</button>
                    </div>
                    {values ? (
                        <Chart values={values} startDate={startDate} />
                    ) : (
                        <CircularProgress />
                    )}
                </Grid>
                <Grid item xs={6} style={{ paddingRight: 16 }}>
                    <Form
                        subscription={{}}
                        onSubmit={() => {
                            /* Useless since we use a listener on autosave */
                        }}
                        initialValues={parametersList[parameterIndex]}
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
                                        targets={[
                                            {
                                                name: 'retablissement_spontane',
                                                options: { path: 'straight' },
                                            },
                                            {
                                                name: 'hospitalisation',
                                                options: { path: 'straight' },
                                            },
                                        ]}
                                        top={topShift + 450}
                                        left="50%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_ir"
                                            rightName="pc_ih"
                                            leftLabel="Rétablissements"
                                            rightLabel="Hospitalisations"
                                        />
                                    </Node>
                                    <Node
                                        name="retablissement_spontane"
                                        targets={[
                                            {
                                                name: 'guerison',
                                                options: {
                                                    anchorStart: { x: '10%' },
                                                },
                                            },
                                        ]}
                                        top={topShift + 550}
                                        left="30%"
                                    >
                                        <Field
                                            name="dm_r"
                                            label={
                                                <>
                                                    Rétablissement
                                                    <br />
                                                    spontané
                                                </>
                                            }
                                            component={DurationField}
                                        />
                                    </Node>
                                    <Node
                                        name="hospitalisation"
                                        targets={[]}
                                        top={topShift + 550}
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
                                        top={topShift + 620}
                                        left="75%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_sm"
                                            rightName="pc_si"
                                            leftLabel="Soins médicaux"
                                            rightLabel="Soins intensifs"
                                        />
                                    </Node>
                                    <Node
                                        name="soins_medicaux"
                                        targets={[]}
                                        top={topShift + 800}
                                        left="35%"
                                    >
                                        <Field
                                            name="dm_sm"
                                            label="Soins médicaux"
                                            component={DurationField}
                                            color="rgba(255, 88, 132, 0.6)"
                                        />
                                    </Node>
                                    <Node
                                        name="soins_intensifs"
                                        targets={[]}
                                        top={topShift + 800}
                                        left="75%"
                                    >
                                        <Field
                                            name="dm_si"
                                            label="Soins intensifs"
                                            component={DurationField}
                                            color="rgba(54, 162, 235, 0.6)"
                                        />
                                    </Node>
                                    <Node
                                        name="percent_soins_medicaux"
                                        targets={['post_soins_medicaux', 'soins_intensifs']}
                                        top={topShift + 875}
                                        left="35%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_sm_other"
                                            rightName="pc_sm_si"
                                            leftLabel="Sortie ou Décès"
                                            rightLabel="Soins intensifs"
                                        />
                                    </Node>
                                    <Node
                                        name="percent_si"
                                        targets={['gueris_ou_soins_suite', 'deces']}
                                        top={topShift + 875}
                                        left="75%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_si_dc"
                                            rightName="pc_si_out"
                                            leftLabel="Décès"
                                            rightLabel="Sortie"
                                        />
                                    </Node>
                                    <Node name="deces" top={topShift + 1000} left="55%">
                                        <Card
                                            className={classes.card}
                                            elevation={3}
                                            style={{ backgroundColor: 'rgba(88, 88, 88, 0.6)' }}
                                        >
                                            <CardContent>Décès</CardContent>
                                        </Card>
                                    </Node>
                                    <Node
                                        name="post_soins_medicaux"
                                        targets={['deces', 'gueris_ou_soins_suite']}
                                        top={topShift + 1000}
                                        left="35%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_sm_out"
                                            rightName="pc_sm_dc"
                                            leftLabel="Sortie"
                                            rightLabel="Décès"
                                        />
                                    </Node>
                                    <Node
                                        name="gueris_ou_soins_suite"
                                        targets={['soins_suite', 'guerison']}
                                        top={topShift + 1200}
                                        left="50%"
                                    >
                                        <SwitchPercentField
                                            leftName="pc_h_r"
                                            rightName="pc_h_ss"
                                            leftLabel="Guérison"
                                            rightLabel="Soins de suite"
                                        />
                                    </Node>
                                    <Node
                                        name="soins_suite"
                                        targets={['guerison']}
                                        top={topShift + 1300}
                                        left="75%"
                                    >
                                        <Field
                                            name="dm_ss"
                                            label="Soins de suite"
                                            component={DurationField}
                                            color="rgba(54, 54, 255, 0.6)"
                                        />
                                    </Node>
                                    <Node name="guerison" top={topShift + 1350} left="25%">
                                        <Card
                                            className={classes.card}
                                            elevation={3}
                                            style={{ backgroundColor: 'rgba(88, 235, 88, 0.6)' }}
                                        >
                                            <CardContent>Guérison</CardContent>
                                        </Card>
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
