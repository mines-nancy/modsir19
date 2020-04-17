import React from 'react';
import { useTranslate } from 'react-polyglot';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';

import Layout from '../../components/Layout';
import exampleImage from './visualisation-example.png';
import diagram from './SIRH-diagram.jpg';

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: 32,
        '& h1': {
            fontSize: 38,
        },
    },
    img: {
        width: '100%',
    },
    aside: {
        marginTop: 10,
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
                    <Grid item xs={12} sm={4} component="aside" className={classes.aside}>
                        <img
                            className={classes.img}
                            src={exampleImage}
                            alt={t('home.visualisation_example_desc')}
                            title={t('home.visualisation_example_desc')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} component="section">
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
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                            vitae mattis nibh. Nullam eget leo arcu. Cras tempor justo vitae magna
                            porta finibus. Maecenas in ex ut libero accumsan lobortis ut nec massa.
                            Aliquam vestibulum pharetra nunc, ut euismod odio. Pellentesque orci
                            turpis, molestie in venenatis sit amet, efficitur et enim. Curabitur
                            euismod magna vel tortor faucibus pulvinar. Nunc posuere metus id
                            elementum feugiat. Morbi eu feugiat massa. Aliquam lobortis enim a est
                            vulputate, eget facilisis risus fermentum. Sed condimentum dui vel arcu
                            venenatis imperdiet. Nulla hendrerit lacus eu rutrum interdum. Aenean
                            vitae ullamcorper ex. Vivamus pharetra ex vel libero fringilla
                            sollicitudin.
                        </p>

                        <p>
                            Vivamus quis lacus id quam egestas pulvinar. Vivamus finibus eros
                            consequat quam varius luctus. Vivamus vehicula non diam sit amet porta.
                            Cras et erat viverra erat pharetra bibendum. Nunc id lacinia lacus.
                            Mauris tincidunt dui non pulvinar eleifend. Morbi scelerisque ante
                            justo, eu mattis nibh pretium eget. Suspendisse nec metus a nisl
                            malesuada tincidunt. Vestibulum rutrum velit sed volutpat volutpat.
                            Etiam lectus nisl, fringilla at nibh et, dictum faucibus nunc.
                        </p>

                        <p>
                            <img
                                src={diagram}
                                className={classes.img}
                                alt={t('home.model_diagram')}
                                title={t('home.model_diagram')}
                            />
                        </p>

                        <p>
                            Sed sit amet pharetra magna. Praesent quis diam nibh. Nam velit felis,
                            sodales ac placerat eu, porta nec lorem. In tempus sapien nec orci
                            vehicula posuere. Sed mollis cursus mi hendrerit aliquet. Proin eget
                            ultricies libero, et maximus mi. Donec gravida posuere malesuada.
                            Quisque semper est purus, et tristique turpis lacinia sed. Ut
                            ullamcorper magna lacinia urna vulputate, id cursus quam convallis.
                            Donec faucibus a massa non lobortis.
                        </p>

                        <p>
                            Cras in pharetra leo. Vivamus interdum urna id libero suscipit rutrum.
                            Morbi tincidunt sapien sit amet imperdiet porta. Ut feugiat vitae neque
                            vitae venenatis. Curabitur tristique tincidunt nunc, sit amet vehicula
                            magna hendrerit nec. Cras suscipit nulla vel varius sagittis. Quisque
                            quis faucibus augue, eget dapibus nulla. Aenean tristique lectus a
                            maximus viverra.
                        </p>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default Home;
