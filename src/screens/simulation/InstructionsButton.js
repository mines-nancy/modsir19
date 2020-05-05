import React, { useState } from 'react';
import {
    Button,
    Modal,
    makeStyles,
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    Tooltip,
    CardActions,
} from '@material-ui/core';
import { HelpOutline, Close } from '@material-ui/icons';

import FormattedText from './FormattedText';
import colors from './colors';

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
            maxWidth: 800,
            maxHeight: '90%',
            padding: theme.spacing(3),
        },
    },
    actions: {
        justifyContent: 'flex-end',
    },
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
    const classes = useStyles();
    const [open, setOpen] = useState(true /*debug*/);

    const handleButtonClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                Comment ça marche ?
            </Button>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title="Utilisation du simulateur MODSIR19"
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
                        <FormattedText>
                            <Typography variant="h6">ACTIONS SUR LE GRAPHE</Typography>
                            <p>
                                En cliquant sur l’un des compartiments{' '}
                                <Color name="exposed">Sains</Color>,{' '}
                                <Color name="infected">Malades</Color>,{' '}
                                <Color name="intensive_care">Hospitalisés</Color>,{' '}
                                <Color name="recovered">Guéris</Color> et{' '}
                                <Color name="death">Décédés</Color>, vous pouvez focaliser sur la
                                courbe correspondante avec mise à l’échelle du graphe.
                            </p>
                            <p>
                                Le curseur à gauche du graphe permet également d’ajuster la mise à
                                l’échelle du graphe en fonction des courbes qui vous intéressent.
                            </p>
                            <p>
                                Le survol du graphe par la souris affiche les effectifs de chaque
                                compartiment à la date correspondante.
                            </p>
                            <p>
                                La roulette de la souris permet un zoom temporel (horizontal) des
                                courbes.
                            </p>
                            <p>
                                Maintenir le clic gauche permet de déplacer les courbes zoomées de
                                droite à gauche.
                            </p>
                            <Typography variant="h6">
                                ACTION SUR LE SCENARIO DE LA SIMULATION
                            </Typography>
                            <p>
                                L’interrupteur «&nbsp;<strong>Confinement</strong>&nbsp;» active ou
                                désactive la période de confinement du 16 Mars 2020. (En cas de
                                désactivation, la période de «&nbsp;<strong>Déconfinement</strong>
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
                                déconfinement ce qui permet de visualiser l’effet de mesures
                                collectives de précaution sur l’évolution de l’épidémie.
                            </p>
                            <Typography variant="h6">EXEMPLES DE SCENARII</Typography>
                            <ol>
                                <li>
                                    <strong>
                                        Comment le confinement impact le nombre de patients
                                        hospitalisés ?
                                    </strong>
                                    <ul>
                                        <li>
                                            Zoomer sur la courbe d'hospitalisés en cliquant sur la
                                            case <Color name="intensive_care">Hospitalisés</Color>
                                        </li>
                                        <li>
                                            Cliquer sur l’interrupteur «&nbsp;
                                            <strong>Confinement</strong>&nbsp;» pour le désactiver
                                        </li>
                                        <li>
                                            Vérifier l’effet sur la courbe des patients hospitalisés
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>
                                        Quel est le risque d'une seconde vague si les gestes
                                        barrières sont respectés ?
                                    </strong>
                                    <ul>
                                        <li>
                                            Configurer le <i>RO</i> du «&nbsp;
                                            <strong>Déconfinement</strong>&nbsp;» à une valeur de{' '}
                                            <strong>1,5</strong>
                                        </li>
                                        <li>
                                            Zoomer sur la courbe des madales en cliquant sur la case{' '}
                                            <Color name="infected">Malades</Color>
                                        </li>
                                        <li>Vérifier l’effet sur la courbe des malades</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>
                                        Que se passe-t-il si le confinement s'arrête plus tôt, sans
                                        mesures particulières ?
                                    </strong>
                                    <ul>
                                        <li>
                                            Configurer le <i>RO</i> du «&nbsp;
                                            <strong>Déconfinement</strong>&nbsp;» à une valeur de{' '}
                                            <strong>3,1</strong>
                                        </li>
                                        <li>
                                            Changer la date du «&nbsp;
                                            <strong>Déconfinement</strong>&nbsp;» au{' '}
                                            <strong>30 Avril</strong>
                                        </li>
                                        <li>
                                            Zoomer sur la courbe des patients en cliquant sur la
                                            case <Color name="intensive_care">Hospitalisés</Color>
                                        </li>
                                        <li>
                                            Vérifier l’effet sur les courbes des patients et des
                                            décès
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        </FormattedText>
                    </CardContent>
                    <CardActions className={classes.actions}>
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
