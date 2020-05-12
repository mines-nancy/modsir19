import React from 'react';
import { Checkbox } from '@material-ui/core';

const CheckboxField = ({
    className,
    input: { name, onChange, checked, ...restInput },
    inputProps = {},
    ...props
}) => {
    return (
        <Checkbox
            color="primary"
            {...props}
            inputProps={{ ...restInput, ...inputProps }}
            name={name}
            checked={checked}
            onChange={onChange}
        />
    );
};

export default CheckboxField;
