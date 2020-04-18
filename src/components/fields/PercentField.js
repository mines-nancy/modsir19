import React from 'react';
import { Popover, Slider } from '@material-ui/core';
import { Percent } from './Percent';

export const PercentField = ({ input: { name, onChange, value } }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [innerValue, setInnerValue] = React.useState(value);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleChange = (_, value) => setInnerValue(value);

    const handleChangeCommitted = (_, value) => {
        onChange(value);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div onClick={handleClick}>
                <Percent percent={value} />
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
                <div style={{ width: 300, padding: '40px 20px 20px 20px', background: 'white' }}>
                    <Slider
                        value={innerValue}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        min={0}
                        max={100}
                        onChangeCommitted={handleChangeCommited}
                        onChange={handleChange}
                    />
                </div>
            </Popover>
        </>
    );
};
