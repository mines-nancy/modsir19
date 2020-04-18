import React from 'react';
import { useTranslate } from 'react-polyglot';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';

import Layout from '../../components/Layout';
import exampleImage from './visualisation-example.png';

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: 32,
        '& h1': {
            fontSize: 38,
        },
    },
    img: {
        width: '100%',
    },
    aside: {
        marginTop: 10,
    },
    startButtonContainer: {
        textAlign: 'center',
        margin: 12,
        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
            margin: 0,
        },
    },
}));

const Home = () => {
    const classes = useStyles();
    const t = useTranslate();
    const history = useHistory();

    const start = () => {
        history.push('/simulation');
    };

    return (
        <Layout>
            <div className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} component="aside" className={classes.aside}>
                        <img
                            className={classes.img}
                            src={exampleImage}
                            alt={t('home.visualisation_example_desc')}
                            title={t('home.visualisation_example_desc')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} component="section">
                        <Grid container>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h1">Modèle SIR + H</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.startButtonContainer}>
                                <Button color="primary" variant="contained" onClick={start}>
                                    {t('home.start_button')}
                                </Button>
                            </Grid>
                        </Grid>
                        <p>Cette simulation se propose de modéliser :</p>
                        <p>
                            <strong>
                                1. L'évolution générale de l'épidémie sur un territoire selon un
                                modèle compartimental S.I.R classique:
                            </strong>

                            <ul>
                                <li>SE : population saine exposée</li>
                                <li>INCUB : population en incubation</li>
                                <li>I : population infectée</li>
                                <li>R population : Rétablie (guérie) et supposée immunisée</li>
                            </ul>

                            <p>Les principaux paramètres modifiables sont :</p>

                            <ul>
                                <li>La Population globale du territoire</li>
                                <li>
                                    Le facteur R quantifiant l’intensité de l’épidémie qui dépend
                                    classiquement de 3 facteurs : (R=r*beta*DMG). Si R&le;1
                                    l’épidémie est contenue ; si 1&lt;R&lt;1,2 l’épidemie est en
                                    évolution lente, si R&gt;1,3 l’épidémie est en évolution rapide
                                    <ul>
                                        <li>
                                            r : nombre moyen de contacts par unité de temps entre
                                            Exposés et Infectés (fortement dépendant des mesures de
                                            « distanciation sociale »)
                                        </li>
                                        <li>
                                            Beta : probabilité qu’un contact soit infectant
                                            (fortement dépendant des « mesures barrières » de
                                            protection individuelles)
                                        </li>
                                        <li>
                                            DMG : durée moyenne de guérison (intrinsèque à la
                                            maladie)
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </p>

                        <p>
                            <strong>Les « trajectoires de soins hospitaliers » simplifiées:</strong>

                            <ul>
                                <li>SI : soins intensifs</li>
                                <li>SM : soins médicaux</li>
                                <li>SS : soins de suite</li>
                                <li>DC : Décès intra hospitaliers</li>
                            </ul>

                            <p>Le paramétrage des trajectoires hospitalières consiste à définir</p>

                            <ul>
                                <li>
                                    Les Durées Moyennes de Séjours estimées dans chaque compartiment
                                </li>
                                <li>Les proportions du flux de patients à chaque embranchement</li>
                            </ul>
                        </p>

                        <p>
                            Les paramètres du modèle peuvent être modifiés par l’utilisateur sur
                            l’interface graphique interactive. Il est également possible de modifier
                            certains paramètres au cours du temps pour simuler les effets des
                            mesures de confinement / déconfinement (en fonction de leur intensité et
                            de leur date d’application) ou des modification de « stratégie de soins
                            »
                        </p>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default Home;
