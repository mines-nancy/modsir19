import React from 'react';
import { Switch, Grid, Typography, Tooltip } from '@material-ui/core';

const SwitchField = ({
    className,
    input: { name, onChange, checked, ...restInput },
    inputProps = {},
    offLabel,
    onLabel,
    tooltip,
    ...props
}) => {
    const content = (
        <div className={className}>
            <Grid component="label" container alignItems="center">
                {offLabel && (
                    <Grid item>
                        <Typography variant="body2">{offLabel}</Typography>
                    </Grid>
                )}
                <Grid item>
                    <Switch
                        color="primary"
                        {...props}
                        inputProps={{ ...restInput, ...inputProps }}
                        name={name}
                        checked={checked}
                        onChange={onChange}
                    />
                </Grid>
                {onLabel && (
                    <Grid item>
                        <Typography variant="body2">{onLabel}</Typography>
                    </Grid>
                )}
            </Grid>
        </div>
    );

    if (tooltip) {
        return <Tooltip title={tooltip}>{content}</Tooltip>;
    }

    return content;
};

export default SwitchField;
