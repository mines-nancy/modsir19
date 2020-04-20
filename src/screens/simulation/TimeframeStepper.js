import React from 'react';
import clsx from 'clsx';
import { differenceInDays, format } from 'date-fns';
import {
    makeStyles,
    withStyles,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Button,
    IconButton,
    Typography,
    StepConnector,
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
    icon: {
        position: 'relative',
        minWidth: theme.spacing(5),
        minHeight: theme.spacing(5),
        marginRight: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconActive: {
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: theme.spacing(5),
            height: theme.spacing(5),
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
        },
        '& > span': {
            position: 'absolute',
            color: 'white',
            fontWeight: 'bold',
        },
    },
}));

const stepIconFactory = (days, className) => () => {
    return (
        <div className={className}>
            <span>J+{days}</span>
        </div>
    );
};

const Connector = withStyles({
    vertical: {
        marginLeft: 20,
    },
})(StepConnector);

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
                connector={<Connector />}
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
                                    clsx(classes.icon, {
                                        [classes.iconActive]: index === selectedTimeframeIndex,
                                    }),
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
