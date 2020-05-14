import React from 'react';
import { Slider } from '@material-ui/core';

const VerticalProportionField = ({
    label,
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    numberInputLabel = '',
    unit = '%',
    min = '0',
    max = '100',
    step = '1',
    ...props
}) => {
    const handleSliderChange = (evt, value) => {
        onChange(value);
    };

    return (
        <Slider
            {...props}
            {...restInput}
            {...inputProps}
            value={value}
            min={parseInt(min, 10)}
            max={parseInt(max, 10)}
            step={parseFloat(step)}
            onChange={handleSliderChange}
        />
    );
};

export default VerticalProportionField;
