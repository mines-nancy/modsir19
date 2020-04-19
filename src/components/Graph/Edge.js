import { useEffect } from 'react';
import LeaderLine from 'leader-line';

export const Edge = ({
    ref1,
    ref2,
    options = {},
    anchorStartOptions = {},
    anchorEndOptions = {},
}) => {
    useEffect(() => {
        let line;
        let timeout;

        if (ref1 && ref2) {
            timeout = setTimeout(() => {
                line = new LeaderLine(
                    LeaderLine.pointAnchor(ref1, {
                        x: anchorStartOptions.x || '50%',
                        y: anchorStartOptions.y || '100%',
                    }),
                    LeaderLine.pointAnchor(ref2, {
                        x: anchorEndOptions.x || '50%',
                        y: anchorEndOptions.y || 0,
                    }),
                );

                let refreshLinePositionsInterval = null;
                const start = () => {
                    refreshLinePositionsInterval = setInterval(() => {
                        window.requestAnimationFrame(() => line.position());
                    }, 200);
                };
                const stop = () => {
                    if (refreshLinePositionsInterval) {
                        clearInterval(refreshLinePositionsInterval);
                        refreshLinePositionsInterval = null;
                    }
                };
                window.addEventListener('graph:refresh:start', () => {
                    start();
                    setTimeout(stop, 10000);
                });

                window.addEventListener('graph:refresh:stop', () => {
                    setTimeout(stop, 1000);
                });

                line.setOptions({ startSocket: 'bottom', endSocket: 'top', size: 3, ...options });
            }, 500);
        }

        return () => {
            timeout && clearTimeout(timeout);
            line && line.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref1, ref2]);

    return null;
};
