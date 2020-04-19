import clsx from 'clsx';
import React from 'react';
import { Card, CardContent, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        maxWidth: (props) => props.width || 350,
        backgroundColor: (props) => props.color,
    },
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
    cardless = false,
    className,
    ...props
}) => {
    const classes = useStyles(props);

    const cardContent = (
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

    if (cardless) {
        return cardContent;
    }

    return (
        <Card className={classes.card} elevation={3}>
            <CardContent>{cardContent}</CardContent>
        </Card>
    );
};

export default NumberField;
