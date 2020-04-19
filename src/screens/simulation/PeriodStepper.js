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

const PeriodStepper = ({
    periods,
    selectedPeriodIndex,
    setSelectedPeriodIndex,
    onAddPeriod,
    onRemovePeriod,
}) => {
    const classes = useStyles();

    const firstPeriodStartDate = periods[0].start_date;

    const handleStepClick = (index) => () => {
        setSelectedPeriodIndex(index);
    };

    const handleRemove = (index) => (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        onRemovePeriod(index);
    };

    return (
        <div className={classes.root}>
            <Stepper
                classes={{ root: classes.stepper }}
                activeStep={selectedPeriodIndex}
                orientation="vertical"
                elevation={0}
                nonLinear
            >
                {periods.map((period, index) => (
                    <Step key={period.start_date}>
                        <StepButton onClick={handleStepClick(index)}>
                            <StepLabel
                                classes={{
                                    root: classes.label,
                                    labelContainer: classes.labelContainer,
                                }}
                                StepIconComponent={stepIconFactory(
                                    differenceInDays(period.start_date, firstPeriodStartDate),
                                )}
                            >
                                <div>
                                    <Typography variant="h6" className={classes.text}>
                                        {period.name}
                                    </Typography>
                                </div>
                                <Typography variant="subtitle2">
                                    A partir du {format(period.start_date, 'dd/MM/yyyy')}
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
                <Button variant="outlined" className={classes.button} onClick={onAddPeriod}>
                    Nouvelle période
                </Button>
            </div>
        </div>
    );
};

export default PeriodStepper;
