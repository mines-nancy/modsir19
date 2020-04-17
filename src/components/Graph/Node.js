import React, { useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { GraphContext } from './GraphProvider';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        height: 100,
        width: 100,
        marginLeft: '-50px',
        background: '#ccc',
    },
}));

export const Node = ({ name, targets = [], children, top = 0, left = 0 }) => {
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
        <div className={classes.root} style={{ top, left }} ref={ref}>
            {children}
        </div>
    );
};
