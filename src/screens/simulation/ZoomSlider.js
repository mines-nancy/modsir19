import React, { useState } from 'react';
import { makeStyles, Slider, useMediaQuery, useTheme } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    zoom: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row-reverse',
        },
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    zoomSlider: {
        [theme.breakpoints.down('sm')]: {
            width: '85% !important',
        },
        [theme.breakpoints.up('sm')]: {
            height: '80% !important',
        },
    },
}));

export const ZoomSlider = ({ onChange, initValue, min, max }) => {
    var logMin = Math.log(min);
    var logMax = Math.log(max);
    const scale = (logMax - logMin) / 100;
    const zoomToValue = (value) => Math.exp(logMin + scale * value);
    const valueToZoom = (value) => (Math.log(value) - logMin) / scale;

    const [innerMax, setInnerMax] = useState(valueToZoom(initValue));
    const classes = useStyles();

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (commited) => (_, value) => {
        setInnerMax(value);
        commited && onChange(zoomToValue(value));
    };

    return (
        <div className={classes.zoom}>
            <ZoomIn fontSize="small" />
            <Slider
                classes={{ root: classes.zoomSlider, vertical: classes.zoomSlider }}
                orientation={small ? 'horizontal' : 'vertical'}
                value={innerMax}
                max={100}
                min={0}
                onChangeCommitted={handleChange(true)}
                onChange={handleChange(false)}
                aria-labelledby="range-slider"
            />
            <ZoomOut fontSize="small" />
        </div>
    );
};
