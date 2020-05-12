import React, { useState } from 'react';
import {
    Button,
    Modal,
    makeStyles,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Tooltip,
    CardActions,
    Typography,
    Tabs,
    Tab,
} from '@material-ui/core';
import { HelpOutline, Close } from '@material-ui/icons';
import diagram from '../public/diagram.png';
import FormattedText from './FormattedText';
import colors from './colors';
import { useLocalStorage } from '../../utils/useLocalStorage';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 0,
        maxWidth: '100vw',
        maxHeight: '100vh',
    },
    card: {
        backgroundColor: '#eee',
        maxWidth: '100%',
        maxHeight: '100%',
        overflowY: 'scroll',
        [theme.breakpoints.up('md')]: {
            width: 800,
            maxHeight: '90%',
            padding: theme.spacing(3),
        },
    },
    cardHeaderAction: {
        marginTop: 0,
    },
    warning: {
        fontStyle: 'italic',
    },
    actions: ({ spaceBetweenActions }) => ({
        justifyContent: !spaceBetweenActions ? 'flex-end' : 'space-between',
    }),
    color: {
        backgroundColor: ({ name }) => (colors[name] || {}).light,
        display: 'inline-block',
        padding: 2,
    },
}));

const Color = ({ name, children }) => {
    const classes = useStyles({ name });

    return <span className={classes.color}>{children}</span>;
};

