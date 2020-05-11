import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Tooltip,
    Typography,
    Slider,
    Input,
    Button,
    IconButton,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'react-polyglot';
import { SelectFieldWithDate } from './SelectFieldWithDate';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { Form, Field } from 'react-final-form';
import RemoveCoefficient from '@material-ui/icons/RemoveOutlined';
import AddCoefficient from '@material-ui/icons/AddOutlined';
import ProportionField from '../fields/ProportionField';
import AutoSave from '../fields/AutoSave';
import createDecorator from 'final-form-calculate';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

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

const valuetext = (value) => `${value}`;
const VerticalSlider = ({ index, value, min, max, step, onSliderChange }) => {
    const classes = useStyles();

    const marks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 20,
        },
        {
            value: 100,
            label: '100%',
        },
    ];
    return (
        <Slider
            orientation="vertical"
            className={classes.slider}
            index={index}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event, newValue) => {
                onSliderChange(event, newValue, index);
            }}
            aria-labelledby="input-slider"
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
        />
    );
};

const stateReducer = (state, action) => {
    console.log(state, action);
    switch (action.type) {
        case 'SET_VALUE':
            const { index, value } = action.payload;
            const newCoefficients = state.coefficients.map((ki, i) =>
                i < index ? Math.max(ki, value) : i === index ? value : Math.min(ki, value),
            );
            return { ...state, coefficients: newCoefficients };

        case 'ADD_COEFFICIENT':
            return {
                ...state,
                coefficients: state.coefficients.concat([
                    state.coefficients[state.coefficients.length - 1],
                ]),
            };
        case 'REMOVE_COEFFICIENT':
            return {
                ...state,
                coefficients: state.coefficients.slice(
                    0,
                    Math.max(1, state.coefficients.length - 1),
                ),
            };

        default:
            return state;
    }
};

const initialState = {
    coefficients: Array.from({ length: 5 }, (v, i) => 100),
    // for final-form
    coefficient: Array.from({ length: 5 }, (v, i) => 100),
    dms: 9,
};

const decorator = createDecorator({
    field: /coefficient\[\d+\]/, // when a field matching this pattern changes...
    updates: (value, field, allValues) => {
        // console.log({ value, field, allValues });
        const index = parseFloat(field.substring('coefficient['.length, field.length - 1), 10);
        const newCoefficients = allValues.coefficient.map((ki, i) =>
            i < index ? Math.max(ki, value) : i === index ? value : Math.min(ki, value),
        );
        return { coefficient: newCoefficients };
    },
});

const MixerConvolution = ({ onChange }) => {
    const classes = useStyles();
    const [state, dispatch] = React.useReducer(stateReducer, initialState);

    const { coefficients } = state;

    console.log({ coefficients });
    // React.useEffect(() => {
    //     onChange(state);
    // }, [onChange, state]);

    const handleSliderChange = React.useCallback(
        (event, newValue, index) =>
            dispatch({ type: 'SET_VALUE', payload: { index, value: newValue } }),
        [dispatch],
    );

    const handleAddCoefficient = React.useCallback(() => {
        dispatch({ type: 'ADD_COEFFICIENT' });
    }, []);

    const handleDeleteCoefficient = React.useCallback(() => {
        dispatch({ type: 'REMOVE_COEFFICIENT' });
    }, []);

    const handleSubmit = (values) => {};

    return (
        <div>
            <div className={classes.root}>
                {coefficients.map((v, i) => (
                    <VerticalSlider
                        key={`coefficient-${i} `}
                        index={i}
                        value={v}
                        min={0}
                        max={100}
                        step={1}
                        onSliderChange={handleSliderChange}
                    />
                ))}
            </div>
            <div>
                <IconButton
                    aria-label="delete"
                    color="primary"
                    disabled={coefficients.length <= 1}
                    onClick={() => dispatch({ type: 'REMOVE_COEFFICIENT' })}
                >
                    <RemoveCoefficient />
                </IconButton>
                <IconButton
                    aria-label="add"
                    color="primary"
                    disabled={coefficients.length >= 21}
                    onClick={() => dispatch({ type: 'ADD_COEFFICIENT' })}
                >
                    <AddCoefficient />
                </IconButton>
            </div>
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
                        const { values } = form.getState();

                        return (
                            <div className={classes.form}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <FieldArray name="customers">
                                    {({ fields }) => (
                                        <>
                                            <div>
                                                {fields.map((v, i) => (
                                                    <Field
                                                        name={`coefficient-${i}`}
                                                        component={ProportionField}
                                                        unit=""
                                                        max="100"
                                                        step={1}
                                                    />
                                                ))}
                                            </div>
                                            <div>
                                                <IconButton
                                                    aria-label="delete"
                                                    color="primary"
                                                    disabled={coefficients.length <= 1}
                                                    onClick={() => fields.pop()}
                                                >
                                                    <RemoveCoefficient />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="add"
                                                    color="primary"
                                                    disabled={coefficients.length >= 21}
                                                    onClick={() => fields.push(0)}
                                                >
                                                    <AddCoefficient />
                                                </IconButton>
                                            </div>
                                        </>
                                    )}
                                </FieldArray>

                                {/* <div className={classes.root}>
                                    {values.coefficient.map((v, i) => (
                                        <Field
                                            name={`coefficient[${i}]`}
                                            component={ProportionField}
                                            unit=""
                                            max="100"
                                            step={1}
                                        />
                                    ))}
                                </div> */}

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
            </div>
        </div>
    );
};

export default MixerConvolution;
