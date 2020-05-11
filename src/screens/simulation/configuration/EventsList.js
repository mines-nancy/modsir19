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
    Grid,
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
    empty: {
        marginTop: theme.spacing(10),
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

const NewEventButton = (props) => (
    <Button variant="outlined" color="primary" size="small" {...props}>
        Ajouter un évènement
    </Button>
);

const EmptyState = ({ onClick }) => {
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="center" className={classes.empty}>
            <Grid
                item
                direction="column"
                container
                alignItems="center"
                justify="space-between"
                spacing={2}
            >
                <Grid item>
                    <Typography variant="h5">{"Il n'y a pas encore d'évènement"}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" gutterBottom>
                        Ajouter un évènement pour créer une nouvelle période sur le graphe
                    </Typography>
                </Grid>
                <Grid item>
                    <NewEventButton onClick={onClick} size="medium" variant="contained" />
                </Grid>
            </Grid>
        </Grid>
    );
};

const orderByDate = ([_1, a], [_2, b]) => a.date - b.date;

const EventsList = ({ events, setEvents, initialDate }) => {
    const classes = useStyles();
    const [newEventModalOpen, setNewEventModalOpen] = useState(false);
    const isEmpty = Object.keys(events).length === 0;

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
            {!isEmpty && (
                <div className={classes.actions}>
                    <NewEventButton onClick={handleModalOpen} />
                </div>
            )}
            <NewEventModal
                open={newEventModalOpen}
                onClose={handleModalClose}
                onNewEvent={handleNewEvent}
                initialDate={initialDate}
            />
            {isEmpty ? (
                <EmptyState onClick={handleModalOpen} />
            ) : (
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
