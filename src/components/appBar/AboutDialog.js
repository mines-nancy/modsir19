import React from 'react';
import { useTranslate } from 'react-polyglot';
import { Dialog, DialogContent, DialogContentText, DialogTitle, MenuItem } from '@material-ui/core';
import { VERSION } from '../../config';

const AboutDialog = ({ onClose }) => {
    const [open, setOpen] = React.useState(false);
    const t = useTranslate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <div>
            <MenuItem onClick={handleClickOpen}>
                {t('appBar.about')} {t('projectTitle')}
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t('projectTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('appBar.developpedBy')} Mines-Nancy. © 2020.
                        <br />
                        {t('appBar.version')} {VERSION} -- {t('appBar.wip')}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default AboutDialog;
