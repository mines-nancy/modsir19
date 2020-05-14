import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Tooltip,
    Typography,
    Slider,
    Input,
    Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'react-polyglot';
import { SelectFieldWithDate } from './SelectFieldWithDate';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MixerConvolution from './MixerConvolution';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: 40,
        },
        longinput: {
            width: 80,
        },
        input: {
            width: 50,
        },
        slider: {
            width: 60,
        },
        sliderWithInput: {
            margin: theme.spacing(2),
        },
        actions: {
            float: 'left',
            margin: theme.spacing(1),
        },
    }),
);

const SliderWithInput = ({
    name,
    value,
    min,
    max,
    step,
    onSliderChange,
    onInputChange,
    onBlur,
    tooltipTitle,
}) => {
    const classes = useStyles();
    const t = useTranslate();
    return (
        <div className={classes.sliderWithInput}>
            <Tooltip title={tooltipTitle ? tooltipTitle : t(`form.tip.${name}`)}>
                <Typography id="input-slider" gutterBottom>
                    {t(`form.${name}`)}
                </Typography>
            </Tooltip>

            <Grid container alignItems="center">
                <Grid item={6}>
                    <Slider
                        name={name}
                        className={classes.slider}
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(event, newValue) => {
                            onSliderChange(event, newValue, name);
                        }}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Input
                        name={name}
                        className={String(value).length > 5 ? classes.longinput : classes.input}
                        value={value}
                        margin="dense"
                        onChange={(event) => onInputChange(event, name)}
                        onBlur={(event, newValue, name) => onBlur(event, newValue, name)}
                        inputProps={{
                            step,
                            min,
                            max,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

const round2digits = (x) => Math.round(x * 100) / 100;

const stateReducer = (state, action) => {
    // console.log(state, action);
    switch (action.type) {
        case 'SET_POPULATION':
            return { ...state, population: action.payload };
        case 'SET_PATIENT0':
            return { ...state, patient0: action.payload };
        case 'SET_KPE':
            return { ...state, kpe: action.payload };
        case 'SET_R':
            return { ...state, r: action.payload };
        case 'SET_DM_INCUB':
            return { ...state, dm_incub: action.payload };
        case 'SET_DM_R':
            return { ...state, dm_r: action.payload };
        case 'SET_DM_H':
            return { ...state, dm_h: action.payload };
        case 'SET_DM_SM':
            return { ...state, dm_sm: action.payload };
        case 'SET_DM_SI':
            return { ...state, dm_si: action.payload };
        case 'SET_DM_SS':
            return { ...state, dm_ss: action.payload };
        case 'SET_BETA':
            return { ...state, beta: action.payload };

        case 'SET_PC_IR': {
            const pc_ir = action.payload;
            const pc_ih = round2digits(1 - pc_ir);
            return { ...state, pc_ir: action.payload, pc_ih };
        }
        case 'SET_PC_IH': {
            const pc_ih = action.payload;
            const pc_ir = round2digits(1 - pc_ih);
            return { ...state, pc_ih: action.payload, pc_ir };
        }

        case 'SET_PC_SI': {
            const pc_si = action.payload;
            const pc_sm = round2digits(1 - pc_si);
            return { ...state, pc_si: action.payload, pc_sm };
        }
        case 'SET_PC_SM': {
            const pc_sm = action.payload;
            const pc_si = round2digits(1 - pc_sm);
            return { ...state, pc_sm: action.payload, pc_si };
        }

        case 'SET_PC_SM_SI': {
            const pc_sm_si = action.payload;
            const pc_sm_out = 1 - pc_sm_si;
            return { ...state, pc_sm_si: action.payload, pc_sm_out };
        }
        case 'SET_PC_SM_OUT': {
            const pc_sm_out = action.payload;
            const pc_sm_si = round2digits(1 - pc_sm_out);
            return { ...state, pc_sm_out: action.payload, pc_sm_si };
        }

        case 'SET_PC_SI_DC': {
            const pc_si_dc = action.payload;
            const pc_si_out = round2digits(1 - pc_si_dc);
            return { ...state, pc_si_dc: action.payload, pc_si_out };
        }
        case 'SET_PC_SI_OUT': {
            const pc_si_out = action.payload;
            const pc_si_dc = round2digits(1 - pc_si_out);
            return { ...state, pc_si_out: action.payload, pc_si_dc };
        }

        case 'SET_PC_H_SS': {
            const pc_h_ss = action.payload;
            const pc_h_r = round2digits(1 - pc_h_ss);
            return { ...state, pc_h_ss: action.payload, pc_h_r };
        }
        case 'SET_PC_H_R': {
            const pc_h_r = action.payload;
            const pc_h_ss = round2digits(1 - pc_h_r);
            return { ...state, pc_h_r: action.payload, pc_h_ss };
        }
        case 'SET_LIM_TIME':
            return { ...state, lim_time: action.payload };

        case 'SET_RULES':
            return { ...state, rules: action.payload };

        case 'SET_J_0':
            return { ...state, j_0: action.payload };
        default:
            return state;
    }
};

const setters = {
    population: 'SET_POPULATION',
    patient0: 'SET_PATIENT0',
    kpe: 'SET_KPE',
    r: 'SET_R',
    dm_incub: 'SET_DM_INCUB',
    dm_r: 'SET_DM_R',
    dm_h: 'SET_DM_H',
    dm_sm: 'SET_DM_SM',
    dm_si: 'SET_DM_SI',
    dm_ss: 'SET_DM_SS',
    beta: 'SET_BETA',
    pc_ir: 'SET_PC_IR',
    pc_ih: 'SET_PC_IH',
    pc_sm: 'SET_PC_SM',
    pc_si: 'SET_PC_SI',
    pc_sm_si: 'SET_PC_SM_SI',
    pc_sm_out: 'SET_PC_SM_OUT',
    pc_si_dc: 'SET_PC_SI_DC',
    pc_si_out: 'SET_PC_SI_OUT',
    pc_h_ss: 'SET_PC_H_SS',
    pc_h_r: 'SET_PC_H_R',
    lim_time: 'SET_LIM_TIME',
    rules: 'SET_RULES',
    j_0: 'SET_J_0',
};

const r0 = 2.3;
const r0_quarantine = 0.8;
const initialState = {
    population: 1000000,
    patient0: 100,
    kpe: 1.0,
    r: 1.0,
    dm_incub: 3,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 8,
    dm_ss: 14,
    beta: round2digits(r0 / 9.0),
    pc_ir: 0.84,
    pc_ih: round2digits(1 - 0.84),
    pc_sm: 0.8,
    pc_si: round2digits(1 - 0.8),
    pc_sm_si: 0.2,
    pc_sm_out: round2digits(1 - 0.2),
    pc_si_dc: 0.5,
    pc_si_out: 0.5,
    pc_h_ss: 0.2,
    pc_h_r: round2digits(1 - 0.2),
    lim_time: 250,
    rules: [
        {
            name: 'rule-1',
            type: 'change_field',
            field: 'beta',
            value: round2digits(r0_quarantine / 9.0),
            date: new Date(2020, 2, 16),
        },
    ],
    j_0: new Date(2020, 0, 23),
};

export default function SirPlusHSliders({ onChange }) {
    const classes = useStyles();
    const [values, dispatch] = React.useReducer(stateReducer, initialState);
    const [expanded, setExpanded] = React.useState('panel1');
    const handlePannelChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const t = useTranslate();

    const {
        population,
        patient0,
        kpe,
        r,
        dm_incub,
        dm_r,
        dm_h,
        dm_sm,
        dm_si,
        dm_ss,
        beta,
        pc_ir,
        pc_ih,
        pc_sm,
        pc_si,
        pc_sm_si,
        pc_sm_out,
        pc_si_dc,
        pc_si_out,
        pc_h_ss,
        pc_h_r,
        lim_time,
        rules,
        j_0,
    } = values;

    React.useEffect(() => {
        onChange(values);
    }, [onChange, values]);

    const handleSliderChange = React.useCallback(
        (event, newValue, name) => dispatch({ type: setters[name], payload: parseFloat(newValue) }),
        [dispatch],
    );

    const handleInputChange = React.useCallback((event, name) => {
        if (event.target.value === '') {
            // setters[name](parseFloat(event.target.min));
            dispatch({ type: setters[name], payload: parseFloat(event.target.min) });
        } else {
            // setters[name](parseFloat(event.target.value));
            dispatch({ type: setters[name], payload: parseFloat(event.target.value) });
        }
    }, []);

    const handleBlur = React.useCallback(
        (event, name) => {
            if (event.target.value < event.target.min) {
                // setters[name](parseFloat(event.target.min));
                dispatch({ type: setters[name], payload: parseFloat(event.target.min) });
            }
            if (event.target.value > event.target.max) {
                // setters[name](parseFloat(event.target.max));
                dispatch({ type: setters[name], payload: parseFloat(event.target.max) });
            }
        },
        [dispatch],
    );

    const handleChangeRule = React.useCallback(
        (rule) => {
            const newRules = rules.map((entry) => (entry.name === rule.name ? rule : entry));
            dispatch({ type: 'SET_RULES', payload: newRules });
        },
        [rules],
    );

    const handleAddRule = React.useCallback(
        ({ name }) => {
            const newRules = rules.concat([
                { name, value: undefined, field: undefined, date: new Date() },
            ]);
            dispatch({ type: 'SET_RULES', payload: newRules });
        },
        [rules],
    );

    const handleDeleteRule = React.useCallback(
        ({ name }) => {
            const newRules = rules.filter((rule) => rule && rule.name !== name);
            dispatch({ type: 'SET_RULES', payload: newRules });
        },
        [rules],
    );

    const disease_sliders = [
        { name: 'r', value: r, min: 0, max: 5, step: 0.01 },
        { name: 'beta', value: beta, min: 0, max: 1, step: 0.01 },
        { name: 'dm_incub', value: dm_incub, min: 0, max: 30, step: 1 },
        { name: 'dm_r', value: dm_r, min: 0, max: 30, step: 1 },
        { name: 'dm_h', value: dm_h, min: 0, max: 30, step: 1 },
        { name: 'pc_ir', value: pc_ir, min: 0, max: 1, step: 0.01 },
        { name: 'pc_ih', value: pc_ih, min: 0, max: 1, step: 0.01 },
    ];

    const hospital_management_sliders = [
        { name: 'dm_sm', value: dm_sm, min: 0, max: 30, step: 1 },
        { name: 'dm_si', value: dm_si, min: 0, max: 30, step: 1 },
        { name: 'dm_ss', value: dm_ss, min: 0, max: 30, step: 1 },
        { name: 'pc_sm', value: pc_sm, min: 0, max: 1, step: 0.01 },
        { name: 'pc_si', value: pc_si, min: 0, max: 1, step: 0.01 },
        { name: 'pc_sm_si', value: pc_sm_si, min: 0, max: 1, step: 0.01 },
        { name: 'pc_sm_out', value: pc_sm_out, min: 0, max: 1, step: 0.01 },
        { name: 'pc_si_dc', value: pc_si_dc, min: 0, max: 1, step: 0.01 },
        { name: 'pc_si_out', value: pc_si_out, min: 0, max: 1, step: 0.01 },
        { name: 'pc_h_ss', value: pc_h_ss, min: 0, max: 1, step: 0.01 },
        { name: 'pc_h_r', value: pc_h_r, min: 0, max: 1, step: 0.01 },
    ];

    const general_rules_sliders = [
        { name: 'population', value: population, min: 100000, max: 10000000, step: 100000 },
        { name: 'patient0', value: patient0, min: 1, max: 10000, step: 1 },
        { name: 'kpe', value: kpe, min: 0, max: 1, step: 0.01 },
        { name: 'lim_time', value: lim_time, min: 0, max: 1000, step: 1 },
    ];

    const newRuleName = '_' + Math.random().toString(36).substr(2, 9);

    return (
        <div className={classes.root}>
            <ExpansionPanel
                expanded={expanded === 'panel1'}
                onChange={handlePannelChange('panel1')}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className={classes.heading}>
                        {t('panel_title.general_rules_sliders')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="row" alignItems="center">
                        {general_rules_sliders.map((sl) => (
                            <Grid item xs={4}>
                                <SliderWithInput
                                    name={sl.name}
                                    value={sl.value}
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    onSliderChange={handleSliderChange}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label={t('form.j_0')}
                                    value={j_0}
                                    onChange={(date) =>
                                        dispatch({ type: setters['j_0'], payload: date })
                                    }
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                expanded={expanded === 'panel2'}
                onChange={handlePannelChange('panel2')}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>
                        {t('panel_title.disease_sliders')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="row" alignItems="center">
                        {disease_sliders.map((sl) => (
                            <Grid item xs={4}>
                                <SliderWithInput
                                    name={sl.name}
                                    value={sl.value}
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    onSliderChange={handleSliderChange}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                expanded={expanded === 'panel3'}
                onChange={handlePannelChange('panel3')}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>
                        {t('panel_title.hospital_management_sliders')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="row" alignItems="center">
                        {hospital_management_sliders.map((sl) => (
                            <Grid item xs={4}>
                                <SliderWithInput
                                    name={sl.name}
                                    value={sl.value}
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    onSliderChange={handleSliderChange}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                expanded={expanded === 'panel4'}
                onChange={handlePannelChange('panel4')}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>
                        {t('panel_title.quarantine_sliders')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="column" alignItems="flex-start">
                        {rules.map((rule) => {
                            return (
                                <Grid container direction="row" alignItems="center" key={rule.name}>
                                    <SelectFieldWithDate
                                        options={Object.keys(values)}
                                        rule={rule}
                                        onDelete={() => handleDeleteRule(rule)}
                                        onChange={handleChangeRule}
                                    />
                                </Grid>
                            );
                        })}
                        <Grid item>
                            <Button
                                className={classes.actions}
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddRule({ name: newRuleName })}
                            >
                                {t('form.addRule')}
                            </Button>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                expanded={expanded === 'panel5'}
                onChange={handlePannelChange('panel5')}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>Mixer Convolution</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <MixerConvolution />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}
