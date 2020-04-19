import React from 'react';
import { FormSpy } from 'react-final-form';
import { isEqual } from 'lodash';

// Coming from official example of async on blur saving
// https://codesandbox.io/s/7k742qpo36

// Mixed with the following
// https://codesandbox.io/s/5w4yrpyo7k?from-embed

class AutoSave extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: props.values, submitting: false };
    }

    componentWillReceiveProps(nextProps) {
        const { save, debounce, values } = this.props;

        if (isEqual(values, nextProps.values)) {
            return;
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => save(nextProps.values), debounce);
    }

    render() {
        return null;
    }
}

export default (props) => (
    <FormSpy {...props} subscription={{ values: true }} component={AutoSave} />
);
