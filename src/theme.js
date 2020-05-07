import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: '0.9rem',
            },
        },
    },
});
