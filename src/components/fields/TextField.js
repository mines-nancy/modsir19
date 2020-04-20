import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';

const TextField = ({
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    ...props
}) => (
    <MuiTextField
        {...props}
        inputProps={{ ...restInput, ...inputProps }}
        name={name}
        value={value}
        onChange={onChange}
    />
);

export default TextField;
