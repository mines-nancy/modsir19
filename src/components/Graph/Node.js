import React, { useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { GraphContext } from './GraphProvider';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        transition: 'top .5s ease-in-out',
    },
}));

export const Node = ({ name, targets = [], alignmentBase = 'center', children, style }) => {
    const classes = useStyles();
    const { registerNode } = useContext(GraphContext);

    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            registerNode(name, ref, targets);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, ref]);

    return (
        <div className={classes.root} style={{ ...style }}>
            <div ref={ref}>{children}</div>
        </div>
    );
};
