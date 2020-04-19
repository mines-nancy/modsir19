import React, { useState } from 'react';
import { Field } from 'react-final-form';

import ExpandableNumberField from '../../../components/fields/ExpandableNumberField';
import NumberField from '../../../components/fields/NumberField';
import ProportionField from '../../../components/fields/ProportionField';
import DateField from '../../../components/fields/DateField';

export default () => {
    const [expanded, setExpanded] = useState(false);
    const handleExpansionChange = (evt, value) => setExpanded(value);

    return (
        <Field
            name="population"
            label="Population totale"
            component={ExpandableNumberField}
            expanded={expanded}
            onChange={handleExpansionChange}
            step="100000"
        >
            <Field className="small-margin-bottom" name="j_0" label="Début" component={DateField} />
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
