import React from 'react';
import { format, parseISO } from 'date-fns';
import { makeStyles, Typography, Button } from '@material-ui/core';

import Layout from '../../components/Layout';
import gestes from './gestes.png';
import Acknowledgments from './Acknowledgments';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import FormattedText from '../simulation/FormattedText';

const buildDate = process.env.REACT_APP_BUILD_DATE;

const useStyles = makeStyles((theme) => ({
    layout: {
        background: '#eee',
    },
    container: {
        width: '100%',
    },
    home: {
        margin: '0 auto',
        maxWidth: 900,
        padding: theme.spacing(2),
    },
    callToAction: {
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
        margin: `${theme.spacing(4)}px 0`,
        color: 'white',
        padding: theme.spacing(2, 1),
        justifyContent: 'flex-end',
        alignItems: 'center',
        '& p': {
            margin: `0 ${theme.spacing(1)}px 0 0`,
            flex: '0 0 auto',
        },
    },
    start: {
        backgroundColor: 'white',
        color: theme.palette.primary.main,
    },
    warning: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

const Home = () => {
    const classes = useStyles();
    const history = useHistory();

    const start = () => {
        history.push('/simulation');
    };

    return (
        <Layout
            className={classes.layout}
            actions={
                <Button
                    className={classes.start}
                    variant="contained"
                    color="inherit"
                    onClick={start}
                >
                    Commencer
                </Button>
            }
        >
            <div className={classes.container}>
                <div className={classes.home}>
                    <FormattedText>
                        {buildDate && (
                            <Typography variant="body2" gutterBottom>
                                Version du {format(parseISO(buildDate), 'dd/MM/yyyy')}
                            </Typography>
                        )}
                        <h1>Simulation de l’épidémie de COVID19 en « COVIDIE »</h1>
                        <p>
                            Cette simulation, à visée pédagogique, a pour but de montrer les
                            principaux facteurs influents sur une épidémie, et d’en visualiser les effets sur un graphe.
                        </p>
                        <p>
                            Elle s’intéresse à un petit territoire fictif, la Covidie, situé quelque part sur la
                            planète Terre, et peuplé d’1 millions d’habitants : les Covidiens.
                        </p>
                        <p>
                            Les covidiens, par nature pu enclins à la discipline, sauront-ils respecter les « gestes barrières »
                            et se conformer à la réglementation covidienne, afin de maitriser le fameux R0, clef magique pour controler l’épidémie ?
                        </p>
                        <p>
                            Toute ressemblance avec des personnes ou des événements existants ou ayant existé ne serait que pure coïncidence.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={gestes} alt="Schéma du modèle SIR+H" />
                        </div>
                    </FormattedText>
                    <div className={classes.callToAction}>
                        <p>
                            <Button
                                className={classes.start}
                                variant="contained"
                                color="inherit"
                                onClick={start}
                            >
                                Accéder à la simulation
                            </Button>
                        </p>
                    </div>
                    <Alert severity="warning" className={classes.warning}>
                        <p>
                            Cette modélisation est à visée exclusivement{' '}
                            <strong>pédagogique</strong>. Elle est basée sur des hypothèses très
                            simplifiées.
                        </p>
                        <p>
                            Elle n’est pas le reflet de la réalité de l’épidémie actuelle et n’est pas applicable à un territoire particulier.
                            <br />
                            Elle ne peut en aucun cas servir d’outil de prévision ou d’aide à la
                            prise de décision.
                            <br />
                            Les auteurs déclinent toute responsabilité d’un mésusage de ce logiciel
                            pédagogique.
                        </p>
                    </Alert>
                    <Acknowledgments />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
