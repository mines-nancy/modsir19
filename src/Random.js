import React from 'react';
import {Typography} from '@material-ui/core';

export const Random = () => {

    const o = { a:1, b:2 }

    const { a, b } = o;
    const r = Math.random();
    return (<Typography variant="h1" component="h2">
    {r} et {b}
    </Typography>);
}
