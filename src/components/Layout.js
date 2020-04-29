import React from 'react';
import { MainAppBar } from './appBar/MainAppBar';
import { makeStyles } from '@material-ui/core';
import { Footer } from './Footer';

const useStyles = makeStyles({
    container: {
        paddingTop: ({ withoutAppbar }) => (withoutAppbar ? 0 : 64),
        minHeight: '98vh',
    },
    toolbar: {
        minHeight: 32,
        display: 'flex',
        justifyContent: 'space-between',
    },
    link: {
        color: 'white',
    },
});

const Layout = ({ className, children, withoutAppbar, ...props }) => {
    const classes = useStyles({ withoutAppbar });

    return (
        <div className={className}>
            {!withoutAppbar && <MainAppBar {...props} />}
            <div className={classes.container}>{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
