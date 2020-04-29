import React from 'react';
import { useTranslate } from 'react-polyglot';
import { useHistory } from 'react-router-dom';
import {
    makeStyles,
    Grid,
    Typography,
    Button,
    CardContent,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@material-ui/core';
import { Form } from 'react-final-form';

import Layout from '../../components/Layout';
import Diagram from '../simulation/Diagram';

import exampleImage from './visualisation-example.webp';
import Acknowledgments from '../public/Acknowledgments';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '0 auto',
        '& h1': {
            fontSize: 38,
        },
    },
    img: {
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
        [theme.breakpoints.up('md')]: {
            float: 'right',
            width: 200,
            marginTop: 32,
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

const Block = ({ name }) => {
    const t = useTranslate();
    return (
        <Tooltip title={t(`diagram.tip.${name}`)}>
            <CardContent>{t(`diagram.${name}`)}</CardContent>
        </Tooltip>
    );
};

const Home = () => {
    const classes = useStyles();
    const t = useTranslate();
    const history = useHistory();
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    const start = () => {
        history.push('/pro/simulation');
    };

    return (
        <Layout>
            <div className={classes.container}>
                <Grid container direction={desktop ? 'row' : 'column-reverse'}>
                    <Grid item xs={12} sm={5} component="aside" className={classes.aside}>
                        <Form
                            subscription={{}}
                            onSubmit={() => {
                                /* Useless since we use a listener on autosave */
                            }}
                            initialValues={{}}
                            render={() => (
                                <Diagram
                                    blocks={{
                                        totalPopulation: <Block name="P" />,
                                        exposedPopulation: <Block name="SE" />,
                                        incubation: <Block name="INCUB" />,
                                        infected: <Block name="INFECTES" />,
                                        medicalCare: <Block name="SM" />,
                                        intensiveCare: <Block name="SI" />,
                                        followUpCare: <Block name="SS" />,
                                        death: <Block name="DC" />,
                                        recovery: <Block name="RG" />,
                                    }}
                                    disabled
                                    hideSwitchers
                                    linesMargin="60px 0"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={7} component="section" className={classes.section}>
                        <div style={{ position: 'sticky', top: 64 + 16 }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Acknowledgments />
                                </Grid>
                            </Grid>
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
                            <img
                                className={classes.img}
                                src={exampleImage}
                                alt={t('home.visualisation_example_desc')}
                                title={t('home.visualisation_example_desc')}
                            />
                            <p>Cette simulation se propose de modéliser :</p>
                            <p>
                                <strong>
                                    1. L'évolution générale de l'épidémie sur un territoire selon un
                                    modèle compartimental S.I.R classique :
                                </strong>

                                <ul>
                                    {['SE', 'INCUB', 'INFECTES', 'RG'].map((name) => (
                                        <li>
                                            {t(`diagram.${name}`)} : {t(`diagram.tip.${name}`)}
                                        </li>
                                    ))}
                                </ul>

                                <p>Les principaux paramètres modifiables sont :</p>

                                <ul>
                                    <li>La Population globale du territoire</li>
                                    <li>
                                        Le facteur R0 quantifiant l’intensité de l’épidémie.
                                        {/* qui dépend classiquement de 3 facteurs : (R=r*beta*DMG). */}{' '}
                                        Si R0&le;1 l’épidémie est contenue ; si 1&lt;R0&lt;1,2
                                        l’épidemie est en évolution lente, si R0&gt;1,3 l’épidémie
                                        est en évolution rapide
                                        {/* <ul>
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
                                        </ul> */}
                                    </li>
                                </ul>
                            </p>

                            <p>
                                <strong>
                                    2. Les « trajectoires de soins hospitaliers » simplifiées :
                                </strong>

                                <ul>
                                    {['SI', 'SM', 'SS', 'DC'].map((name) => (
                                        <li>
                                            {t(`diagram.${name}`)} : {t(`diagram.tip.${name}`)}
                                        </li>
                                    ))}
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
