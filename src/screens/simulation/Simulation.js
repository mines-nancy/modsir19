import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form } from 'react-final-form';
import { Grid, makeStyles, CardContent, Switch } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { addDays, isSameDay } from 'date-fns';

import Layout from '../../components/Layout';
import AutoSave from '../../components/fields/AutoSave';
import { formatParametersForModel, defaultTimeframes, extractGraphTimeframes } from './common';
import TimeframeStepper from './TimeframeStepper';
import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from './blocks';
import Diagram from './Diagram';
import api from '../../api';
import Chart from './Chart';
import { useWindowSize } from '../../utils/useWindowSize';
import { ImportButton, ExportButton } from './ExportImport';
import { ZoomSlider } from './ZoomSlider';

const useStyles = makeStyles(() => ({
    configuration: {
        width: '100%',
    },
    chartActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#888',
        padding: '30px 30px 0px 30px',
    },
    chartContainer: {
        position: 'fixed',
        left: 24,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    chartView: {
        display: 'flex',
        flexDirection: 'row',
    },
    rangeSlider: {
        flex: '0 0 50px',
        padding: '60px 0px 30px 0px',
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

const CHART_HEIGHT_RATIO = 0.7;

const Simulation = () => {
    const classes = useStyles();
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [values, setValues] = useState();
    const { width: windowWidth } = useWindowSize();
    const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);
    const [yType, setYType] = useState('linear');

    const [graphTimeframes, setGraphTimeframes] = useState(
        extractGraphTimeframes(defaultTimeframes),
    );

    const [timeframes, setTimeframes] = useState(defaultTimeframes);
    const [zoomMax, setZoomMax] = useState(timeframes[0].population);

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

    const handleYTypeToggle = () => setYType((type) => (type === 'linear' ? 'log' : 'linear'));

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
            setGraphTimeframes(extractGraphTimeframes(timeframes));
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(timeframes)]);

    const chartSize = windowWidth ? Math.max(windowWidth / 2 - 100, 350) : 850;

    const customConfig = {
        axis: {
            y: { type: yType, max: zoomMax },
        },
    };

    return (
        <Layout loading={loading}>
            <Grid container>
                <Grid item xs={6}>
                    {values && (
                        <div className={classes.chartContainer}>
                            <div className={classes.chartActions}>
                                <div>
                                    <ExportButton timeframes={timeframes} />
                                    <ImportButton setTimeframes={setTimeframes} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            color: yType === 'log' ? '#888' : 'black',
                                        }}
                                    >
                                        Échelle linéaire
                                    </div>
                                    <div>
                                        <Switch
                                            checked={yType === 'log'}
                                            onChange={handleYTypeToggle}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            color: yType === 'linear' ? '#888' : 'black',
                                        }}
                                    >
                                        Échelle logarithmique
                                    </div>
                                </div>
                            </div>
                            <div className={classes.chartView}>
                                <div className={classes.rangeSlider}>
                                    <ZoomSlider
                                        onChange={setZoomMax}
                                        min={300}
                                        max={timeframes[0].population}
                                        initValue={timeframes[0].population}
                                    />
                                </div>
                                <div>
                                    <Chart
                                        values={values}
                                        startDate={timeframes[0].start_date}
                                        timeframes={graphTimeframes}
                                        size={{
                                            height: chartSize * CHART_HEIGHT_RATIO,
                                            width: chartSize,
                                        }}
                                        ref={chartRef}
                                        customConfig={customConfig}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                                                hideInitialInfected={selectedTimeframeIndex > 0}
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
