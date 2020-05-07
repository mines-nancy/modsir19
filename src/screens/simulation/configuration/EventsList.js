import React, { useState } from 'react';
import { makeStyles, Button } from '@material-ui/core';

import NewEventModal from './NewEventModal';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3, 2),
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

const EventsList = () => {
    const classes = useStyles();
    const [newEventModalOpen, setNewEventModalOpen] = useState(false);

    const handleModalOpen = () => {
        setNewEventModalOpen(true);
    };

    const handleModalClose = () => {
        setNewEventModalOpen(false);
    };

    return (
        <div className={classes.container}>
            <div className={classes.actions}>
                <Button variant="outlined" color="primary" size="small" onClick={handleModalOpen}>
                    Ajouter un évènement
                </Button>
            </div>
            <NewEventModal open={newEventModalOpen} onClose={handleModalClose} />
        </div>
    );
};

export default EventsList;
