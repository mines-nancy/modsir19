import React from 'react';
import { Card, CardContent, Grid, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        maxWidth: (props) => props.width || 350,
        backgroundColor: (props) => props.color,
    },
    label: {
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
    },
});

const NumberField = ({
    label,
    input: { name, onChange, value, ...restInput },
    cardless = false,
    ...props
}) => {
    const classes = useStyles(props);

    const cardContent = (
        <Grid container>
            <Grid item xs={8} className={classes.label}>
                {label}
            </Grid>
            <Grid item xs={4}>
                <TextField
                    inputProps={{ ...restInput, min: '0', step: '1' }}
                    {...props}
                    name={name}
                    value={value}
                    onChange={onChange}
                    type="number"
                />
            </Grid>
        </Grid>
    );

    if (cardless) {
        return cardContent;
    }

    return (
        <Card className={classes.card} elevation={3}>
            <CardContent>{cardContent}</CardContent>
        </Card>
    );
};

export default NumberField;
