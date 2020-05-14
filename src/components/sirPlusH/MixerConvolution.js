import React, { useState } from 'react';

import {
    IconButton,
    makeStyles,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCoefficient from '@material-ui/icons/RemoveOutlined';
import AddCoefficient from '@material-ui/icons/AddOutlined';

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import { Bar } from 'react-chartjs-2';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import VerticalProportionField from './VerticalProportionField';
import ProportionField from '../fields/ProportionField';
import AutoSave from '../fields/AutoSave';
import api from '../../api';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    verticalSlider: {
        height: 150,
    },
    formControl: {
        width: '100%',
    },
}));

const SelectField = ({
    label,
    input: { name, onChange, value, ...restInput },
    options,
    ...props
}) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="select-shema-label">{label}</InputLabel>
            <Select
                {...props}
                {...restInput}
                labelId="select-schema-label"
                id="select-schema"
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

const getKiAnalysis = (parameters) => api.get('/get_ki_analysis', { params: { parameters } });
const getKiAnalysisDebounced = AwesomeDebouncePromise(getKiAnalysis, 500);

const getKiFromSchema = (parameters) => api.get('/get_ki_from_schema', { params: { parameters } });

const decorator = createDecorator({
    field: /coefficients\[\d+\]/, // when a field matching this pattern changes...
    updates: (value, field, allValues) => {
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
const round2digits = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const initialDms = 6;
const initialState = {
    coefficients: Array.from({ length: initialDms }, (v, i) => (i < initialDms - 1 ? 100 : 0)),
    dms: initialDms,
    schema: 'Personnalisé',
};
const MixerConvolution = ({ onChange }) => {
    const classes = useStyles();

    const [initialValues, setInitialValues] = useState(initialState);
    const [coefficients, setCoefficients] = useState();
    const [kiAnalysis, setKiAnalysis] = useState();
    const [detailsOpened, setDetailsOpened] = useState(false);

    const handleSubmit = async ({ coefficients, dms, schema, ...rest }) => {
        if (schema === 'Personnalisé') {
            setCoefficients(coefficients);
            const response = await getKiAnalysisDebounced({
                ki: coefficientsToKi(coefficients),
            });
            setKiAnalysis(response.data);
        } else {
            const response = await getKiFromSchema({
                schema,
                duration: dms,
                max_days: Math.min(21, Math.max(coefficients.length, 2 * Math.ceil(dms))),
            });
            setCoefficients(kiToCoefficients(response.data.ki));
            setKiAnalysis(response.data);
            setInitialValues({
                coefficients: kiToCoefficients(response.data.ki).map(round2digits),
                dms,
                schema,
            });
        }
    };

    const toggleDetails = () => setDetailsOpened((opened) => !opened);

    useEffect(() => {
        if (coefficients) {
            onChange(coefficients);
        }
    }, [JSON.stringify(coefficients)]);

    return (
        <div>
            <Form
                subscription={{}}
                onSubmit={() => {
                    /* Useless since we use a listener on autosave */
                }}
                initialValues={initialValues}
                decorators={[decorator]}
                mutators={{ ...arrayMutators }}
                render={({ form }) => {
                    const state = form.getState();
                    return (
                        <div>
                            <AutoSave save={handleSubmit} debounce={200} />
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <Field
                                        name="schema"
                                        label="Modèle de séjour"
                                        component={SelectField}
                                        options={[
                                            'Personnalisé',
                                            'Retard',
                                            'Exponentielle',
                                            'Binomiale',
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <Field
                                        name="dms"
                                        label="Durée moyenne de séjour"
                                        component={ProportionField}
                                        unit=""
                                        max="21"
                                        step={0.1}
                                        disabled={state.values.schema === 'Personnalisé'}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ marginTop: 20 }}>
                                    <FieldArray name="coefficients">
                                        {({ fields }) => {
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
                                                                style={{ padding: '0 11px' }}
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
                                </Grid>
                                <Grid item xs={12}>
                                    <ExpansionPanel
                                        expanded={detailsOpened}
                                        onChange={toggleDetails}
                                        elevation={1}
                                    >
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                        >
                                            <Typography className={classes.heading}>
                                                Visualisation (
                                                {kiAnalysis ? (
                                                    <span>
                                                        Aire = {round2digits(kiAnalysis.area)}{' '}
                                                        Espérance ={' '}
                                                        {round2digits(kiAnalysis.expectation)}
                                                    </span>
                                                ) : (
                                                    'Calcul en cours..'
                                                )}
                                                )
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <div style={{ width: 450, height: 250 }}>
                                                <Bar
                                                    data={data({ values: coefficients })}
                                                    width={450}
                                                    height={250}
                                                    options={options}
                                                />
                                            </div>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Grid>
                            </Grid>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default MixerConvolution;
