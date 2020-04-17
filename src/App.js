import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { I18n } from 'react-polyglot';

import messages from './messages';
import Home from './home/Home';
import NotFound from './NotFound';
import Experiments from './experiments/Experiments';

const App = () => {
    return (
        <I18n locale="fr" messages={messages.fr}>
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/experiments" component={Experiments} />
                    <Route component={NotFound} />
                </Switch>
            </HashRouter>
        </I18n>
    );
};

export default App;
