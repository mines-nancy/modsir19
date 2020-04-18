import React from 'react';
import { InputAdornment } from '@material-ui/core';

import NumberField from './NumberField';

const DurationField = (props) => (
    <NumberField
        {...props}
        InputProps={{
            endAdornment: <InputAdornment position="end">Jours</InputAdornment>,
        }}
    />
);

export default DurationField;
