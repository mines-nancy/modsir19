import React from 'react';
import { useField } from 'react-final-form';
import { Popover, Slider, makeStyles } from '@material-ui/core';
import { Percent } from './Percent';

const useStyles = makeStyles(() => ({
    pie: {
        position: 'relative',
        padding: '15px 0',
        fontSize: 13,
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '&:not(.disabled)': {
            cursor: 'pointer',
            transition: 'transform .3s ease-in-out',
            '&:hover, &.open': {
                transform: 'scale(1.3)',
            },
        },
    },
    innerPie: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#eee',
    },
    sliderLabels: {
        width: 350,
        padding: '20px 20px 20px 20px',
        background: 'white',
    },
    rail: {
        opacity: 1,
        backgroundColor: (props) => props.rightColor,
    },
    track: {
        backgroundColor: (props) => props.leftColor,
    },
    mark: {
        backgroundColor: (props) => props.leftColor,
    },
    markActive: { backgroundColor: 'currentColor' },
    valueLeft: { paddingRight: 5, paddingBottom: 2 },
    valueRight: { paddingLeft: 5, paddingBottom: 2 },
    sliderLeft: {
        float: 'left',
        '& > .colored': {
            color: (props) => props.leftColor,
        },
    },
    sliderRight: {
        float: 'right',
        '& > .colored': { color: (props) => props.rightColor },
    },
}));

export const SwitchPercentField = (props) => {
    const classes = useStyles(props);
    const { leftName, rightName, leftLabel, rightLabel, leftColor, disabled } = props;

    const { input: input1 } = useField(leftName);
    const { input: input2 } = useField(rightName);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [innerValue, setInnerValue] = React.useState(input1.value);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleChange = (_, value) => setInnerValue(value);

    const handleChangeCommitted = (_, value) => {
        input1.onChange(value);
        input2.onChange(100 - value);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <div
                className={`${classes.pie} ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={handleClick}
            >
                <div className={classes.innerPie}>
                    <div className={classes.valueLeft}>{input1.value}%</div>
                    <div>
                        <Percent percent={innerValue} />
                    </div>
                    <div className={classes.valueRight}>{input2.value}%</div>
                </div>
            </div>
            {!disabled && (
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={classes.sliderLabels}>
                        <div>
                            <span className={classes.sliderLeft}>
                                {leftLabel}: <span class="colored">{innerValue}%</span>
                            </span>
                            <span className={classes.sliderRight}>
                                {rightLabel}: <span class="colored">{100 - innerValue}%</span>
                            </span>
                        </div>
                        <Slider
                            classes={classes}
                            value={innerValue}
                            step={1}
                            min={0}
                            max={100}
                            onChangeCommitted={handleChangeCommitted}
                            onChange={handleChange}
                            track={!!leftColor}
                        />
                    </div>
                </Popover>
            )}
        </div>
    );
};
