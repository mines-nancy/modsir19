import React, { useRef, useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';
import { Field } from 'react-final-form';
import {
    makeStyles,
    Step,
    StepLabel,
    StepContent,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { DeleteForever, Edit, Save, Cancel } from '@material-ui/icons';

import ProportionField from '../../../components/fields/ProportionField';
import DurationField from '../../../components/fields/DurationField';

import { parametersEditableInEvents } from '../../../parameters.json';

export const parametersControl = {
    kpe: {
        component: ProportionField,
    },
    r0: {
        component: ProportionField,
        options: {
            numberInputLabel: 'R0',
            unit: null,
            max: '5',
            step: 0.1,
        },
    },
    dm_incub: {
        component: DurationField,
    },
    dm_r: {
        component: DurationField,
    },
    dm_h: {
        component: DurationField,
    },
    dm_sm: {
        component: DurationField,
    },
    dm_si: {
        component: DurationField,
    },
    dm_ss: {
        component: DurationField,
    },
};

export const availableParameters = Object.keys(parametersControl);

const useStyles = makeStyles((theme) => ({
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
    eventName: {
        display: 'inline-block',
        lineHeight: `${theme.spacing(3)}px`,
        padding: theme.spacing(0, 1),
    },
}));

const StepIcon = () => {
    const classes = useStyles();

    return (
        <div className={classes.stepIcon}>
            <div className={classes.stepIconCircle} />
        </div>
    );
};

const Event = ({ event, onDelete, onRename }) => {
    const classes = useStyles();
    const eventName = useRef(event.name);
    const inputRef = useRef();
    const [editingName, setEditingName] = useState(false);

    useEffect(() => {
        eventName.current = event.name;
    }, [event.name, eventName]);

    const handleEditName = () => {
        setEditingName(true);
    };

    const handleCancel = useCallback(() => {
        eventName.current = event.name;
        setEditingName(false);
    }, [event.name]);

    const handleSave = useCallback(() => {
        onRename(eventName.current);
        setEditingName(false);
    }, [onRename]);

    const parser = new DOMParser();

    const handleNameChange = (evt) => {
        // Remove all tags
        const sanitizedName = sanitizeHtml(evt.target.value, {
            allowedTags: [],
            allowedAttributes: {},
        });

        // Transforms HTML representations (&amp;) to text (&)
        const dom = parser.parseFromString(`<!doctype html><body>${sanitizedName}`, 'text/html');
        eventName.current = dom.body.textContent;
    };

    const handleKeyPress = useCallback(
        (evt) => {
            if (evt.key === 'Enter') {
                evt.preventDefault();
                handleSave();
            }

            if (evt.key === 'Escape') {
                evt.preventDefault();
                handleCancel();
            }
        },
        [handleCancel, handleSave],
    );

    useEffect(() => {
        const input = editingName && inputRef && inputRef.current;

        if (input) {
            input.focus();

            input.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            if (input) {
                input.removeEventListener('keydown', handleKeyPress);
            }
        };
    }, [editingName, inputRef, handleKeyPress]);

    return (
        <Step expanded>
            <StepLabel StepIconComponent={StepIcon}>
                {format(event.date, 'dd/MM/yyyy')} -{' '}
                {editingName ? (
                    <>
                        <ContentEditable
                            html={eventName.current}
                            onChange={handleNameChange}
                            innerRef={inputRef}
                            className={classes.eventName}
                        />
                        <Tooltip title="Sauvegarder">
                            <IconButton onClick={handleSave} size="small" color="primary">
                                <Save fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuler">
                            <IconButton onClick={handleCancel} size="small">
                                <Cancel fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <div className={classes.eventName}>{event.name}</div>{' '}
                        <Tooltip title="Editer le nom de la période">
                            <IconButton onClick={handleEditName} size="small">
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </StepLabel>
            <StepContent classes={{ root: classes.stepContent }}>
                {event.changes.map((change) => (
                    <Card key={change} className={classes.eventChangeCard}>
                        <CardHeader
                            title={<Typography>{parametersEditableInEvents[change]}</Typography>}
                            action={
                                <Tooltip title="Supprimer l'évènement">
                                    <IconButton onClick={onDelete(change)}>
                                        <DeleteForever />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <CardContent>
                            <Field
                                name={`${format(event.date, 'yyyy-MM-dd')}_${change}`}
                                component={parametersControl[change].component}
                                {...(parametersControl[change].options || {})}
                            />
                        </CardContent>
                    </Card>
                ))}
            </StepContent>
        </Step>
    );
};

export default Event;
