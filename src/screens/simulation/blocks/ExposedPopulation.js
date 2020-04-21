import React from 'react';
import { CardContent, Typography, makeStyles } from '@material-ui/core';
import { Field } from 'react-final-form';

import ProportionField from '../../../components/fields/ProportionField';

const useStyles = makeStyles({
    title: {
        marginBottom: 16,
    },
});

const ExposedPopulation = () => {
    const classes = useStyles();

    return (
        <CardContent>
            <Typography variant="h6" className={classes.title}>
                Population saine exposée
            </Typography>
            <Field
                name="r0"
                label="Nombre moyen de personnes qui seront infectées au contact d'une personne contagieuse"
                numberInputLabel="R0"
                component={ProportionField}
                unit={null}
                max="5"
                step={0.1}
            />
        </CardContent>
    );
};

export default ExposedPopulation;
