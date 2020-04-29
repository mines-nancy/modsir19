import React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';

import Layout from '../../components/Layout';
import diagram from './diagram.png';
import Acknowledgments from './Acknowledgments';
import { useHistory } from 'react-router-dom';

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
        '& p:first-child': {
            marginTop: 0,
        },
        '& img': {
            maxWidth: '100%',
        },
        '& ul': {
            marginBottom: theme.spacing(2),
            [theme.breakpoints.down('sm')]: {
                paddingLeft: theme.spacing(2),
            },
        },
        '& li': {
            marginBottom: theme.spacing(1),
        },
    },
    start: {
        backgroundColor: 'white',
        color: theme.palette.primary.main,
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
                    <p>
                        Ce simulateur permet de comprendre comment évolue une épidémie, et en
                        particulier l’épidémie COVID19, et de visualiser les effets des mesures
                        collectives prises pour la maitriser.
                    </p>
                    <p>
                        Pour modéliser cette épidémie, on utilise le principe de l’analyse
                        compartimentale. L’ensemble de la population d’un territoire est répartie en
                        5 «&nbsp;compartiments&nbsp;»
                    </p>
                    <ul>
                        <li>
                            <strong>S&nbsp;:</strong> ensemble des sujets sains exposés et non
                            immunisés. Chaque jour, une partie des sujets sains est contaminée par
                            contact avec une personne malade et passe donc dans le compartiment{' '}
                            <strong>M</strong> (Malades) Ce nombre de contaminations dépend d’un
                            facteur <i>R0</i> (taux de reproduction) expliqué plus bas.
                        </li>
                        <li>
                            <strong>M&nbsp;:</strong> ensemble des sujets malades porteurs du virus
                            et potentiellement contaminants. Environ 85% des sujets contaminés vont
                            guérir spontanément en 9 jours sans trop de complications et vont donc
                            passer dans le compartiment <strong>G</strong> (Guéris). 15% des sujets
                            infectés vont développer des complications (le plus souvent
                            respiratoires) qui vont nécessiter une hospitalisation. Ils passent donc
                            dans le compartiment H (Hospitalisés)
                        </li>
                        <li>
                            <strong>G&nbsp;:</strong> ensemble des sujets ayant été malades, guéris
                            et supposés immunisés
                        </li>
                        <li>
                            <strong>H&nbsp;:</strong> ensemble des patients en hospitalisation pour
                            traitement des complications de la maladie soit en hospitalisation
                            classique, soit en soins intensifs ou réanimation. Environ 85% des
                            patients hospitalisés vont guérir et rejoindre le compartiment{' '}
                            <strong>G</strong>. Malheureusement, environ 15% vont décéder au cours
                            de leur hospitalisation et sont comptabilisés dans le compartiment{' '}
                            <strong>DC</strong>
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
                        l’épidémie dépend directement du paramètre R0 (taux de reproduction). On
                        peut montrer (et la simulation ci-dessous vous le visualisera) que :
                    </p>
                    <ul className={classes.noliststyle}>
                        <li>Si R0 est inférieur à 1 l’épidémie va s’éteindre spontanément</li>
                        <li>
                            Si R0 est compris entre 1 et 1,2 l’épidémie progresse relativement
                            lentement
                        </li>
                        <li>Si R0 est supérieur à 1,3 l’épidémie progresse rapidement</li>
                    </ul>
                    <p>
                        Pour maitriser une épidémie il faut donc arriver à faire baisser R0 en
                        dessous de 1. Les épidémiologistes ont depuis longtemps montré que R0 dépend
                        de 3 facteurs principaux :
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
                            <strong>r</strong> quantifie le nombre moyen de contacts par jour entre
                            un sujet contaminant et un sujet sain. Ce facteur dépend principalement
                            de la «&nbsp;vie sociale&nbsp;». L’objectif des mesures collectives de
                            confinement et de «&nbsp;distanciation sociale&nbsp;» est de diminuer r
                        </li>
                        <li>
                            <strong>β</strong> est la probabilité qu’un contact entre un sujet sain
                            et un sujet contaminé provoque la contamination du sujet sain. Par
                            exemple si β = 0,5 un contact sur 2 est contaminant&nbsp;; si β = 0,01
                            un contact sur 10 est contaminant. L’objectif des «&nbsp;gestes
                            barrières&nbsp;» et des mesures de protection individuelles est de
                            diminuer β
                        </li>
                    </ul>
                    <p>
                        Pour que des mesures collectives de confinement, de distanciation sociale et
                        de gestes barrières soient efficaces pour maitriser une épidémie il faut
                        qu’elles soient suffisamment rigoureuses et respectées pour que R0 devienne
                        inférieur à 1. C’est toute la difficulté de l’équilibre à trouver entre
                        maitrise de l’épidémie et contraintes sociales et économiques.
                    </p>
                    <p>
                        La simulation ci-dessous vous permettra de simuler les effets des mesures de
                        confinement / déconfinement en fonction de leur date et de leur
                        «&nbsp;rigueur&nbsp;» exprimée par la valeur de R0.
                    </p>
                    <Acknowledgments />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
