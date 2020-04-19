import React, { useState, useEffect, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { Grid, makeStyles, Card, CardContent } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';

import Layout from '../../components/Layout';
import DurationField from '../../components/fields/DurationField';
import AutoSave from '../../components/fields/AutoSave';

import TimeframeStepper from './TimeframeStepper';
import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from './blocks';

import Diagram from './Diagram';

import api from '../../api';
import Chart from './Chart';
import colors from './colors';

const round = (x) => Math.round(x * 100) / 100;

const mapObject = (obj, keys, fn) =>
    obj
        ? keys.reduce((acc, key) => {
              acc[key] = fn(obj[key]);
              return acc;
          }, {})
        : {};

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
    start_date: new Date(2020, 0, 23),
};

const percentFields = [
    'kpe',
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

const formatParametersForModel = ({ start_date, ...parameters }, firstTimeframeStartDate) =>
    removeMedicalCareSplit({
        ...parameters,
        ...mapObject(parameters, percentFields, (x) => round(x / 100)),
        start_time: differenceInDays(start_date, firstTimeframeStartDate),
    });

const useStyles = makeStyles(() => ({
    configuration: {
        width: '100%',
    },
}));

const getModel = async (parameterList) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: parameterList } },
    });

    return data;
};

const checkHasSameDate = (date) => ({ start_date }) => isSameDay(start_date, date);

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const Simulation = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState();
    const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);
    const [timeframes, setTimeframes] = useState([
        { ...defaultParameters, start_time: 0, name: 'Période initiale' },
    ]);
    const [expanded, setExpanded] = useState(false);
    const handleExpansionChange = (evt, value) => setExpanded(value);

    const handleSubmit = useCallback(
        (values) => {
            const timeframesWithoutCurrent = [...timeframes];
            timeframesWithoutCurrent.splice(selectedTimeframeIndex, 1);

            if (timeframesWithoutCurrent.some(checkHasSameDate(values.start_date))) {
                return;
            }

            setTimeframes((list) => {
                const newList = [...list];
                newList[selectedTimeframeIndex] = values;
                newList.sort((a, b) => a.start_date - b.start_date);
                setSelectedTimeframeIndex(
                    newList.findIndex((timeframe) => timeframe.start_date === values.start_date),
                );
                return newList;
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedTimeframeIndex],
    );

    const refreshLines = () => {
        window.dispatchEvent(new CustomEvent('graph:refresh:start'));

        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('graph:refresh:stop'));
        }, 16);
    };

    const handleAddTimeframe = () => {
        setTimeframes((list) => {
            const lastItem = list[list.length - 1];
            const startDate = addDays(lastItem.start_date, 1);

            return [
                ...list,
                {
                    ...lastItem,
                    start_date: startDate,
                    name: 'Nouvelle période',
                },
            ];
        });

        if (expanded) {
            refreshLines();
        } else {
            setExpanded(true);
        }
    };

    const handleRemoveTimeframe = (index) => {
        setTimeframes((list) => {
            // Can't remove if there's only 1 parameter
            if (list.length === 1) {
                return;
            }

            const newList = [...list];
            newList.splice(index, 1);
            return newList;
        });

        refreshLines();

        // Reset index if current index is deleted
        if (selectedTimeframeIndex === index) {
            setSelectedTimeframeIndex(0);
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getModelDebounced(
                timeframes.map((parameters) =>
                    formatParametersForModel(parameters, timeframes[0].start_date),
                ),
            );
            setValues(data);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(timeframes)]);

    return (
        <Layout loading={loading}>
            <Grid container>
                <Grid item xs={6}>
                    {values && <Chart values={values} startDate={timeframes[0].start_date} />}
                </Grid>
                <Grid item xs={6} style={{ backgroundColor: '#eee' }}>
                    <TimeframeStepper
                        timeframes={timeframes}
                        selectedTimeframeIndex={selectedTimeframeIndex}
                        setSelectedTimeframeIndex={setSelectedTimeframeIndex}
                        onAddTimeframe={handleAddTimeframe}
                        onRemoveTimeframe={handleRemoveTimeframe}
                    />
                    <Form
                        // Reset the form at each timeframe change
                        key={timeframes[selectedTimeframeIndex].start_date}
                        subscription={{}}
                        onSubmit={() => {
                            /* Useless since we use a listener on autosave */
                        }}
                        initialValues={timeframes[selectedTimeframeIndex]}
                        render={() => (
                            <div className={classes.configuration}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <Diagram
                                    blocks={{
                                        totalPopulation: <TotalPopulationBlock />,
                                        exposedPopulation: <ExposedPopulationBlock />,
                                        incubation: (
                                            <AverageDurationBlock
                                                name="dm_incub"
                                                label="Incubation"
                                            />
                                        ),
                                        spontaneousRecovery: (
                                            <AverageDurationBlock
                                                name="dm_r"
                                                label="Rétablissement spontané"
                                            />
                                        ),
                                        hospitalisation: (
                                            <AverageDurationBlock
                                                name="dm_h"
                                                label="Hospitalisation"
                                            />
                                        ),
                                        medicalCare: (
                                            <AverageDurationBlock
                                                name="dm_sm"
                                                label="Soins médicaux"
                                            />
                                        ),
                                        intensiveCare: (
                                            <AverageDurationBlock
                                                name="dm_si"
                                                label="Soins intensifs"
                                            />
                                        ),
                                        followUpCare: (
                                            <AverageDurationBlock
                                                name="dm_ss"
                                                label="Soins de suite"
                                            />
                                        ),
                                        death: <CardContent>Décès</CardContent>,
                                        recovery: <CardContent>Guérison</CardContent>,
                                    }}
                                />
                            </div>
                        )}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Simulation;
