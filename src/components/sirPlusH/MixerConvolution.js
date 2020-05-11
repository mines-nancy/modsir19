import React, { useState } from 'react';
import { IconButton, createStyles, makeStyles, Typography } from '@material-ui/core';
import RemoveCoefficient from '@material-ui/icons/RemoveOutlined';
import AddCoefficient from '@material-ui/icons/AddOutlined';

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import { Bar, Line } from 'react-chartjs-2';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import VerticalProportionField from './VerticalProportionField';
import ProportionField from '../fields/ProportionField';
import AutoSave from '../fields/AutoSave';
import api from '../../api';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: 40,
            height: 200,
        },
        longinput: {
            width: 80,
        },
        input: {
            width: 50,
        },
        verticalSlider: {
            height: 200,
        },
        slider: {
            width: 60,
        },
        sliderWithInput: {
            height: 300,
            margin: theme.spacing(2),
        },
        actions: {
            float: 'left',
            margin: theme.spacing(1),
        },
    }),
);

const outputs = (values) => values.map((v, i) => (i === 0 ? 100 - v : values[i - 1] - v));
const data = ({ values }) => {
    if (!values) {
        return null;
    }

    return {
        labels: values.map((v, i) => `J${i}`),
        datasets: [
            {
                label: 'Résidu souhaité',
                type: 'line',
                lineTension: 0,
                data: values,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 2,
            },
            {
                label: 'Sortie',
                type: 'bar',
                data: outputs(values),
                backgroundColor: 'rgba(164, 18, 179, 0.6)',
                borderWidth: 2,
            },
        ],
    };
};
const options = {
    title: {
        display: false,
        text: 'Réponse',
        fontSize: 25,
    },
};

const plugins = ({ area }) => [
    {
        afterDraw: (chartInstance, easing) => {
            const ctx = chartInstance.chart.ctx;
            ctx.fillStyle = '#ff0000';
            ctx.fillText(`DMS = ${area}`, 100, 50);
        },
    },
];

const getKiAnalysis = async (parameters) => {
    return await api.get('/get_ki_analysis', {
        params: { parameters },
    });
};

const getKiAnalysisDebounced = AwesomeDebouncePromise(getKiAnalysis, 500);

const initialState = {
    coefficient: Array.from({ length: 5 }, (v, i) => (i < 4 ? 100 : 0)),
    dms: 9,
};

const decorator = createDecorator({
    field: /coefficient\[\d+\]/, // when a field matching this pattern changes...
    updates: (value, field, allValues) => {
        // console.log({ value, field, allValues });
        const index = parseFloat(field.substring('coefficient['.length, field.length - 1), 10);
        const coefficient = allValues.coefficient;
        if (
            value > coefficient[Math.max(0, index - 1)] ||
            value < coefficient[Math.min(coefficient.length - 1, index + 1)]
        ) {
            const newCoefficients = coefficient.map((ki, i) =>
                i < index ? Math.max(ki, value) : i === index ? value : Math.min(ki, value),
            );
            return { coefficient: newCoefficients };
        }

        coefficient[index] = value;
        return { coefficient };
    },
});
const round2digits = (x) => Math.round(x * 100) / 100;
const MixerConvolution = ({ onChange }) => {
    const classes = useStyles();

    const [coefficient, setCoefficient] = useState();
    const [area, setArea] = useState();

    const handleSubmit = async (values) => {
        const coefficients = values.coefficient;
        setCoefficient(coefficients);

        const response = await getKiAnalysisDebounced({
            coefficients: outputs(coefficients).map((x) => x / 100),
        });
        setArea(response.data.area);
    };

    return (
        <div>
            <Form
                subscription={{}}
                onSubmit={() => {
                    /* Useless since we use a listener on autosave */
                }}
                initialValues={initialState}
                decorators={[decorator]}
                mutators={{ ...arrayMutators }}
                render={({ form }) => {
                    return (
                        <div className={classes.form}>
                            <AutoSave save={handleSubmit} debounce={200} />
                            <FieldArray name="coefficient">
                                {({ fields }) => {
                                    // console.log({ fields });
                                    return (
                                        <>
                                            <div className={classes.verticalSlider}>
                                                {fields.map((v, i) => (
                                                    <Field
                                                        name={`coefficient[${i}]`}
                                                        component={VerticalProportionField}
                                                        unit=""
                                                        valueLabelDisplay="auto"
                                                        orientation="vertical"
                                                    />
                                                ))}
                                            </div>
                                            <div>
                                                <IconButton
                                                    aria-label="delete"
                                                    color="primary"
                                                    disabled={fields.length <= 1}
                                                    onClick={() => fields.pop()}
                                                >
                                                    <RemoveCoefficient />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="add"
                                                    color="primary"
                                                    disabled={fields.length >= 21}
                                                    onClick={() => fields.push(0)}
                                                >
                                                    <AddCoefficient />
                                                </IconButton>
                                            </div>
                                        </>
                                    );
                                }}
                            </FieldArray>

                            <Field
                                name="dms"
                                label="Durée moyenne de séjour"
                                component={ProportionField}
                                unit=""
                                max="21"
                                step={0.1}
                            />
                        </div>
                    );
                }}
            />

            <Bar data={data({ values: coefficient })} width="300" height="300" options={options} />
            <Typography>DMS = {round2digits(area)}</Typography>
        </div>
    );
};

export default MixerConvolution;
