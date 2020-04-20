import React from 'react';
import { differenceInDays, format } from 'date-fns';
import {
    makeStyles,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Button,
    IconButton,
    Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    stepper: {
        backgroundColor: 'transparent',
    },
    label: {
        width: '100%',
    },
    labelContainer: {
        '& > span': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    },
    text: {
        display: 'inline',
    },
    stepActions: {
        minWidth: 47,
        minHeight: 47,
    },
    actions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginRight: theme.spacing(1),
    },
}));

const stepIconFactory = (days) => (props) => {
    return <div>J+{days}</div>;
};

const TimeframeStepper = ({
    timeframes,
    selectedTimeframeIndex,
    setSelectedTimeframeIndex,
    onAddTimeframe,
    onRemoveTimeframe,
}) => {
    const classes = useStyles();

    const firstTimeframestartDate = timeframes[0].start_date;

    const handleStepClick = (index) => () => {
        setSelectedTimeframeIndex(index);
    };

    const handleRemove = (index) => (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        onRemoveTimeframe(index);
    };

    return (
        <div className={classes.root}>
            <Stepper
                classes={{ root: classes.stepper }}
                activeStep={selectedTimeframeIndex}
                orientation="vertical"
                elevation={0}
                nonLinear
            >
                {timeframes.map((timeframe, index) => (
                    <Step key={timeframe.start_date}>
                        <StepButton onClick={handleStepClick(index)}>
                            <StepLabel
                                classes={{
                                    root: classes.label,
                                    labelContainer: classes.labelContainer,
                                }}
                                StepIconComponent={stepIconFactory(
                                    differenceInDays(timeframe.start_date, firstTimeframestartDate),
                                )}
                            >
                                <div>
                                    <Typography variant="h6" className={classes.text}>
                                        {timeframe.name}
                                    </Typography>
                                </div>
                                <Typography variant="subtitle2">
                                    A partir du {format(timeframe.start_date, 'dd/MM/yyyy')}
                                </Typography>
                                <div className={classes.stepActions}>
                                    {index !== 0 && (
                                        <IconButton
                                            aria-label="delete"
                                            onClick={handleRemove(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </div>
                            </StepLabel>
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div className={classes.actions}>
                <Button variant="outlined" className={classes.button} onClick={onAddTimeframe}>
                    Nouvelle période
                </Button>
            </div>
        </div>
    );
};

export default TimeframeStepper;
