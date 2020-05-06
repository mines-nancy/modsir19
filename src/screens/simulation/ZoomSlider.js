import React, { useState } from 'react';
import { makeStyles, Slider, useMediaQuery, useTheme, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    zoom: {
        display: 'flex',
        flexDirection: 'column',
        height: '95%',
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

export const useZoom = ({ min, max }) => {
    const logMin = Math.log(min);
    const logMax = Math.log(max);

    const scale = (logMax - logMin) / 100;
    const zoomToValue = (value) => Math.exp(logMin + scale * value);
    const valueToZoom = (value) => (Math.log(value) - logMin) / scale;

    const [innerValue, setInnerValue] = useState(valueToZoom(max));
    const [value, setValue] = useState(max);

    const handleChange = (commited) => (_, value) => {
        setInnerValue(value);

        if (commited) {
            setValue(zoomToValue(value));
        }
    };

    const setZoom = (value) => {
        setValue(value);
        setInnerValue(valueToZoom(value));
    };

    return {
        zoom: value,
        value: innerValue,
        handleChange,
        setZoom,
    };
};

export const ZoomSlider = ({ onChange, value }) => {
    const classes = useStyles();
    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className={classes.zoom}>
            <Tooltip title="Réduire la mise à l'échelle">
                <ZoomIn fontSize="small" />
            </Tooltip>
            <Slider
                classes={{ root: classes.zoomSlider, vertical: classes.zoomSlider }}
                orientation={small ? 'horizontal' : 'vertical'}
                value={value}
                max={100}
                min={0}
                onChangeCommitted={onChange(true)}
                onChange={onChange(false)}
                aria-labelledby="range-slider"
            />
            <Tooltip title="Augmenter la mise à l'échelle">
                <ZoomOut fontSize="small" />
            </Tooltip>
        </div>
    );
};
