import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { I18n } from 'react-polyglot';

import messages from './i18n/messages';
import ProHome from './screens/pro/Home';
import Legals from './screens/Legals';
import NotFound from './screens/NotFound';
import PublicHome from './screens/public/Home';
import ProSimulation from './screens/simulation/Simulation';
import PublicSimulation from './screens/simulation/PublicSimulation';

const Experiments = lazy(() =>
    import(/* webpackChunkName: "experiments" */ './screens/experiments/Experiments'),
);

const basename = process.env.REACT_APP_BASENAME || '/';

const App = () => {
    return (
        <I18n locale="fr" messages={messages.fr}>
            <BrowserRouter basename={basename}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path="/" exact component={PublicHome} />
                        <Route path="/simulation" exact component={PublicSimulation} />
                        <Route path="/pro" exact component={ProHome} />
                        <Route path="/pro/simulation" exact component={ProSimulation} />
                        <Route path="/mentions-legales" exact component={Legals} />
                        <Route path="/experiments" component={Experiments} />
                        <Route component={NotFound} />
                    </Switch>
                </Suspense>
            </BrowserRouter>
        </I18n>
    );
};

export default App;
