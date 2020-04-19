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
                name="r"
                label="Proportion de contacts effectifs"
                numberInputLabel="r"
                component={ProportionField}
                unit={null}
                max="5"
                step={0.1}
            />
            <Field
                name="beta"
                label="Taux d'infection en individus"
                numberInputLabel="beta"
                component={ProportionField}
                unit={null}
                max="1"
                step={0.01}
            />
        </CardContent>
    );
};

export default ExposedPopulation;
