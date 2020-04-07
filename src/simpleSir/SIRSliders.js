import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { useTranslate } from 'react-polyglot';
import { Formik, Form } from 'formik';

const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
    slider: {
        width: 150,
    },
});

export default function Sliders({ onChange }) {
    const classes = useStyles();

    const t = useTranslate();
    const initialValues = {
        s0: 0.7,
        lambda: 12,
        beta: 0.5,
    };


    const [value_s0, setValue_s0] = React.useState(0);
    const [value_lambda, setValue_lambda] = React.useState(1);
    const [value_beta, setValue_beta] = React.useState(0);

    const s0 = { step: 0.01, min: 0, max: 1 };
    const lambda = { step: 1, min: 1, max: 20 };
    const beta = { step: 0.01, min: 0, max: 1 };

    const handleSliderChange_s0 = (event, newValue) => {
        setValue_s0(newValue);
        onChange({
            s0: parseFloat(value_s0),
            lambda: parseFloat(value_lambda),
            beta: parseFloat(value_beta),
        });
    };

    const handleInputChange_s0 = (event) => {
        setValue_s0(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur_s0 = (value_s0) => {
        if (value_s0 < s0.min) {
            setValue_s0(s0.min);
        } else if (value_s0 > s0.max) {
            setValue_s0(s0.max);
        }
    };

    const handleSliderChange_lambda = (event, newValue) => {
        setValue_lambda(newValue);
        onChange({
            s0: parseFloat(value_s0),
            lambda: parseFloat(value_lambda),
            beta: parseFloat(value_beta),
        });
    };

    const handleInputChange_lambda = (event) => {
        setValue_lambda(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur_lambda = (value_lambda) => {
        if (value_lambda < lambda.min) {
            setValue_lambda(lambda.min);
        } else if (value_lambda > lambda.max) {
            setValue_lambda(lambda.max);
        }
    };

    const handleSliderChange_beta = (event, newValue) => {
        setValue_beta(newValue);
        onChange({
            s0: parseFloat(value_s0),
            lambda: parseFloat(value_lambda),
            beta: parseFloat(value_beta),
        });
    };

    const handleInputChange_beta = (event) => {
        setValue_beta(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur_beta = (value_beta) => {
        if (value_beta < beta.min) {
            setValue_beta(0);
        } else if (value_beta > 1) {
            setValue_beta(beta.max);
        }
    };

    return (
        <Grid
            className={classes.grid}
            container
            direction="column"
            justify="right"
            alignItems="center"
        >
            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre s0
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <Slider
                            className={classes.slider}
                            value={typeof value_s0 === 'number' ? value_s0 : s0.min}
                            min={s0.min}
                            max={s0.max}
                            step={s0.step}
                            onChange={handleSliderChange_s0}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Input
                            className={classes.input}
                            value={value_s0}
                            margin="dense"
                            onChange={handleInputChange_s0}
                            onBlur={handleBlur_s0(value_s0)}
                            inputProps={{
                                step: s0.step,
                                min: s0.min,
                                max: s0.max,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre lambda
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            className={classes.slider}
                            value={typeof value_lambda === 'number' ? value_lambda : lambda.max}
                            min={lambda.min}
                            max={lambda.max}
                            step={lambda.step}
                            onChange={handleSliderChange_lambda}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
                            value={value_lambda}
                            margin="dense"
                            onChange={handleInputChange_lambda}
                            onBlur={handleBlur_lambda(value_lambda)}
                            inputProps={{
                                step: lambda.step,
                                min: lambda.min,
                                max: lambda.max,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre beta
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            className={classes.slider}
                            value={typeof value_beta === 'number' ? value_beta : 0}
                            min={beta.min}
                            max={beta.max}
                            step={beta.step}
                            onChange={handleSliderChange_beta}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
                            value={value_beta}
                            margin="dense"
                            onChange={handleInputChange_beta}
                            onBlur={handleBlur_beta(value_beta)}
                            inputProps={{
                                step: beta.step,
                                min: beta.min,
                                max: beta.max,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
