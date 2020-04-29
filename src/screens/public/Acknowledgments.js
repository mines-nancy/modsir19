import React from 'react';
import { makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import CHUNancy from './logos/CHUNancy.png';
import Nancyclotep from './logos/NANCYCLOTEP.png';
import MinesNancy from './logos/MinesNancy.png';
import UniversiteLorraine from './logos/UniversiteLorraine.png';
import marmelab from './logos/marmelab.png';

const useStyles = makeStyles((theme) => ({
    alert: {
        marginBottom: theme.spacing(5),
    },
    logos: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        '& img': {
            maxHeight: 50,
        },
    },
}));

const Acknowledgments = () => {
    const classes = useStyles();

    return (
        <Alert icon={false} severity="info" className={classes.alert}>
            <p>
                Le projet MODSIR19, porté par le CHRU de Nancy et Mines Nancy, école d’ingénieurs de
                l’Université de Lorraine, s'inscrit dans le cadre de la crise sanitaire du Covid19.
            </p>

            <p>
                Il s’agit d’une initiative commune des élèves et alumni de Mines Nancy, en
                collaboration avec le CHRU de Nancy, sous la direction des Professeurs Gilles
                Karcher, Pierre-Etienne Moreau et Christian Rabaud, visant à modéliser et prévoir
                l’évolution de la pandémie Covid19 et ses conséquences sur l’occupation
                hospitalière. Marmelab accompagne l’équipe dans l'accélération du développement de
                cette interface.
            </p>

            <div className={classes.logos}>
                <a href="http://www.chru-nancy.fr">
                    <img src={CHUNancy} alt="CHU Nancy" />
                </a>
                <a href="https://mines-nancy.univ-lorraine.fr">
                    <img src={MinesNancy} alt="Ecole des Mines Nancy" />
                </a>
                <a href="https://www.univ-lorraine.fr">
                    <img src={UniversiteLorraine} alt="Université de Lorraine" />
                </a>
                <a href="https://nancyclotep.com/fr/accueil/">
                    <img src={Nancyclotep} alt="Nancyclotep" width="200" />
                </a>
                <a href="https://marmelab.com">
                    <img src={marmelab} alt="Marmelab" />
                </a>
            </div>
        </Alert>
    );
};

export default Acknowledgments;
