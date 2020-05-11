import React from 'react';
import { IconButton, createStyles, makeStyles } from '@material-ui/core';
import RemoveCoefficient from '@material-ui/icons/RemoveOutlined';
import AddCoefficient from '@material-ui/icons/AddOutlined';

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import VerticalProportionField from './VerticalProportionField';
import ProportionField from '../fields/ProportionField';
import AutoSave from '../fields/AutoSave';

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

const initialState = {
    coefficient: Array.from({ length: 5 }, (v, i) => 100),
    dms: 9,
};

const decorator = createDecorator({
    field: /coefficient\[\d+\]/, // when a field matching this pattern changes...
    updates: (value, field, allValues) => {
        // console.log({ value, field, allValues });
        const index = parseFloat(field.substring('coefficient['.length, field.length - 1), 10);
        const coefficient = allValues.coefficient;
        if (
            coefficient[index] >= coefficient[Math.max(0, index - 1)] ||
            coefficient[index] <= coefficient[Math.min(coefficient.length - 1, index + 1)]
        ) {
            const newCoefficients = coefficient.map((ki, i) =>
                i < index ? Math.max(ki, value) : i === index ? value : Math.min(ki, value),
            );
            return { coefficient: newCoefficients };
        }
        return { coefficient };
    },
});

const MixerConvolution = ({ onChange }) => {
    const classes = useStyles();

    const handleSubmit = (values) => { };

    return (
        <div>
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
            </div>
        </div>
    );
};

export default MixerConvolution;
