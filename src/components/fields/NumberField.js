import clsx from 'clsx';
import React from 'react';
import { TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    label: {
        flex: '1 0 0',
        display: 'flex',
        alignItems: 'center',
        paddingRight: 24,
    },
    fieldContainer: {
        flex: (props) => (props.numberWidth ? `0 0 ${props.numberWidth}px` : '0 0 80px'),
    },
    field: {
        width: (props) => props.numberWidth || 80,
    },
});

const NumberField = ({
    label,
    step = '1',
    input: { name, onChange, value, ...restInput },
    className,
    ...props
}) => {
    const classes = useStyles(props);

    return (
        <label className={clsx(classes.container, className)}>
            <div className={classes.label}>{label}</div>
            <div className={classes.fieldContainer}>
                <TextField
                    inputProps={{ ...restInput, min: '0', step }}
                    {...props}
                    className={classes.field}
                    name={name}
                    value={value}
                    onChange={onChange}
                    type="number"
                />
            </div>
        </label>
    );
};

export default NumberField;
