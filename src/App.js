import React from 'react';
import './App.css';
import { Typography, Box, Grid } from '@material-ui/core';
import { SIRView } from './SIRView';
import { dummyModel } from './model/sir';
import { Chart } from './ChartView';

const App = () => {
    return (
        <div className="App">
            <Box m={8}>
                <Typography variant="h3" component="h2">
                    Projet MODCOV19 - prototype
                </Typography>
            </Box>
            <Box m={8}>
                <SIRView />
            </Box>
        </div>
    );
};

export default App;
