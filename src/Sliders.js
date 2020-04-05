import React, { useState } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export const Sliders = () => {
    // Kpe, Kei, Kir, Kih, Khic, Khr, Ked, Ker, Tei, Tir, Tih, Thr, Thic, lim_time)

    const [value_Kpe, setValue_Kpe] = useState(0.5);
    const [value_Kei, setValue_Kei] = useState(12);
    const [value_Kir, setValue_Kir] = useState(0.5);
    const [value_Kih, setValue_Kih] = useState(0.5);
    const [value_Khic, setValue_Khic] = useState(0.5);
    const [value_Khr, setValue_Khr] = useState(0.5);
    const [value_Ked, setValue_Ked] = useState(0.5);
    const [value_Ker, setValue_Ker] = useState(0.5);
    const [value_Tei, setValue_Tei] = useState(0.5);
    const [value_Tir, setValue_Tir] = useState(0.5);
    const [value_Tih, setValue_Tih] = useState(0.5);
    const [value_Thr, setValue_Thr] = useState(0.5);
    const [value_Thic, setValue_Thic] = useState(0.5);
    const [value_lim_time, setValue_lim_time] = useState(0.5);

    const classes = useStyles();

    return (
        <div style={{ width: 900 }} className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>Réglage des paramètres du modèle</Paper>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Kpe : {value_Kpe}</Form.Label>
                            <RangeSlider
                                value={value_Kpe}
                                min={0}
                                max={1}
                                step={0.1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Kpe(changeEvent.target.value)}
                                variant="primary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Kei : {value_Kei}</Form.Label>
                            <RangeSlider
                                value={value_Kei}
                                min={0}
                                max={1}
                                step={0.1}
                                size={10}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Kei(changeEvent.target.value)}
                                variant="primary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Kir : {value_Kir}</Form.Label>
                            <RangeSlider
                                value={value_Kir}
                                min={0}
                                max={1}
                                step={0.1}
                                size={10}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Kir(changeEvent.target.value)}
                                variant="primary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Kih : {value_Kih}</Form.Label>
                            <RangeSlider
                                value={value_Kih}
                                min={0}
                                max={1}
                                step={0.1}
                                size={10}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Kih(changeEvent.target.value)}
                                variant="primary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Khic : {value_Khic}</Form.Label>
                            <RangeSlider
                                value={value_Khic}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Khic(changeEvent.target.value)}
                                variant="secondary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Khr : {value_Khr}</Form.Label>
                            <RangeSlider
                                value={value_Khr}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Khr(changeEvent.target.value)}
                                variant="secondary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Ked : {value_Ked}</Form.Label>
                            <RangeSlider
                                value={value_Ked}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Ked(changeEvent.target.value)}
                                variant="secondary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Ker : {value_Ker}</Form.Label>
                            <RangeSlider
                                value={value_Ker}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Ker(changeEvent.target.value)}
                                variant="secondary"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Tei : {value_Tei}</Form.Label>
                            <RangeSlider
                                value={value_Tei}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Tei(changeEvent.target.value)}
                                variant="warning"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Tir : {value_Tir}</Form.Label>
                            <RangeSlider
                                value={value_Tir}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Tir(changeEvent.target.value)}
                                variant="warning"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Tih : {value_Tih}</Form.Label>
                            <RangeSlider
                                value={value_Tih}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Tih(changeEvent.target.value)}
                                variant="warning"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Thr : {value_Thr}</Form.Label>
                            <RangeSlider
                                value={value_Thr}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Thr(changeEvent.target.value)}
                                variant="warning"
                            />
                        </Form.Group>
                    </Form>
                </Grid>


                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre Thic : {value_Thic}</Form.Label>
                            <RangeSlider
                                value={value_Thic}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_Thic(changeEvent.target.value)}
                                variant="info"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Paramètre lim_time : {value_lim_time}</Form.Label>
                            <RangeSlider
                                value={value_lim_time}
                                min={1}
                                max={20}
                                step={1}
                                tooltip="auto"
                                tooltipPlacement="top"
                                onChange={(changeEvent) => setValue_lim_time(changeEvent.target.value)}
                                variant="info"
                            />
                        </Form.Group>
                    </Form>
                </Grid>

                <Grid item xs={3}></Grid>

                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    );
};
