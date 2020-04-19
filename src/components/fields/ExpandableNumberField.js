import React, { useContext } from 'react';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import NumberField from './NumberField';
import { GraphContext } from '../Graph/GraphProvider';

const useStyles = makeStyles((theme) => ({
    details: {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        backgroundColor: theme.palette.grey[100],
        paddingTop: theme.spacing(3),
    },
}));

const preventDefault = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
};

const ExpandableNumberField = ({ children, label, input, step, ...props }) => {
    const { refresh } = useContext(GraphContext);
    const classes = useStyles();

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
                <NumberField
                    cardless
                    label={label}
                    input={input}
                    width="100%"
                    step={step}
                    onClick={preventDefault}
                />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div>{children}</div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default ExpandableNumberField;
