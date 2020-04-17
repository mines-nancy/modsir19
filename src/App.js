import React from 'react';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Home from './home/Home';
import NotFound from './NotFound';
import Experiments from './experiments/Experiments';

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/experiments" component={Experiments} />
                <Route component={NotFound} />
            </Switch>
        </HashRouter>
    );
};

export default App;
