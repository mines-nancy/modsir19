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
        population: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        kpe: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        kem: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        kmg: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        khr: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        krd: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        tem: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        tmg: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        tmh: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        thg: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        thr: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        trsr: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        lim_time: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
    });

export const SIRForm = ({ onChange }) => {
    const classes = useStyles();
    const t = useTranslate();
    const initialValues = {
        population: 500000,
        kpe: 0.6,
        kem: 0.24,
        kmg: 0.81,
        khr: 0.7,
        krd: 1,
        tem: 6,
        tmg: 9,
        tmh: 6,
        thg: 6,
        thr: 1,
        trsr: 10,
        lim_time: 250,
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                onChange({
                    population: parseFloat(values['population']),
                    kpe: parseFloat(values['kpe']),
                    kem: parseFloat(values['kem']),
                    kmg: parseFloat(values['kmg']),
                    khr: parseFloat(values['khr']),
                    krd: parseFloat(values['krd']),
                    tem: parseFloat(values['tem']),
                    tmg: parseFloat(values['tmg']),
                    tmh: parseFloat(values['tmh']),
                    thg: parseFloat(values['thg']),
                    thr: parseFloat(values['thr']),
                    trsr: parseFloat(values['trsr']),
                    lim_time: parseFloat(values['lim_time']),
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
                                <FormikFormText name="population" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="kpe" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="kem" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="kmg" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="khr" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="krd" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="tem" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="tmg" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="tmh" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="thg" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="thr" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="trsr" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="lim_time" formikProps={props} />
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
