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

export default function ComplexSIRSliders({ onChange }) {
    const classes = useStyles();

    const t = useTranslate();

    const [value_population, setValue_population] = React.useState(500000);
    const [value_kpe, setValue_kpe] = React.useState(0.6);
    const [value_krd, setValue_krd] = React.useState(0.5);
    const [value_r0, setValue_r0] = React.useState(2.3);
    const [value_taux_tgs, setValue_taux_tgs] = React.useState(0.81);
    const [value_taux_thr, setValue_taux_thr] = React.useState(0.05);
    const [value_tem, setValue_tem] = React.useState(6);
    const [value_tmg, setValue_tmg] = React.useState(9);
    const [value_tmh, setValue_tmh] = React.useState(6);
    const [value_thg, setValue_thg] = React.useState(6);
    const [value_thr, setValue_thr] = React.useState(1);
    const [value_trsr, setValue_trsr] = React.useState(10);
    const [value_lim_time, setValue_lim_time] = React.useState(250);

    const values = {
        population: value_population,
        kpe: value_kpe,
        krd: value_krd,
        r0: value_r0,
        taux_tgs: value_taux_tgs,
        taux_thr: value_taux_thr,
        tem: value_tem,
        tmg: value_tmg,
        tmh: value_tmh,
        thg: value_thg,
        thr: value_thr,
        trsr: value_trsr,
        lim_time: value_lim_time,
    };

    const setValues = {};

    setValues.population = setValue_population;
    setValues.kpe = setValue_kpe;
    setValues.krd = setValue_krd;
    setValues.r0 = setValue_r0;
    setValues.taux_tgs = setValue_taux_tgs;
    setValues.taux_thr = setValue_taux_thr;
    setValues.tem = setValue_tem;
    setValues.tmg = setValue_tmg;
    setValues.tmh = setValue_tmh;
    setValues.thg = setValue_thg;
    setValues.thr = setValue_thr;
    setValues.trsr = setValue_trsr;
    setValues.lim_time = setValue_lim_time;

    const handleSliderChange = (event, newValue, name) => {
        setValues[name](newValue);
        onChange({
            population: parseFloat(values.population),
            kpe: parseFloat(values.kpe),
            krd: parseFloat(values.krd),
            r0: parseFloat(values.r0),
            taux_tgs: parseFloat(values.taux_tgs),
            taux_thr: parseFloat(values.taux_thr),
            tem: parseFloat(values.tem),
            tmg: parseFloat(values.tmg),
            tmh: parseFloat(values.tmh),
            thg: parseFloat(values.thg),
            thr: parseFloat(values.thr),
            trsr: parseFloat(values.trsr),
            lim_time: parseFloat(values.lim_time),
        });
    };

    const handleInputChange = (event, name) => {
        if (event.target.value === '') {
            values.name = Number(event.target.value);
        }
    };

    const handleBlur = (event, name) => {
        if (event.target.value < event.target.min) {
            values.name = event.target.min;
        }
        if (event.target.value > event.target.max) {
            values.name = event.target.max;
        }
    };

    return (
        <Grid container direction="column" justify="right" alignItems="center">
            <Grid
                className={classes.grid}
                container
                direction="row"
                justify="right"
                alignItems="center"
            >
                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre population
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="population"
                                className={classes.slider}
                                value={values.population}
                                min={1}
                                max={1000000}
                                step={1}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'population')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="population"
                                className={classes.input}
                                value={values.population}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'population')}
                                onBlur={(event, newValue, name) =>
                                    handleBlur(event, newValue, 'population')
                                }
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 1000000,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre kpe
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="kpe"
                                className={classes.slider}
                                value={values.kpe}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'kpe')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="kpe"
                                className={classes.input}
                                value={values.kpe}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'kpe')}
                                onBlur={(event, name) => handleBlur(event, 'kpe')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 1,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre r0
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="r0"
                                className={classes.slider}
                                value={values.r0}
                                min={0}
                                max={5}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'r0')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="r0"
                                className={classes.input}
                                value={values.r0}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'r0')}
                                onBlur={(event, name) => handleBlur(event, 'r0')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 5,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre taux_tgs
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="taux_tgs"
                                className={classes.slider}
                                value={values.taux_tgs}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'taux_tgs')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="taux_tgs"
                                className={classes.input}
                                value={values.taux_tgs}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'taux_tgs')}
                                onBlur={(event, name) => handleBlur(event, 'taux_tgs')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 1,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre taux_thr
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="taux_thr"
                                className={classes.slider}
                                value={values.taux_thr}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'taux_thr')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="taux_thr"
                                className={classes.input}
                                value={values.taux_thr}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'taux_thr')}
                                onBlur={(event, name) => handleBlur(event, 'taux_thr')}
                                inputProps={{
                                    step: 0,
                                    min: 1,
                                    max: 0.01,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre krd
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="krd"
                                className={classes.slider}
                                value={values.krd}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'krd')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="krd"
                                className={classes.input}
                                value={values.krd}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'krd')}
                                onBlur={(event, name) => handleBlur(event, 'krd')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 1,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                className={classes.grid}
                container
                direction="row"
                justify="right"
                alignItems="center"
            >
                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre tem
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="tem"
                                className={classes.slider}
                                value={values.tem}
                                min={0}
                                max={100}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'tem')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="tem"
                                className={classes.input}
                                value={values.tem}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'tem')}
                                onBlur={(event, newValue, name) =>
                                    handleBlur(event, newValue, 'tem')
                                }
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre tmg
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="tmg"
                                className={classes.slider}
                                value={values.tmg}
                                min={0}
                                max={100}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'tmg')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="tmg"
                                className={classes.input}
                                value={values.tmg}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'tmg')}
                                onBlur={(event, name) => handleBlur(event, 'tmg')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre tmh
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="tmh"
                                className={classes.slider}
                                value={values.tmh}
                                min={0}
                                max={100}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'tmh')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="tmh"
                                className={classes.input}
                                value={values.tmh}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'tmh')}
                                onBlur={(event, name) => handleBlur(event, 'tmh')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre thg
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="thg"
                                className={classes.slider}
                                value={values.thg}
                                min={0}
                                max={100}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'thg')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="thg"
                                className={classes.input}
                                value={values.krd}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'thg')}
                                onBlur={(event, name) => handleBlur(event, 'thg')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Paramètre thr
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="thr"
                                className={classes.slider}
                                value={values.lambda}
                                min={0}
                                max={100}
                                step={0.01}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'thr')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="thr"
                                className={classes.input}
                                value={values.thr}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'thr')}
                                onBlur={(event, name) => handleBlur(event, 'thr')}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        Nombre de jours
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                name="taux_thr"
                                className={classes.slider}
                                value={values.lim_time}
                                min={0}
                                max={1000}
                                step={1}
                                onChange={(event, newValue, name) =>
                                    handleSliderChange(event, newValue, 'lim_time')
                                }
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                name="lim_time"
                                className={classes.input}
                                value={values.lim_time}
                                margin="dense"
                                onChange={(event, name) => handleInputChange(event, 'lim_time')}
                                onBlur={(event, name) => handleBlur(event, 'lim_time')}
                                inputProps={{
                                    step: 0,
                                    min: 1,
                                    max: 1000,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
