import React, { useEffect } from 'react';
import { FormSpy } from 'react-final-form';
import { isEqual } from 'lodash';

// Coming from official example of async on blur saving
// https://codesandbox.io/s/7k742qpo36

// Mixed with the following
// https://codesandbox.io/s/5w4yrpyo7k?from-embed

const AutoSave = ({ values, save, debounce }) => {
    let previousValues = {};
    useEffect(() => {
        let timeout;

        if (!isEqual(previousValues, values)) {
            previousValues = values;
            timeout = setTimeout(() => save(values), debounce);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [debounce, save, values]);

    return null;
};

export default (props) => (
    <FormSpy {...props} subscription={{ values: true }} component={AutoSave} />
);
