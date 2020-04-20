import React, { useEffect } from 'react';
import { FormSpy } from 'react-final-form';

// Coming from official example of async on blur saving
// https://codesandbox.io/s/7k742qpo36

// Mixed with the following
// https://codesandbox.io/s/5w4yrpyo7k?from-embed

const AutoSave = ({ values, save, debounce }) => {
    useEffect(() => {
        const timeout = setTimeout(() => save(values), debounce);

        return () => {
            clearTimeout(timeout);
        };
    }, [debounce, save, values]);

    return null;
};

export default (props) => (
    <FormSpy {...props} subscription={{ values: true }} component={AutoSave} />
);
