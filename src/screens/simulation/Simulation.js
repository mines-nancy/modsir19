import React, { useState, useEffect, useCallback } from 'react';
import { Form } from 'react-final-form';
import { Grid, makeStyles, CardContent } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { addDays, differenceInDays, isSameDay } from 'date-fns';

import Layout from '../../components/Layout';
import AutoSave from '../../components/fields/AutoSave';

import TimeframeStepper from './TimeframeStepper';
import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from './blocks';

import Diagram from './Diagram';

import api from '../../api';
import Chart from './Chart';

const round = (x) => Math.round(x * 100) / 100;

const mapObject = (obj, keys, fn) =>
    obj
        ? keys.reduce((acc, key) => {
              acc[key] = fn(obj[key]);
              return acc;
          }, {})
        : {};

const defaultParameters = {
    population: 1000000,
    patient0: 100,
    kpe: 100,
    r0: 2.3,
    dm_incub: 3,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 8,
    dm_ss: 14,
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

const computeRBetaFromR0 = ({ r0, dm_r }) => ({
    r: 1.0,
    beta: r0 / dm_r,
});

const formatParametersForModel = ({ start_date, ...parameters }, firstTimeframeStartDate) =>
    removeMedicalCareSplit({
        ...parameters,
        ...computeRBetaFromR0(parameters),
        ...mapObject(parameters, percentFields, (x) => round(x / 100)),
        start_time: differenceInDays(start_date, firstTimeframeStartDate),
    });

const useStyles = makeStyles(() => ({
    configuration: {
        width: '100%',
    },
}));

const getModel = async (timeframes) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: timeframes.filter((timeframe) => timeframe.enabled) } },
    });

    return data;
};

const checkHasSameDate = (date) => ({ start_date }) => isSameDay(start_date, date);

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const Simulation = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [values, setValues] = useState();
    const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);
    const [timeframes, setTimeframes] = useState([
        { ...defaultParameters, start_time: 0, name: 'Période initiale', enabled: true },
        {
            ...defaultParameters,
            r0: 0.8,
            start_date: new Date(2020, 2, 16),
            name: 'Confinement',
            enabled: false,
        },
        {
            ...defaultParameters,
            r0: 1.1,
            start_date: new Date(2020, 4, 11),
            name: 'Déconfinement',
            enabled: false,
        },
    ]);

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
                    enabled: true,
                },
            ];
        });

        setSelectedTimeframeIndex(timeframes.length);

        if (expanded) {
            refreshLines();
        } else {
            setExpanded(true);
        }
    };

    const handleRemoveTimeframe = (index) => {
        // Reset index if current index is deleted
        if (selectedTimeframeIndex === index) {
            setSelectedTimeframeIndex(index - 1);
        }

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
    };

    const handleDateChange = (index) => {
        if (selectedTimeframeIndex !== index) {
            setSelectedTimeframeIndex(index);
        }

        if (!expanded) {
            setExpanded(true);
        }

        const EXPAND_OPEN_ANIMATION_TIME = 250;
        setTimeout(() => {
            const dateInput = document.querySelector('#date-picker-inline');

            if (dateInput) {
                dateInput.click();
            }
        }, EXPAND_OPEN_ANIMATION_TIME);
    };

    const handleToggleTimeframe = (index) => {
        setTimeframes((list) => {
            const timeframe = list[index];

            const newList = [...list];
            newList[index] = { ...timeframe, enabled: !timeframe.enabled };
            return newList;
        });
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
                        onDateChange={handleDateChange}
                        onToggle={handleToggleTimeframe}
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
                                        totalPopulation: (
                                            <TotalPopulationBlock
                                                expanded={expanded}
                                                setExpanded={setExpanded}
                                            />
                                        ),
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
