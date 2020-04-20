import React from 'react';
import { makeStyles } from '@material-ui/core';

import Layout from '../components/Layout';

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: 32,
        '& h1': {
            fontSize: 38,
        },
    },
}));

const Legals = () => {
    const classes = useStyles();

    return (
        <Layout>
            <div className={classes.container}>
                <h1>Mentions Légales</h1>
                <p>
                    <strong>Membres de l’équipe projet MODSIR19</strong>
                </p>
                <ul>
                    <li>
                        Professeurs Gilles Karcher (CHRU Nancy, Nancyclotep) et Pierre-Etienne
                        Moreau (Mines Nancy)
                    </li>
                    <li>Steeven Frezier (Nancyclotep)</li>
                    <li>Paul Festor, Arnaud Mozziconacci, Romain Pajda (Élèves Mines Nancy)</li>
                    <li>Agathe Bastit, Loïc Befve (Alumni Mines Nancy)</li>
                    <li>Julien Demangeon, Kevin Maschtaler et Florian Ferbach (Marmelab)</li>
                </ul>
                <p style={{ marginTop: 32 }}>
                    <strong>Nancyclotep</strong>
                </p>
                <p>
                    Groupement d’intérêt économique (GIE)
                    <br />
                    Code APE : Activités de radiodiagnostic et de radiothérapie (8622A)
                    <br />
                    RCS : 498 276 328 R.C.S
                    <br />
                </p>
                <p>Siret : 49827632800016</p>
                <p>
                    Adresse : 29 avenue Mal de Lattre de Tassigny 54000 NANCY
                    <br />
                    Tel : 07.62.64.72.97
                    <br />
                    Mail : Informatique@1179111.admin.sd5.gpaas.net
                    <br />
                </p>
                <p>Directeur de la publication : Gilles Karcher</p>
                <p style={{ marginTop: 32 }}>
                    <strong>Hébergeur</strong>
                </p>
                <p>
                    OVH
                    <br />
                    SAS au capital de 10 069 020 €<br />
                    RCS Lille Métropole 424 761 419 00045
                    <br />
                    Code APE 2620Z
                    <br />
                    N° TVA : FR 22 424 761 419
                    <br />
                    Siège social : 2 rue Kellermann - 59100 Roubaix - France
                    <br />
                </p>
            </div>
        </Layout>
    );
};

export default Legals;
