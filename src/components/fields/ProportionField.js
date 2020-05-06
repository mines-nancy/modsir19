import React from 'react';
import { Typography, Slider, makeStyles, TextField, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slider: {
        flex: '1 0 0',
        minWidth: 100,
    },
    numberContainer: {
        marginLeft: 24,
        flex: '0 0 65px',
    },
    number: {
        width: 65,
    },
    disabledNumber: {
        color: ({ forceDisabledColor }) =>
            !!forceDisabledColor ? theme.palette.text.primary : theme.palette.text.disabled,
    },
}));

const ProportionField = ({
    label,
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    numberInputLabel = '',
    unit = '%',
    min = '0',
    max = '100',
    step = '1',
    forceDisabledColor,
    helpText,
    ...props
}) => {
    const classes = useStyles({ forceDisabledColor });

    const handleSliderChange = (evt, value) => {
        onChange(value);
    };

    const handleTextFieldChange = (evt) => {
        onChange(parseFloat(evt.target.value));
    };

    return (
        <div>
            <div className={classes.formControl}>
                <div className={classes.slider}>
                    <Typography gutterBottom>{label}</Typography>
                    <Slider
                        {...props}
                        {...restInput}
                        {...inputProps}
                        value={value}
                        min={parseInt(min, 10)}
                        max={parseInt(max, 10)}
                        step={parseFloat(step)}
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
                        InputProps={{
                            classes: { disabled: classes.disabledNumber },
                            endAdornment: unit ? (
                                <InputAdornment position="end">{unit}</InputAdornment>
                            ) : undefined,
                        }}
                    />
                </div>
            </div>
            {helpText && <Typography variant="caption">{helpText}</Typography>}
        </div>
    );
};

export default ProportionField;
