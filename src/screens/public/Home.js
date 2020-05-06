import React from 'react';
import { format, parseISO } from 'date-fns';
import { makeStyles, Typography, Button } from '@material-ui/core';

import Layout from '../../components/Layout';
import diagram from './diagram.png';
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
        textAlign: 'right',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
        margin: `${theme.spacing(4)}px 0`,
        color: 'white',
        padding: theme.spacing(2, 1),
        display: 'flex',
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
                        <p>
                            Ce simulateur a pour but de montrer les princiaux facteurs influant 
                            sur l’évolution d’une épidémie en prenant comme exemple d’illustration 
                            l’épidémie de COVID19.
                        </p>
                        <p>
                            Les dates sont réalistes mais les paramètres utilisés sont des valeurs
                            arbitraires choisies pour les besoins de la démonstration.
                        </p>
                        <p>
                            Les résultats de cette simulation n’ont donc qu’une valeur pédagogique
                            pour aider à comprendre les mécanismes, et ne sont en auncun cas le
                            reflet de la réalité, ni au niveau d’un territoire, ni au niveau
                            national.
                        </p>
                        <p>
                            Pour modéliser cette épidémie, on utilise le principe de l’analyse
                            compartimentale. L’ensemble de la population d’un territoire est
                            répartie en 5 «&nbsp;compartiments&nbsp;»
                        </p>
                        <ul>
                            <li>
                                <strong>S&nbsp;:</strong> ensemble des sujets sains exposés et non
                                immunisés. Chaque jour, une partie des sujets sains est contaminée
                                par contact avec une personne malade et passe donc dans le
                                compartiment <strong>M</strong> (Malades) Ce nombre de
                                contaminations dépend d’un facteur <i>R0</i> (taux de reproduction)
                                expliqué plus bas.
                            </li>
                            <li>
                                <strong>M&nbsp;:</strong> ensemble des sujets malades porteurs du
                                virus et potentiellement contaminants. Environ 98% des sujets
                                contaminés vont guérir spontanément en 9 jours sans complications et
                                vont donc passer dans le compartiment <strong>G</strong> (Guéris).
                                2% des sujets infectés vont développer des complications (le plus
                                souvent respiratoires) qui vont nécessiter une hospitalisation. Ils
                                passent donc dans le compartiment <strong>H</strong> (Hospitalisés)
                            </li>
                            <li>
                                <strong>G&nbsp;:</strong> ensemble des sujets ayant été malades,
                                guéris et supposés immunisés
                            </li>
                            <li>
                                <strong>H&nbsp;:</strong> ensemble des patients en hospitalisation
                                pour traitement des complications de la maladie soit en
                                hospitalisation classique, soit en soins intensifs ou réanimation.
                                Environ 75% des patients hospitalisés vont guérir et rejoindre le
                                compartiment <strong>G</strong>. Malheureusement, environ 25% vont
                                décéder au cours de leur hospitalisation et sont comptabilisés dans
                                le compartiment <strong>DC</strong>
                            </li>
                            <li>
                                <strong>DC&nbsp;:</strong> ensemble des patients décédés
                            </li>
                        </ul>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={diagram} alt="Schéma du modèle SIR+H" />
                        </div>
                        <p>
                            Le nombre de nouveaux contaminés, et donc la vitesse de propagation de
                            l’épidémie dépend directement du paramètre R0 (taux de reproduction). R0
                            représente en effet le nombre de personnes saines qu’un sujet infecté
                            peut contaminer.
                        </p>
                        <p>
                            On peut montrer (et la simulation ci-dessous vous le visualisera) que :
                        </p>
                        <ul className={classes.noliststyle}>
                            <li>Si R0 est inférieur à 1 l’épidémie va s’éteindre spontanément</li>
                            <li>
                                Si R0 est compris entre 1 et 1,5 l’épidémie progresse relativement
                                lentement
                            </li>
                            <li>Si R0 est supérieur à 1,5 l’épidémie progresse rapidement</li>
                        </ul>
                        <p>
                            Pour maitriser une épidémie il faut donc arriver à faire baisser R0 en
                            dessous de 1. Les épidémiologistes ont depuis longtemps montré que R0
                            dépend de 3 facteurs principaux :
                        </p>
                        <p style={{ textAlign: 'center', marginTop: 12 }}>
                            <Typography variant="h6">R0 = DMG * r * β</Typography>
                        </p>
                        <ul className={classes.noliststyle}>
                            <li>
                                <strong>DMG</strong> est la durée moyenne de guérison spontanée, sur
                                laquelle on ne peut pas agir. Elle est caractéristique de chaque
                                maladie. Pour le COVID19 elle est estimée à 9 jours
                            </li>
                            <li>
                                <strong>r</strong> quantifie le nombre moyen de contacts par jour
                                entre un sujet contaminant et un sujet sain. Ce facteur dépend
                                principalement de la «&nbsp;vie sociale&nbsp;». L’objectif des
                                mesures collectives de confinement et de «&nbsp;distanciation
                                sociale&nbsp;» est de diminuer r
                            </li>
                            <li>
                                <strong>β</strong> est la probabilité qu’un contact entre un sujet
                                sain et un sujet contaminé provoque la contamination du sujet sain.
                                Par exemple si β = 0,5 un contact sur 2 est contaminant&nbsp;; si β
                                = 0,1 un contact sur 10 est contaminant. L’objectif des
                                «&nbsp;gestes barrières&nbsp;» et des mesures de protection
                                individuelles est de diminuer β
                            </li>
                        </ul>
                        <p>
                            Pour que des mesures collectives de confinement, de distanciation
                            sociale et de gestes barrières soient efficaces pour maitriser une
                            épidémie il faut qu’elles soient suffisamment rigoureuses et respectées
                            pour que R0 devienne inférieur à 1. C’est toute la difficulté de
                            l’équilibre à trouver entre maitrise de l’épidémie, et contraintes
                            sociales et économiques.
                        </p>
                        <p>
                            La simulation ci-dessous vous permettra de simuler les effets des
                            mesures de confinement / déconfinement en fonction de leur date et de
                            leur «&nbsp;rigueur&nbsp;» exprimée par la valeur de R0.
                        </p>
                    </FormattedText>
                    <div className={classes.callToAction}>
                        <p>Accéder à la simulation</p>
                        <p>
                            <Button
                                className={classes.start}
                                variant="contained"
                                color="inherit"
                                onClick={start}
                            >
                                Commencer
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
