import React from 'react';
import { useTranslate } from 'react-polyglot';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton, Menu, Tooltip } from '@material-ui/core';
import AboutDialog from './AboutDialog';

const useStyles = makeStyles((theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
    }),
);

const LeftMenu = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const t = useTranslate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Tooltip title={t('appBar.mainMenu')}>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                >
                    <MenuIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <AboutDialog onClose={handleCloseMenu} />
            </Menu>
        </div>
    );
};
export default LeftMenu;
