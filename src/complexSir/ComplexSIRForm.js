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
        Kpe: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        Kei: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        Kir: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        Khic: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        Ked: Yup.number()
            .typeError('Veuillez entrer un nombre')
            .positive('Veuillez entrer un nombre entre 0 et 1.')
            .min(0, 'Veuillez entrer un nombre entre 0 et 1.')
            .max(1, 'Veuillez entrer un nombre entre 0 et 1.')
            .required('Ce champs est obligatoire'),
        Tei: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        Tir: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        Tih: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        Thr: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),
        Thic: Yup.number()
            .typeError('Veuillez entrer un nombre entier positif')
            .positive('Veuillez entrer un nombre positif.')
            .min(0, 'Veuillez entrer un nombre positif.')
            .required('Ce champs est obligatoire'),    
        Tice: Yup.number()
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
        Kpe: 0.6,
        Kei: 0.24,
        Kir: 0.81,
        Kih: 1 - 0.81,
        Khic: 0.7,
        Khr: 1 - 0.7,
        Ked: 1,
        Ker: 1 - 1,
        Tei: 6,
        Tir: 9,
        Tih: 6,
        Thr: 6,
        Thic: 1,
        Tice: 10,
        lim_time: 250,
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                onChange({
                    population: parseFloat(values['population']),
                    Kpe: parseFloat(values['Kpe']),
                    Kei: parseFloat(values['Kei']),
                    Kir: parseFloat(values['Kir']),
                    Kih: parseFloat(values['Kih']),
                    Khic: parseFloat(values['Khic']),
                    Khr: parseFloat(values['Khr']),
                    Ked: parseFloat(values['Ked']),
                    Ker: parseFloat(values['Ker']),
                    Tei: parseFloat(values['Tei']),
                    Tir: parseFloat(values['Tir']),
                    Tih: parseFloat(values['Tih']),
                    Thr: parseFloat(values['Thr']),
                    Thic: parseFloat(values['Thic']),
                    Tice: parseFloat(values['Tice']),
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
                                <FormikFormText name="Kpe" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Kei" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Kir" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Kih" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Khic" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Khr" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Ked" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Ker" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Tei" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Tir" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Tih" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Thr" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Thic" formikProps={props} />
                            </Grid>
                            <Grid item>
                                <FormikFormText name="Tice" formikProps={props} />
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
