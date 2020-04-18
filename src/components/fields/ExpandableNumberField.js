import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import NumberField from './NumberField';

const ExpandableNumberField = ({ children, label, input, expanded }) => {
    return (
        <ExpansionPanel expanded={expanded}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <NumberField cardless label={label} input={input} width="100%" />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default ExpandableNumberField;
