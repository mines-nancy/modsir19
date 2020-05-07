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
        maxHeight: '100%',
        overflowY: 'scroll',
        [theme.breakpoints.up('md')]: {
            minWidth: 600,
            maxWidth: 800,
            maxHeight: '90%',
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

const parameters = {
    patient0: 'Patients infectés à J-0',
    kpe: 'Taux de population exposée',
    r0: 'Nombre de Reproduction de Base (R0)',
    dm_incub: "Durée moyenne d'incubation",
    dm_r: 'Durée moyenne de rétablissement spontané',
    dm_h: "Durée moyenne jusqu'à hospitalisation",
    dm_sm: 'Durée moyenne des soins médicaux',
    dm_si: 'Durée moyenne des soins intensifs',
    dm_ss: 'Durée moyenne des soins de suite',
};

const NewEventModal = ({ open, onClose }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState('parameter');

    const handleExpand = (panel) => (evt, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return (
        <Modal open={open} onClose={onClose} className={classes.modal}>
            <Form
                onSubmit={console.log}
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
                                            {Object.keys(parameters).map((name) => (
                                                <FormControlLabel
                                                    key={name}
                                                    control={
                                                        <Field
                                                            name={name}
                                                            component={CheckboxField}
                                                            type="checkbox"
                                                        />
                                                    }
                                                    label={parameters[name]}
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
