import React from 'react';
import { Typography, Slider, makeStyles, TextField, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles({
    formControl: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    slider: {
        flex: 'O 0 auto',
    },
    numberContainer: {
        marginLeft: 24,
        flex: '0 0 65px',
    },
    number: {
        width: 65,
    },
});

const ProportionField = ({
    label,
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    numberInputLabel = '',
    unit = '%',
    min = '0',
    max = '100',
    step = '1',
    ...props
}) => {
    const classes = useStyles();

    const handleSliderChange = (evt, value) => {
        onChange(value);
    };

    const handleTextFieldChange = (evt) => {
        onChange(parseFloat(evt.target.value));
    };

    return (
        <div className={classes.formControl}>
            <div className={classes.slider}>
                <Typography gutterBottom>{label}</Typography>
                <Slider
                    {...props}
                    inputProps={{ ...restInput, ...inputProps }}
                    value={value}
                    min={parseInt(min, 10)}
                    max={parseInt(max, 10)}
                    step={step}
                    onChange={handleSliderChange}
                />
            </div>
            <div className={classes.numberContainer}>
                <TextField
                    {...props}
                    inputProps={{ ...restInput, min, max, step }}
                    name={name}
                    value={value}
                    onChange={handleTextFieldChange}
                    type="number"
                    label={numberInputLabel}
                    className={classes.number}
                    InputProps={
                        unit
                            ? {
                                  endAdornment: (
                                      <InputAdornment position="end">{unit}</InputAdornment>
                                  ),
                              }
                            : {}
                    }
                />
            </div>
        </div>
    );
};

export default ProportionField;
