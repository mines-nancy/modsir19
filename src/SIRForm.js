import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControl, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        grid: {
            // paddingLeft: '2em',
            // paddingRight: '2em',
        },
        actions: {
            float: 'left',
            margin: theme.spacing(1),
        },
        textField: {
            // padding: theme.spacing(2),
            // textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

const validationSchema = (t) =>
    Yup.object().shape({
        s0: Yup.number()
            .typeError('error.shouldBeNumber')
            .positive('error.positiveNumber')
            .min(0, 'error.tooSmall')
            .max(1, 'error.tooLarge')
            .required('error.required'),
        lambda: Yup.number()
            .typeError('error.shouldBeNumber')
            .positive('error.positiveNumber')
            .min(0, 'error.tooSmall')
            .max(20, 'error.tooLarge')
            .required('error.required'),
        beta: Yup.number()
            .typeError('error.shouldBeNumber')
            .positive('error.positiveNumber')
            .min(0, 'error.tooSmall')
            .max(1, 'error.tooLarge')
            .required('error.required'),
    });

export const SIRForm = ({ onChange }) => {
    const classes = useStyles();

    const initialValues = {
        s0: '0.7',
        lambda: '12',
        beta: '0.5',
    };

    const name_s0 = 's0';
    const name_lambda = 'lambda';
    const name_beta = 'beta';

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                onChange({ s0: values['s0'], lambda: values['lambda'], beta: values['beta'] });
            }}
            validationSchema={validationSchema()}
        >
            {({ values, touched, errors, handleChange, handleBlur }) => (
                <Form>
                    <Grid
                        className={classes.grid}
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <FormControl className={classes.formControl}>
                            <TextField
                                className={classes.textField}
                                name={name_s0}
                                label={'Parametre s0'}
                                value={values[name_s0]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={errors[name_s0] && touched[name_s0] && errors[name_s0]}
                                error={Boolean(errors[name_s0] && touched[name_s0])}
                            ></TextField>
                            <TextField
                                className={classes.textField}
                                name={name_lambda}
                                label={'Parametre lambda'}
                                value={values[name_lambda]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    errors[name_lambda] &&
                                    touched[name_lambda] &&
                                    errors[name_lambda]
                                }
                                error={Boolean(errors[name_lambda] && touched[name_lambda])}
                            ></TextField>
                            <TextField
                                className={classes.textField}
                                name={name_beta}
                                label={'Parametre beta'}
                                value={values[name_beta]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    errors[name_beta] && touched[name_beta] && errors[name_beta]
                                }
                                error={Boolean(errors[name_beta] && touched[name_beta])}
                            ></TextField>
                        </FormControl>
                    </Grid>
                    <Button
                        className={classes.actions}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Calculer
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
