import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { I18n } from 'react-polyglot';

import messages from './i18n/messages';
import Home from './screens/home/Home';
import NotFound from './screens/NotFound';
import Simulation from './screens/simulation/Simulation';
import Experiments from './screens/experiments/Experiments';

const App = () => {
    return (
        <I18n locale="fr" messages={messages.fr}>
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/simulation" exact component={Simulation} />
                    <Route path="/experiments" component={Experiments} />
                    <Route component={NotFound} />
                </Switch>
            </HashRouter>
        </I18n>
    );
};

export default App;
