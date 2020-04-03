import React from 'react';
import './App.css';
import { Typography, Box } from '@material-ui/core';
import { SIRView } from './SIRView';
import { dummyModel } from './model/sir';
import { Chart } from 'chart.js';
import ChartPage from './ChartView';

const App = () => {
    return (
        <div className="App">
            <Box m={8}>
                <Typography variant="h3" component="h2">
                    Projet MODCOV19 - prototype
                </Typography>
            </Box>
            <Typography variant="body1" component="h2">
                Dummy result {dummyModel().saints}
            </Typography>
            <Box m={8} h={30}>
                <ChartPage />
            </Box>
        </div>
    );
};

export default App;
