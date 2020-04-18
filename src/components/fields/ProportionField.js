import React from 'react';
import { Typography, Slider, makeStyles, TextField, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles({
    formControl: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    slider: {
        flex: '1 0 0',
    },
    numberContainer: {
        flex: '0 0 auto',
    },
    number: {
        maxWidth: 100,
    },
});

const ProportionField = ({
    label,
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    numberInputLabel = '',
    ...props
}) => {
    const classes = useStyles();

    const handleSliderChange = (evt, value) => {
        onChange(value);
    };

    return (
        <div>
            <div className={classes.formControl}>
                <div lassName={classes.slider}>
                    <Typography gutterBottom>{label}</Typography>
                    <Slider
                        {...props}
                        inputProps={{ ...restInput, ...inputProps }}
                        value={value}
                        onChange={handleSliderChange}
                    />
                </div>
                <div className={classes.numberContainer}>
                    <TextField
                        {...props}
                        inputProps={{ ...restInput, min: '0', step: '100' }}
                        name={name}
                        value={value}
                        onChange={onChange}
                        type="number"
                        label={numberInputLabel}
                        className={classes.number}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProportionField;
