import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import {
    makeStyles,
    Modal,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography,
    FormGroup,
    FormControlLabel,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import DateField from '../../../components/fields/DateField';
import CheckboxField from '../../../components/fields/CheckboxField';

import { parametersEditableInEvents } from '../../../parameters.json';
import { availableParameters } from './Event';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 0,
        maxWidth: '100vw',
        maxHeight: '100vh',
    },
    card: {
        backgroundColor: '#eee',
        maxWidth: '100%',
        maxHeight: '100vh',
        overflowY: 'scroll',
        [theme.breakpoints.up('md')]: {
            minWidth: 600,
            maxWidth: 800,
            maxHeight: '90vh',
            padding: theme.spacing(1),
        },
    },
    dateField: {
        marginBottom: theme.spacing(1),
    },
    actions: {
        justifyContent: 'space-between',
    },
}));

const NewEventModal = ({ open, onClose, onNewEvent, initialDate }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState('parameter');

    const handleExpand = (panel) => (evt, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return (
        <Modal open={open} onClose={onClose} className={classes.modal}>
            <Form
                onSubmit={onNewEvent}
                initialValues={{ date: new Date() }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Card className={classes.card}>
                            <CardHeader title="Nouvel évènement" />
                            <CardContent>
                                <Field
                                    className={classes.dateField}
                                    name="date"
                                    label="Date de l'évènement"
                                    component={DateField}
                                    minDate={initialDate}
                                />
                                <ExpansionPanel
                                    expanded={expanded === 'parameter'}
                                    onChange={handleExpand('parameter')}
                                >
                                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                        <Typography>Changement de paramètre</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <FormGroup>
                                            {Object.keys(parametersEditableInEvents)
                                                .filter((key) => availableParameters.includes(key))
                                                .map((name) => (
                                                    <FormControlLabel
                                                        key={name}
                                                        control={
                                                            <Field
                                                                name={name}
                                                                component={CheckboxField}
                                                                type="checkbox"
                                                            />
                                                        }
                                                        label={parametersEditableInEvents[name]}
                                                    />
                                                ))}
                                        </FormGroup>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </CardContent>
                            <CardActions className={classes.actions}>
                                <Button variant="text" color="primary" onClick={onClose}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Ajouter
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                )}
            />
        </Modal>
    );
};

export default NewEventModal;
