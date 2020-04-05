import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export const NavigationAppBar = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({ value: 0 });

    const handleChange = (event, value) => {
        setState({ value });
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" title="My App">
                <Tabs value={state.value} onChange={handleChange}>
                    <Tab label="Accueil" />
                    <Tab label="Modèle SIR simple" />
                    <Tab label="Modèle complexe" />
                </Tabs>
            </AppBar>
            {state.value === 0 && <TabContainer>Afficher page d'accueil</TabContainer>}
            {state.value === 1 && <TabContainer>Afficher page modele SIR</TabContainer>}
            {state.value === 2 && <TabContainer>Afficher page modele complexe</TabContainer>}
        </div>
    );
};
