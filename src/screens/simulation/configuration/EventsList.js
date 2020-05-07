import React, { useState } from 'react';
import {
    makeStyles,
    withStyles,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    StepConnector as MuiStepConnector,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';

import NewEventModal, { parameterLabels } from './NewEventModal';
import { format } from 'date-fns';
import { startOfDay } from 'date-fns/esm';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3, 2),
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    stepper: {
        backgroundColor: '#eee',
    },
    stepIcon: {
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    stepIconCircle: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
    },
    stepContent: {
        marginLeft: 5,
    },
    eventChangeCard: {
        marginBottom: theme.spacing(1),
    },
}));

const StepConnector = withStyles({
    root: {
        marginLeft: 5,
    },
})(MuiStepConnector);

const StepIcon = () => {
    const classes = useStyles();

    return (
        <div className={classes.stepIcon}>
            <div className={classes.stepIconCircle} />
        </div>
    );
};

const Event = ({ event, onDelete }) => {
    const classes = useStyles();

    return (
        <Step expanded>
            <StepLabel StepIconComponent={StepIcon}>
                {format(event.date, 'dd/MM/yyyy')} - {event.name}
            </StepLabel>
            <StepContent classes={{ root: classes.stepContent }}>
                {event.changes.map((change) => (
                    <Card key={change} className={classes.eventChangeCard}>
                        <CardHeader
                            title={<Typography>{parameterLabels[change]}</Typography>}
                            action={
                                <Tooltip title="Supprimer l'évènement">
                                    <IconButton onClick={onDelete(change)}>
                                        <DeleteForever />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <CardContent>{/* TODO: Input */}</CardContent>
                    </Card>
                ))}
            </StepContent>
        </Step>
    );
};

const orderByDate = ([_1, a], [_2, b]) => a.date - b.date;

const EventsList = ({ events, setEvents, initialDate }) => {
    const classes = useStyles();
    const [newEventModalOpen, setNewEventModalOpen] = useState(false);

    const handleModalOpen = () => {
        setNewEventModalOpen(true);
    };

    const handleModalClose = () => {
        setNewEventModalOpen(false);
    };

    const handleNewEvent = ({ date, ...formData }) => {
        setNewEventModalOpen(false);

        const values = Object.keys(formData).filter((name) => formData[name]);

        if (values.length === 0) {
            return;
        }

        const key = format(date, 'yyyy-MM-dd');
        const event = events[key] || {
            name: 'Changement de paramètre',
            date: startOfDay(date),
            changes: [],
        };
        const changes = new Set([...event.changes, ...values]);

        setEvents({ ...events, [key]: { ...event, changes: [...changes] } });
    };

    const handleEventDelete = (event) => (change) => () => {
        const key = format(event.date, 'yyyy-MM-dd');
        const newEvents = { ...events };

        if (event.changes.length === 1) {
            delete newEvents[key];
            setEvents(newEvents);
            return;
        }

        newEvents[key].changes = newEvents[key].changes.filter((c) => c !== change);
        setEvents(newEvents);
    };

    const eventEntries = Object.entries(events);
    eventEntries.sort(orderByDate);

    return (
        <div className={classes.container}>
            <div className={classes.actions}>
                <Button variant="outlined" color="primary" size="small" onClick={handleModalOpen}>
                    Ajouter un évènement
                </Button>
            </div>
            <NewEventModal
                open={newEventModalOpen}
                onClose={handleModalClose}
                onNewEvent={handleNewEvent}
                initialDate={initialDate}
            />
            {Object.keys(events).length > 0 && (
                <Stepper
                    orientation="vertical"
                    connector={<StepConnector />}
                    classes={{ vertical: classes.stepper }}
                >
                    {eventEntries.map(([key, event]) => (
                        <Event key={key} event={event} onDelete={handleEventDelete(event)} />
                    ))}
                </Stepper>
            )}
        </div>
    );
};

export default EventsList;
