import React, { useState } from 'react';
import {
    IconButton,
    createStyles,
    makeStyles,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
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

const SelectField = ({
    label,
    input: { name, onChange, value, ...restInput },
    options,
    ...props
}) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Schéma</InputLabel>
            <Select
                {...props}
                {...restInput}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const coefficientsToKi = (values) =>
    values.map((v, i) => (i === 0 ? (100 - v) / 100 : (values[i - 1] - v) / 100));
const coefficientsToOutputs = (values) => coefficientsToKi(values).map((x) => x * 100);
const kiToCoefficients = (values) =>
    values.reduce((acc, v, i) => {
        if (acc.length === 0) {
            acc.push(100 - v * 100);
        } else {
            acc.push(acc[acc.length - 1] - v * 100);
        }
        return acc;
    }, []);

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
                data: coefficientsToOutputs(values),
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

const getKiAnalysis = async (parameters) => {
    return await api.get('/get_ki_analysis', {
        params: { parameters },
    });
};
const getKiAnalysisDebounced = AwesomeDebouncePromise(getKiAnalysis, 500);

const getKiFromSchema = async (parameters) => {
    return await api.get('/get_ki_from_schema', {
        params: { parameters },
    });
};
const getKiFromSchemaDebounced = AwesomeDebouncePromise(getKiFromSchema, 500);

const initialDms = 6;
const initialState = {
    coefficients: Array.from({ length: initialDms }, (v, i) => (i < initialDms - 1 ? 100 : 0)),
    dms: initialDms,
    schema: 'Libre',
};

const decorator = createDecorator({
    field: /coefficients\[\d+\]/, // when a field matching this pattern changes...
    updates: (value, field, allValues) => {
        // console.log({ value, field, allValues });
        const index = parseFloat(field.substring('coefficients['.length, field.length - 1), 10);
        const coefficients = allValues.coefficients;
        if (
            value > coefficients[Math.max(0, index - 1)] ||
            value < coefficients[Math.min(coefficients.length - 1, index + 1)]
        ) {
            const newCoefficients = coefficients.map((ki, i) =>
                i < index ? Math.max(ki, value) : i === index ? value : Math.min(ki, value),
            );
            return { coefficients: newCoefficients };
        }

        coefficients[index] = value;
        return { coefficients };
    },
});
const round2digits = (x) => Math.round(x * 100) / 100;
const MixerConvolution = ({ onChange }) => {
    const classes = useStyles();

    const [coefficients, setCoefficients] = useState();
    const [kiAnalysis, setKiAnalysis] = useState();

    const handleSubmit = async ({ coefficients, dms, schema }) => {
        console.log({ coefficients, dms, schema });
        if (schema === 'Libre') {
            setCoefficients(coefficients);
            const response = await getKiAnalysisDebounced({
                ki: coefficientsToKi(coefficients),
            });
            setKiAnalysis(response.data);
        } else {
            const response = await getKiFromSchemaDebounced({
                schema,
                duration: dms,
                max_days: Math.max(coefficients.length, Math.ceil(dms)),
            });
            console.log({ data: response.data });
            setCoefficients(kiToCoefficients(response.data.ki));
            setKiAnalysis(response.data);
        }
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
                            <FieldArray name="coefficients">
                                {({ fields }) => {
                                    // console.log({ fields });
                                    return (
                                        <>
                                            <div className={classes.verticalSlider}>
                                                {fields.map((v, i) => (
                                                    <Field
                                                        name={`coefficients[${i}]`}
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
                            <Field
                                name="schema"
                                label="Modèle de séjour"
                                component={SelectField}
                                options={['Libre', 'Retard', 'Exponentielle', 'Binomiale']}
                            />
                        </div>
                    );
                }}
            />

            <Bar data={data({ values: coefficients })} width="300" height="300" options={options} />
            {kiAnalysis && (
                <Typography>
                    Aire = {round2digits(kiAnalysis.area)} Espérance ={' '}
                    {round2digits(kiAnalysis.expectation)}
                </Typography>
            )}
        </div>
    );
};

export default MixerConvolution;
