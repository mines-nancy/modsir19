import React from 'react';
import { createStyles, FormControl, makeStyles, MenuItem } from '@material-ui/core';
import FormikTextField from './FormikTextField';

const useStyles = makeStyles((theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 180,
        },
    }),
);

const toArrayString = (array) => array.map((value) => value.toString());

const generateMenu = ({ options }) =>
    toArrayString(options).map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
    ));

const FormikFormSelect = ({ name, options, withEmpty, required, formikProps, tooltipTitle }) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <FormikTextField
                select
                required={required}
                name={name}
                formikProps={formikProps}
                tooltipTitle={tooltipTitle}
            >
                {generateMenu({ options })}
            </FormikTextField>
        </FormControl>
    );
};
export default FormikFormSelect;
