import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const DateField = ({
    label,
    input: { name, onChange, value, ...restInput },
    inputProps = {},
    className,
    ...props
}) => (
    <div className={className}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                {...props}
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                id="date-picker-inline"
                label={label}
                value={value}
                onChange={onChange}
                inputProps={{ ...restInput, ...inputProps }}
            />
        </MuiPickersUtilsProvider>
    </div>
);

export default DateField;
