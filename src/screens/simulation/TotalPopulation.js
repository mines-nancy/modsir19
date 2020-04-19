import React from 'react';
import { Field } from 'react-final-form';

import TextField from '../../components/fields/TextField';
import DateField from '../../components/fields/DateField';
import NumberField from '../../components/fields/NumberField';
import ExpandableNumberField from '../../components/fields/ExpandableNumberField';
import ProportionField from '../../components/fields/ProportionField';

const TotalPopulation = ({ expanded, handleExpansionChange }) => {
    return (
        <Field
            name="population"
            label="Population totale"
            component={ExpandableNumberField}
            expanded={expanded}
            onChange={handleExpansionChange}
            step="100000"
        >
            <Field
                classes={{ root: 'small-margin-bottom' }}
                name="name"
                label="Nom de la période"
                component={TextField}
            />
            <Field
                className="small-margin-bottom"
                name="start_date"
                label="Début"
                component={DateField}
            />
            <Field
                className="small-margin-bottom"
                name="patient0"
                label="Patients infectés à J-0"
                component={NumberField}
                cardless
            />
            <Field
                name="kpe"
                label="Taux de population exposée"
                numberInputLabel="Kpe"
                component={ProportionField}
            />
        </Field>
    );
};

export default TotalPopulation;
