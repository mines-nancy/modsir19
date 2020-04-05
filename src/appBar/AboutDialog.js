import React from 'react';
import { useTranslate } from 'react-polyglot';
import { MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { VERSION } from '../utils/config';

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
            <MenuItem onClick={handleClickOpen}>{t('appBar.about')} MODCOV19</MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'MODCOV19'}</DialogTitle>
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
