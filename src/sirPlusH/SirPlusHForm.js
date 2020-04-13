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
        krd: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        r0: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 5.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 5.')
            .max(5, 'Veuillez entrer un nombre entre 0 et 5.')
            .required('Ce champs est obligatoire'),
        taux_tgs: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        taux_thr: Yup.number()
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
        krd: 0.5,
        r0: 2.3,
        taux_tgs: 0.81,
        taux_thr: 0.05,
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
                    krd: parseFloat(values['krd']),
                    r0: parseFloat(values['r0']),
                    taux_tgs: parseFloat(values['taux_tgs']),
                    taux_thr: parseFloat(values['taux_thr']),
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
                        justify="flex-start"
                        alignItems="center"
                    >
                        <FormikFormText name="population" formikProps={props} />
                        <FormikFormText name="kpe" formikProps={props} />
                        <FormikFormText name="r0" formikProps={props} />
                        <FormikFormText name="taux_tgs" formikProps={props} />
                        <FormikFormText name="taux_thr" formikProps={props} />
                        <FormikFormText name="krd" formikProps={props} />
                    </Grid>
                    <Grid
                        className={classes.grid}
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <FormikFormText name="tem" formikProps={props} />
                        <FormikFormText name="tmg" formikProps={props} />
                        <FormikFormText name="tmh" formikProps={props} />
                        <FormikFormText name="thg" formikProps={props} />
                        <FormikFormText name="thr" formikProps={props} />
                        <FormikFormText name="lim_time" formikProps={props} />
                    </Grid>
                    <Button
                        className={classes.actions}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {t('form.compute')}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
