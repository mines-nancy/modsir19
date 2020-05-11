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

const R0Button = () => {
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
                Qu'est-ce que le R0 ?
            </Button>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title="Qu'est-ce que le R0 ?"
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
                        <h2>Le R0 :</h2>
                          <p>
                            Le <strong>taux de reproduction</strong>, appelé R0,  représente le nombre de personnes saines qu’un sujet infecté
                            peut contaminer par jour. Le nombre de nouveaux contaminés, et donc la vitesse de propagation de
                            l’épidémie, dépend directement du paramètre R0
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

export default R0Button;
