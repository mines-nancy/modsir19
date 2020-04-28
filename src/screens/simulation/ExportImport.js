import React, { useState } from 'react';
import { Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { GetApp, Publish } from '@material-ui/icons';
import { format } from 'date-fns';

export const ExportButton = ({ timeframes }) => {
    const handleExport = () => {
        const json = JSON.stringify({
            version: 1,
            data: timeframes,
        });

        const el = document.createElement('a');
        el.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(json)}`);
        el.setAttribute('download', `modsir-export-${format(new Date(), 'yyyy-MM-dd')}.json`);
        el.style.display = 'none';

        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    };

    return (
        <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<GetApp />}
            onClick={handleExport}
        >
            Exporter
        </Button>
    );
};

const parseDate = (timeframe) => ({ ...timeframe, start_date: new Date(timeframe.start_date) });

export const ImportButton = ({ setTimeframes }) => {
    const [error, setError] = useState(false);

    const handleImport = () => {
        const el = document.createElement('input');
        el.setAttribute('type', 'file');
        el.setAttribute('accept', 'application/json,.json');
        el.style.display = 'none';
        el.onchange = () => {
            try {
                const file = el.files[0];
                const reader = new FileReader();

                reader.onload = (evt) => {
                    try {
                        const content = evt.target.result;
                        setTimeframes(JSON.parse(content).data.map(parseDate));
                    } catch (e) {
                        setError(true);
                    }
                };

                reader.readAsText(file, 'utf-8');
            } catch (e) {
                setError(true);
                return;
            }
        };

        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    };

    return (
        <>
            <Button
                style={{ marginLeft: 8 }}
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Publish />}
                onClick={handleImport}
            >
                Importer
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={error}
                autoHideDuration={5000}
                onClose={() => setError(false)}
                message=""
            >
                <Alert severity="error">
                    Le fichier {"d'export"} semble corrompu, impossible de {"l'importer"}
                </Alert>
            </Snackbar>
        </>
    );
};
