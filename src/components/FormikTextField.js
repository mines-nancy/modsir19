import React from 'react';
import {createStyles, makeStyles, TextField, Tooltip} from '@material-ui/core';
import {useTranslate} from 'react-polyglot';

const useStyles = makeStyles((theme) =>
    createStyles({
        textField: {
            // padding: theme.spacing(2),
            // textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

const FormikTextField = ({name, required, select, children, formikProps, tooltipTitle}) => {
    const classes = useStyles();
    const t = useTranslate();
    const {values, touched, errors, handleChange, handleBlur} = formikProps;
    const [open, setOpen] = React.useState(false);

    return (
        <Tooltip
            title={tooltipTitle ? tooltipTitle : t(`form.tip.${name}`)}
            disableFocusListener={true}
            disableHoverListener={Boolean(!tooltipTitle) && Boolean(t(`form.tip.${name}`) === '')}
            open={open}
        >
            <TextField
                required={required}
                select={select}
                className={classes.textField}
                name={name}
                label={t(`form.${name}`)}
                value={values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{
                    shrink: true,
                }}
                helperText={errors[name] && touched[name] && errors[name]}
                error={Boolean(errors[name] && touched[name])}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onClick={() => setOpen(false)}
            >
                {children}
            </TextField>
        </Tooltip>
    );
};
export default FormikTextField;
