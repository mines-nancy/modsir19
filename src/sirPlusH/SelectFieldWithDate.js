import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-polyglot';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        formControl: {
            margin: theme.spacing(1),
            minWidth: 180,
        },
        datePicker: {
            margin: theme.spacing(1),
        },
    }),
);

const SelectField = ({ options, onChange, value }) => {
    const classes = useStyles();
    const t = useTranslate();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Paramètre</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {t(`form.${option}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const DeleteRuleButton = ({ onClick }) => {
    const t = useTranslate();

    return (
        <Tooltip title={t('form.deleteRule')}>
            <IconButton edge="end" aria-label="delete" onClick={onClick}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    );
};

export const SelectFieldWithDate = ({ options, onDelete, onChange, rule }) => {
    const classes = useStyles();
    const t = useTranslate();
    const [field, setField] = React.useState(rule && rule.field);
    const [value, setValue] = React.useState(rule && rule.value);
    const [date, setDate] = React.useState(rule && rule.date);

    React.useEffect(() => {
        if (field && value && date) {
            onChange({ name: rule.name, field, value, date });
        }
    }, [field, value, date, onChange, rule]);

    return (
        <Grid container direction="row" alignItems="center">
            <SelectField options={options} onChange={setField} value={field} />
            <TextField
                id="standard-basic"
                label="Valeur"
                onChange={(event) => setValue(event.target.value)}
                value={value}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    className={classes.datePicker}
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    id="date-picker-inline"
                    label={t('form.afterDate')}
                    value={date}
                    onChange={setDate}
                />
            </MuiPickersUtilsProvider>
            <DeleteRuleButton onClick={onDelete} />
        </Grid>
    );
};
