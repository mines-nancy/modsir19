import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslate } from 'react-polyglot';
import FormikFormText from '../components/FormikFormText';

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
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        lambda: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 20.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 20.')
            .max(20, 'Veuillez entrer un nombre entre 0 et 20.')
            .required('Ce champs est obligatoire'),
        beta: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
    });

export const SIRForm = ({ onChange }) => {
    const classes = useStyles();
    const t = useTranslate();
    const initialValues = {
        s0: 0.7,
        lambda: 12,
        beta: 0.5,
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                onChange({
                    s0: parseFloat(values['s0']),
                    lambda: parseFloat(values['lambda']),
                    beta: parseFloat(values['beta']),
                });
            }}
            validationSchema={validationSchema()}
        >
            {(props) => (
                <Form>
                    <Grid
                        className={classes.grid}
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <FormControl className={classes.formControl}>
                            <Grid item>
                                <FormikFormText name="s0" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="lambda" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="beta" formikProps={props} />
                            </Grid>
                        </FormControl>
                        <Grid item>
                            <Button
                                className={classes.actions}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {t('form.compute')}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};
