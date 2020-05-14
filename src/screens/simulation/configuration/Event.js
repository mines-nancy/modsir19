import React, { useRef, useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';
import { Field } from 'react-final-form';
import { DeleteForever, Edit, Save, Cancel } from '@material-ui/icons';
import colors from '../colors';

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

import { parametersEditableInEvents } from '../../../parameters.json';
import ProportionField from '../../../components/fields/ProportionField';
import { SwitchPercentField } from '../../../components/fields/SwitchPercentField';
import DurationField from '../../../components/fields/DurationField';
import MixerConvolution from '../../../components/sirPlusH/MixerConvolution';

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
    configPercentSlider: {
        width: '100%',
        padding: 0,
    },
}));

const pcAttributes = {
    pc_ir: { label: 'Rétablissements', color: colors.recovered.main },
    pc_ih: { label: 'Hospitalisations', color: colors.normal_care.main },
    pc_sm: { label: 'Soins médicaux', color: colors.normal_care.main },
    pc_si: { label: 'Soins intensifs', color: colors.intensive_care.main },
    pc_sm_other: { label: 'Sortie ou Décès', color: 'grey' },
    pc_sm_si: { label: 'Soins intensifs', color: colors.intensive_care.main },
    pc_sm_out: { label: 'Sortie', color: colors.recovered.main },
    pc_sm_dc: { label: 'Décès', color: colors.death.main },
    pc_si_dc: { label: 'Décès', color: colors.death.main },
    pc_si_out: { label: 'Sortie', color: colors.recovered.main },
    pc_h_r: { label: 'Guérison', color: colors.recovered.main },
    pc_h_ss: { label: 'Soins de suite', color: colors.following_care.main },
};

export const getControlField = (change, date, classes) => {
    const baseName = `rule_${format(date, 'yyyy-MM-dd')}`;

    if (change === 'r0') {
        return (
            <Field
                name={`${baseName}_${change}`}
                component={ProportionField}
                numberInputLabel="R0"
                unit={null}
                max="5"
                step={0.1}
            />
        );
    }

    if (change.startsWith('pcswitch_')) {
        const [leftName, rightName] = change.replace('pcswitch_', '').split('-');

        return (
            <SwitchPercentField
                classes={{ sliderLabels: classes.configPercentSlider }}
                leftName={`${baseName}_${leftName}`}
                rightName={`${baseName}_${rightName}`}
                leftLabel={pcAttributes[leftName].label}
                rightLabel={pcAttributes[rightName].label}
                leftColor={pcAttributes[leftName].color}
                rightColor={pcAttributes[rightName].color}
                pieMode={false}
            />
        );
    }

    if (change === 'dm_incub') {
        return (
            <Field name={`${baseName}_${change}`}>
                {({ input }) => <MixerConvolution onChange={input.onChange} />}
            </Field>
        );
    }

    if (change.startsWith('dm_')) {
        return <Field name={`${baseName}_${change}`} component={DurationField} />;
    }

    return null;
};

export const availableParameters = [
    'r0',
    'pcswitch_pc_ir-pc_ih',
    'pcswitch_pc_sm-pc_si',
    'pcswitch_pc_sm_other-pc_sm_si',
    'pcswitch_pc_sm_out-pc_sm_dc',
    'pcswitch_pc_si_dc-pc_si_out',
    'pcswitch_pc_h_r-pc_h_ss',
    'dm_incub',
    'dm_r',
    'dm_h',
    'dm_sm',
    'dm_si',
    'dm_ss',
];

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
                        <CardContent>{getControlField(change, event.date, classes)}</CardContent>
                    </Card>
                ))}
            </StepContent>
        </Step>
    );
};

export default Event;
