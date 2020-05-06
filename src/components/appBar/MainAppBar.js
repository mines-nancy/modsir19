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
            flex: '1 0 0',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flex: '1 0 0',
        },
        menuButton: {
            marginRight: theme.spacing(1),
        },
        progress: {
            fill: 'white',
            marginLeft: theme.spacing(2),
        },
        loadingContainer: {
            minWidth: 64,
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
                    {actions}
                    {typeof loading !== 'undefined' && (
                        <div className={classes.loadingContainer}>
                            {loading && (
                                <CircularProgress className={classes.progress} color="inherit" />
                            )}
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};
