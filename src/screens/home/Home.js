import React from 'react';
import { useTranslate } from 'react-polyglot';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, Typography, Button, CardContent } from '@material-ui/core';
import { Form } from 'react-final-form';

import Layout from '../../components/Layout';
import Diagram from '../simulation/Diagram';

import exampleImage from './visualisation-example.webp';

const round = (x) => Math.round(x * 100) / 100;
const startDate = new Date(2020, 0, 23);

const defaultValues = {
    population: 500000,
    patient0: 1,
    kpe: 60,
    r: 2.3,
    dm_incub: 3,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 8,
    dm_ss: 14,
    beta: 0.15,
    pc_ir: 84,
    pc_ih: round(100 - 84),
    pc_sm: 80,
    pc_si: round(100 - 80),
    pc_sm_si: 20,
    pc_sm_other: round(100 - 20), // This field is not sent to the API
    pc_sm_dc: 20,
    pc_sm_out: round(100 - 20),
    pc_si_dc: 50,
    pc_si_out: 50,
    pc_h_ss: 20,
    pc_h_r: round(100 - 20),
    lim_time: 250,
    j_0: startDate,
    rules: [],
};

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '0 auto',
        '& h1': {
            fontSize: 38,
        },
    },
    aside: {
        background: '#eee',
    },
    section: {
        padding: '32px !important',
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
                    <Grid item xs={12} sm={5} component="aside" className={classes.aside}>
                        <Form
                            subscription={{}}
                            onSubmit={() => {
                                /* Useless since we use a listener on autosave */
                            }}
                            initialValues={defaultValues}
                            render={() => (
                                <Diagram
                                    blocks={{
                                        totalPopulation: <CardContent>P</CardContent>,
                                        exposedPopulation: <CardContent>SE</CardContent>,
                                        incubation: <CardContent>INCUB</CardContent>,
                                        spontaneousRecovery: <CardContent>R</CardContent>,
                                        hospitalisation: <CardContent>H</CardContent>,
                                        medicalCare: <CardContent>SM</CardContent>,
                                        intensiveCare: <CardContent>SI</CardContent>,
                                        followUpCare: <CardContent>SS</CardContent>,
                                        death: <CardContent>DC</CardContent>,
                                        recovery: <CardContent>GR</CardContent>,
                                    }}
                                    disabled
                                    linesMargin="4rem 0"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={7} component="section" className={classes.section}>
                        <img
                            className={classes.img}
                            src={exampleImage}
                            style={{ width: 200 }}
                            alt={t('home.visualisation_example_desc')}
                            title={t('home.visualisation_example_desc')}
                        />
                        <div style={{ position: 'sticky', top: 64 + 16 }}>
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
                                        Le facteur R quantifiant l’intensité de l’épidémie qui
                                        dépend classiquement de 3 facteurs : (R=r*beta*DMG). Si
                                        R&le;1 l’épidémie est contenue ; si 1&lt;R&lt;1,2 l’épidemie
                                        est en évolution lente, si R&gt;1,3 l’épidémie est en
                                        évolution rapide
                                        <ul>
                                            <li>
                                                r : nombre moyen de contacts par unité de temps
                                                entre Exposés et Infectés (fortement dépendant des
                                                mesures de « distanciation sociale »)
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
                                <strong>
                                    2. Les « trajectoires de soins hospitaliers » simplifiées:
                                </strong>

                                <ul>
                                    <li>SI : soins intensifs</li>
                                    <li>SM : soins médicaux</li>
                                    <li>SS : soins de suite</li>
                                    <li>DC : Décès intra hospitaliers</li>
                                </ul>

                                <p>
                                    Le paramétrage des trajectoires hospitalières consiste à définir
                                </p>

                                <ul>
                                    <li>
                                        Les Durées Moyennes de Séjours estimées dans chaque
                                        compartiment
                                    </li>
                                    <li>
                                        Les proportions du flux de patients à chaque embranchement
                                    </li>
                                </ul>
                            </p>

                            <p>
                                Les paramètres du modèle peuvent être modifiés par l’utilisateur sur
                                l’interface graphique interactive. Il est également possible de
                                modifier certains paramètres au cours du temps pour simuler les
                                effets des mesures de confinement / déconfinement (en fonction de
                                leur intensité et de leur date d’application) ou des modification de
                                « stratégie de soins »
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default Home;