const InstructionsButton = () => {
    const [openOnMount, setOpenOnMount] = useLocalStorage('open-simulation-instructions', true);
    const classes = useStyles({ spaceBetweenActions: openOnMount });
    const [open, setOpen] = useState(openOnMount);
    const [tab, setTab] = useState(0);

    const handleButtonClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCloseAndDisableOpenOnMount = () => {
        setOpen(false);
        setOpenOnMount(false);
    };

    const handleChangeTab = (evt, value) => {
        setTab(value);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<HelpOutline />}
                onClick={handleButtonClick}
            >
                Aide
            </Button>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        classes={{ action: classes.cardHeaderAction }}
                        title={
                            <Tabs
                                value={tab}
                                variant="fullWidth"
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={handleChangeTab}
                            >
                                <Tab label="Principe de modélisation" value={0} />
                                <Tab label="Mode d'emploi" value={1} />
                                <Tab label="Qu'est-ce que le R0 ?" value={2} />
                            </Tabs>
                        }
                        action={
                            <Tooltip title="Fermer la fenêtre">
                                <IconButton
                                    variant="text"
                                    color="inherit"
                                    aria-label="Fermer la fenêtre"
                                    component="span"
                                    onClick={handleClose}
                                >
                                    <Close />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        {tab === 0 && (
                            <FormattedText>
                                <h3 className={classes.warning}>ATTENTION</h3>
                                <p className={classes.warning}>
                                    Les paramètres utilisés sont des valeurs arbitraires choisies
                                    pour les besoins de la démonstration. Les résultats de cette
                                    simulation n’ont donc qu’une valeur pédagogique pour aider à
                                    comprendre les mécanismes d’une épidémie, et ne sont en aucun
                                    cas le reflet de la réalité, ni au niveau d’un territoire, ni au
                                    niveau national.
                                </p>
                                <h2>Principe :</h2>
                                <p>
                                    Pour modéliser cette épidémie, on utilise le principe de
                                    l’analyse compartimentale. L’ensemble de la population d’un
                                    territoire est répartie en 5 « compartiments ».
                                </p>
                                <ul>
                                    <li>
                                        <strong>S&nbsp;:</strong> ensemble des sujets sains exposés
                                        et non immunisés. Chaque jour, une partie des sujets sains
                                        est contaminée par contact avec une personne malade et passe
                                        donc dans le compartiment <strong>M</strong> (Malades) Ce
                                        nombre de contaminations dépend d’un facteur <i>R0</i> (taux
                                        de reproduction) expliqué plus bas.
                                    </li>
                                    <li>
                                        <strong>M&nbsp;:</strong> ensemble des sujets malades
                                        porteurs du virus et potentiellement contaminants. Environ
                                        98% des sujets contaminés vont guérir spontanément en 9
                                        jours sans complications et vont donc passer dans le
                                        compartiment <strong>G</strong> (Guéris). 2% des sujets
                                        infectés vont développer des complications (le plus souvent
                                        respiratoires) qui vont nécessiter une hospitalisation. Ils
                                        passent donc dans le compartiment <strong>H</strong>{' '}
                                        (Hospitalisés)
                                    </li>
                                    <li>
                                        <strong>G&nbsp;:</strong> ensemble des sujets ayant été
                                        malades, guéris et supposés immunisés
                                    </li>
                                    <li>
                                        <strong>H&nbsp;:</strong> ensemble des patients en
                                        hospitalisation pour traitement des complications de la
                                        maladie soit en hospitalisation classique, soit en soins
                                        intensifs ou réanimation. Environ 75% des patients
                                        hospitalisés vont guérir et rejoindre le compartiment{' '}
                                        <strong>G</strong>. Malheureusement, environ 25% vont
                                        décéder au cours de leur hospitalisation et sont
                                        comptabilisés dans le compartiment <strong>DC</strong>
                                    </li>
                                    <li>
                                        <strong>DC&nbsp;:</strong> ensemble des patients décédés
                                    </li>
                                </ul>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={diagram} alt="Schéma du modèle SIR+H" />
                                </div>
                            </FormattedText>
                        )}
                        {tab === 1 && (
                            <FormattedText>
                                <h2>ACTIONS SUR LE GRAPHE</h2>
                                <p>
                                    En cliquant sur l’un des compartiments{' '}
                                    <Color name="exposed">Sains</Color>,{' '}
                                    <Color name="infected">Malades</Color>,{' '}
                                    <Color name="intensive_care">Hospitalisés</Color>,{' '}
                                    <Color name="recovered">Guéris</Color> et{' '}
                                    <Color name="death">Décédés</Color>, vous pouvez focaliser sur
                                    la courbe correspondante avec mise à l’échelle du graphe.
                                </p>
                                <p>
                                    Le curseur à gauche du graphe permet également d’ajuster la mise
                                    à l’échelle du graphe en fonction des courbes qui vous
                                    intéressent.
                                </p>
                                <p>
                                    Le survol du graphe par la souris affiche les effectifs de
                                    chaque compartiment à la date correspondante.
                                </p>
                                <p>
                                    La roulette de la souris permet un zoom temporel (horizontal)
                                    des courbes.
                                </p>
                                <p>
                                    Maintenir le clic gauche permet de déplacer les courbes zoomées
                                    de droite à gauche.
                                </p>
                                <h2>ACTION SUR LE SCENARIO DE LA SIMULATION</h2>
                                <p>
                                    L’interrupteur «&nbsp;<strong>Confinement</strong>&nbsp;» active
                                    ou désactive la période de confinement du 17 Mars 2020. (En cas
                                    de désactivation, la période de «&nbsp;
                                    <strong>Déconfinement</strong>
                                    &nbsp;» est alors également désactivée).
                                </p>
                                <p>
                                    L’interrupteur «&nbsp;<strong>Déconfinement</strong>
                                    &nbsp;» active ou désactive la période de déconfinement
                                </p>
                                <p>
                                    Le champ «&nbsp;date&nbsp;» permet de modifier la date du
                                    déconfinement.
                                </p>
                                <p>
                                    Le curseur <i>R0</i> modifie la valeur du <i>R0</i> en phase de
                                    déconfinement, ce qui permet de visualiser l’effet de mesures
                                    collectives de précaution sur l’évolution de l’épidémie.
                                </p>
                            </FormattedText>
                        )}
                        {tab === 2 && (
                            <FormattedText>
                                <h2 className={classes.warning}>ATTENTION</h2>
                                <p className={classes.warning}>
                                    Les paramètres utilisés sont des valeurs arbitraires choisies
                                    pour les besoins de la démonstration. Les résultats de cette
                                    simulation n’ont donc qu’une valeur pédagogique pour aider à
                                    comprendre les mécanismes d’une épidémie, et ne sont en aucun
                                    cas le reflet de la réalité, ni au niveau d’un territoire, ni au
                                    niveau national.
                                </p>
                                <h2>Le R0 :</h2>
                                <p>
                                    Le <strong>taux de reproduction</strong>, appelé R0, représente
                                    le nombre de personnes saines qu’un sujet infecté peut
                                    contaminer par jour. Le nombre de nouveaux contaminés, et donc
                                    la vitesse de propagation de l’épidémie, dépend directement du
                                    paramètre R0
                                </p>
                                <p>
                                    On peut montrer (et la simulation ci-dessous vous le
                                    visualisera) que :
                                </p>
                                <ul className={classes.noliststyle}>
                                    <li>
                                        Si R0 est inférieur à 1 l’épidémie va s’éteindre
                                        spontanément
                                    </li>
                                    <li>
                                        Si R0 est compris entre 1 et 1,5 l’épidémie progresse
                                        relativement lentement
                                    </li>
                                    <li>
                                        Si R0 est supérieur à 1,5 l’épidémie progresse rapidement
                                    </li>
                                </ul>
                                <p>
                                    Pour maitriser une épidémie il faut donc arriver à faire baisser
                                    R0 en dessous de 1. Les épidémiologistes ont depuis longtemps
                                    montré que R0 dépend de 3 facteurs principaux :
                                </p>
                                <p style={{ textAlign: 'center', marginTop: 12 }}>
                                    <Typography variant="h6">R0 = DMG * r * β</Typography>
                                </p>
                                <ul className={classes.noliststyle}>
                                    <li>
                                        <strong>DMG</strong> est la durée moyenne de guérison
                                        spontanée, sur laquelle on ne peut pas agir. Elle est
                                        caractéristique de chaque maladie. Pour le COVID19 elle est
                                        estimée à 9 jours
                                    </li>
                                    <li>
                                        <strong>r</strong> quantifie le nombre moyen de contacts par
                                        jour entre un sujet contaminant et un sujet sain. Ce facteur
                                        dépend principalement de la «&nbsp;vie sociale&nbsp;».
                                        L’objectif des mesures collectives de confinement et de
                                        «&nbsp;distanciation sociale&nbsp;» est de diminuer r
                                    </li>
                                    <li>
                                        <strong>β</strong> est la probabilité qu’un contact entre un
                                        sujet sain et un sujet contaminé provoque la contamination
                                        du sujet sain. Par exemple si β = 0,5 un contact sur 2 est
                                        contaminant&nbsp;; si β = 0,1 un contact sur 10 est
                                        contaminant. L’objectif des «&nbsp;gestes barrières&nbsp;»
                                        et des mesures de protection individuelles est de diminuer β
                                    </li>
                                </ul>
                                <p>
                                    Pour que des mesures collectives de confinement, de
                                    distanciation sociale et de gestes barrières soient efficaces
                                    pour maitriser une épidémie il faut qu’elles soient suffisamment
                                    rigoureuses et respectées pour que R0 devienne inférieur à 1.
                                    C’est toute la difficulté de l’équilibre à trouver entre
                                    maitrise de l’épidémie, et contraintes sociales et économiques.
                                </p>
                                <p>
                                    La simulation ci-dessous vous permettra de simuler les effets
                                    des mesures de confinement / déconfinement en fonction de leur
                                    date et de leur «&nbsp;rigueur&nbsp;» exprimée par la valeur de
                                    R0.
                                </p>
                            </FormattedText>
                        )}
                    </CardContent>
                    <CardActions className={classes.actions}>
                        {openOnMount && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={handleCloseAndDisableOpenOnMount}
                            >
                                Ne plus afficher
                            </Button>
                        )}
                        <Button variant="outlined" color="primary" onClick={handleClose}>
                            Fermer
                        </Button>
                    </CardActions>
                </Card>
            </Modal>
        </>
    );
};

export default InstructionsButton;
