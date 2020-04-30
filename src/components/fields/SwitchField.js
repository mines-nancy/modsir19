import React from 'react';
import { Switch } from '@material-ui/core';

const SwitchField = ({
    input: { name, onChange, checked, ...restInput },
    inputProps = {},
    ...props
}) => (
    <Switch
        color="primary"
        {...props}
        inputProps={{ ...restInput, ...inputProps }}
        name={name}
        checked={checked}
        onChange={onChange}
    />
);

export default SwitchField;
