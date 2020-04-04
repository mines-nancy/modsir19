import React from 'react';
import { makeStyles, createStyles, FormControl } from '@material-ui/core';
import FormikTextField from './FormikTextField';

const useStyles = makeStyles((theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 180,
        },
    }),
);

const FormikFormText = ({ name, required, formikProps, tooltipTitle }) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <FormikTextField
                required={required}
                name={name}
                formikProps={formikProps}
                tooltipTitle={tooltipTitle}
            />
        </FormControl>
    );
};
export default FormikFormText;
