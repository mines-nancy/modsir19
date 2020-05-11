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
            maxWidth: 800,
            maxHeight: '90%',
            padding: theme.spacing(3),
        },
    },
    warning: {
        fontStyle: 'italic'
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

    const handleButtonClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCloseAndDisableOpenOnMount = () => {
        setOpen(false);
        setOpenOnMount(false);
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
                Principe de modélisation
            </Button>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title="Principe de modélisation"
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
                            <h2 className={classes.warning}>ATTENTION</h2>
                            <p className={classes.warning}>
                                Les paramètres utilisés sont des valeurs arbitraires choisies pour les besoins
                                de la démonstration. Les résultats de cette simulation n’ont donc qu’une valeur
                                pédagogique pour aider à comprendre les mécanismes d’une épidémie, et ne sont en
                                aucun cas le reflet de la réalité, ni au niveau d’un territoire, ni au niveau national.
                            </p>
                            <h2>Principe :</h2>
                            <p>
                                Pour modéliser cette épidémie, on utilise le principe de l’analyse compartimentale.
                                L’ensemble de la population d’un territoire est répartie en 5 « compartiments ».
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
                        </FormattedText>
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
