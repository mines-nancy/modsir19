import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { useTranslate } from 'react-polyglot';

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

    const s0 = { step: 0.01, min: 0, max: 1 };
    const lambda = { step: 1, min: 1, max: 20 };
    const beta = { step: 0.01, min: 0, max: 1 };

    const params = { s0: s0, lambda: lambda, beta: beta };

    const [value_s0, setValue_s0] = React.useState(params['s0']['min']) ;
    const [value_lambda, setValue_lambda] = React.useState(params['lambda']['min']) ;
    const [value_beta, setValue_beta] = React.useState(params['beta']['min']) ;

    params['s0']['value'] = value_s0 ;
    params['s0']['setValue'] = setValue_s0 ;
    params['lambda']['value'] = value_lambda ;
    params['lambda']['setValue'] = setValue_lambda ;
    params['beta']['value'] = value_beta ;
    params['beta']['setValue'] = setValue_beta ;
    

    for (const param in params) {
        params[param]['handleSliderChange'] = (event, newValue) => {
            params[param]['setValue'](newValue);
            onChange({
                s0: parseFloat(params['s0']['value']),
                lambda: parseFloat(params['lambda']['value']),
                beta: parseFloat(params['beta']['value']),
            });

            params[param]['handleInputChange'] = (event) => {
                params[param]['setValue'](
                    event.target.value === '' ? '' : Number(event.target.value),
                );
            };

            params[param]['handleBlur'] = (event, param) => {
                if (params[param]['value'] < params[param]['min']) {
                    params['param']['setValue'](params[param]['min']);
                } else if (params[param]['value'] > params[param]['max']) {
                    params[param]['setValue'](params[param]['max']);
                }
            };
        };
    }

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
                            value={
                                typeof params['s0']['value'] === 'number'
                                    ? params['s0']['value']
                                    : params['s0']['min']
                            }
                            min={params['s0']['min']}
                            max={params['s0']['max']}
                            step={params['s0']['step']}
                            onChange={params['s0']['handleSliderChange']}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Input
                            className={classes.input}
                            value={params['s0']['value']}
                            margin="dense"
                            onChange={params['s0']['handleInputChange']}
                            onBlur={params['s0']['handleBlur']}
                            inputProps={{
                                step: params['s0']['step'],
                                min: params['s0']['min'],
                                max: params['s0']['max'],
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
                            value={typeof params['lambda']['value'] === 'number' ? params['lambda']['value'] : params['lambda']['max']}
                            min={params['lambda']['min']}
                            max={params['lambda']['max']}
                            step={params['lambda']['step']}
                            onChange={params['lambda']['handleSliderChange']}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
                            value={params['lambda']['value']}
                            margin="dense"
                            onChange={params['lambda']['handleInputChange']}
                            onBlur={params['lambda']['handleBlur']}
                            inputProps={{
                                step: params['lambda']['step'],
                                min: params['lambda']['min'],
                                max: params['lambda']['max'],
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
                            value={typeof params['beta']['value'] === 'number' ? params['beta']['value']: 0}
                            min={params['beta']['min']}
                            max={params['beta']['max']}
                            step={params['beta']['step']}
                            onChange={params['beta']['handleSliderChange']}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
                            value={params['beta']['value']}
                            margin="dense"
                            onChange={params['beta']['handleInputChange']}
                            onBlur={params['beta']['handleBlur']}
                            inputProps={{
                                step: params['beta']['step'],
                                min: params['beta']['min'],
                                max: params['beta']['max'],
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
