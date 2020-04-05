import React, { useState } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

const Slider = ({
    name,
    lower_bd,
    upper_bd,
    param_step,
    color,
    param_value,
    param_setValue,
}) => {
    return (
        <Form>
            <Form.Group>
                <Form.Label>
                    Paramètre {name} : {param_value}
                </Form.Label>
                <RangeSlider
                    value={param_value}
                    min={lower_bd}
                    max={upper_bd}
                    step={param_step}
                    tooltip="auto"
                    tooltipPlacement="top"
                    onChange={(changeEvent) => param_setValue(changeEvent.target.value)}
                    variant={color}
                />
            </Form.Group>
        </Form>
    );
};

export default Slider