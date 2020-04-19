import React from 'react';
import { useField } from 'react-final-form';
import { Popover, Slider, makeStyles } from '@material-ui/core';
import { Percent } from './Percent';

const useStyles = makeStyles(() => ({
    pie: {
        position: 'relative',
        padding: '15px 0',
        fontSize: 13,
        cursor: 'pointer',
        transition: 'transform .3s ease-in-out',
        zIndex: 2,
        '&:hover': {
            transform: 'scale(1.3)',
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
}));

export const SwitchPercentField = ({ leftName, rightName, leftLabel, rightLabel }) => {
    const classes = useStyles();

    const { input: input1 } = useField(leftName);
    const { input: input2 } = useField(rightName);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [innerValue, setInnerValue] = React.useState(input2.value);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleChange = (_, value) => setInnerValue(value);

    const handleChangeCommitted = (_, value) => {
        input1.onChange(100 - value);
        input2.onChange(value);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div className={classes.pie} onClick={handleClick}>
                <div className={classes.innerPie}>
                    <div style={{ paddingRight: 5, paddingBottom: 2 }}>{input1.value}%</div>
                    <div>
                        <Percent percent={innerValue} />
                    </div>
                    <div style={{ paddingLeft: 5, paddingBottom: 2 }}>{input2.value}%</div>
                </div>
            </div>
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
                        <span style={{ float: 'left' }}>
                            {leftLabel}: {100 - innerValue}%
                        </span>
                        <span style={{ float: 'right' }}>
                            {rightLabel}: {innerValue}%
                        </span>
                    </div>
                    <Slider
                        value={innerValue}
                        step={1}
                        min={0}
                        max={100}
                        onChangeCommitted={handleChangeCommitted}
                        onChange={handleChange}
                        track={false}
                    />
                </div>
            </Popover>
        </>
    );
};
