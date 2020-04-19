import React, { useContext } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import NumberField from './NumberField';
import { GraphContext } from '../Graph/GraphProvider';

const ExpandableNumberField = ({ children, label, input, ...props }) => {
    const { refresh } = useContext(GraphContext);

    return (
        <ExpansionPanel
            {...props}
            TransitionProps={{
                addEndListener: (node, done) => {
                    node.addEventListener('transitionend', refresh, false);
                },
            }}
        >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <NumberField cardless label={label} input={input} width="100%" />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div>{children}</div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default ExpandableNumberField;
