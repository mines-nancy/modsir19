import React from 'react';
import { CardContent } from '@material-ui/core';
import { Field } from 'react-final-form';

import DurationField from '../../../components/fields/DurationField';

const AverageDuration = ({ name, label }) => {
    return (
        <CardContent>
            <Field name={name} label={label} component={DurationField} />
        </CardContent>
    );
};

export default AverageDuration;
