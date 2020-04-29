import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslate } from 'react-polyglot';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(1),
        },
        progress: {
            fill: 'white',
        },
    }),
);

export const MainAppBar = ({ loading, actions }) => {
    const classes = useStyles();
    const t = useTranslate();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Link component={RouterLink} color="inherit" to="/">
                            {t('projectTitle')}
                        </Link>
                    </Typography>
                    {loading && <CircularProgress color="inherit" />}
                    {actions}
                </Toolbar>
            </AppBar>
        </div>
    );
};
