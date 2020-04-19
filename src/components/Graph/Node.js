import React, { useEffect, useRef, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { GraphContext } from './GraphProvider';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        transition: 'top .5s ease-in-out',
    },
}));

export const Node = ({ name, targets = [], children, top = 0, left = 0 }) => {
    const classes = useStyles();
    const { registerNode } = useContext(GraphContext);
    const [styles, setStyles] = useState({});

    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            registerNode(name, ref, targets);
            setStyles({ marginLeft: -(ref.current.offsetWidth / 2) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, ref]);

    return (
        <div className={classes.root} style={{ top, left, ...styles }} ref={ref}>
            {children}
        </div>
    );
};
