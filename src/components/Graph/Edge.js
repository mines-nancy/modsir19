import { useEffect } from 'react';
import LeaderLine from 'leader-line';

export const Edge = ({ ref1, ref2, options = {} }) => {
    let line;

    useEffect(() => {
        let timeout;

        if (ref1 && ref2) {
            timeout = setTimeout(() => {
                line = new LeaderLine(
                    LeaderLine.pointAnchor(ref1, { x: '50%', y: '100%' }),
                    LeaderLine.pointAnchor(ref2, { x: '50%', y: 0 }),
                );

                line.setOptions({ startSocket: 'bottom', endSocket: 'top', size: 3, ...options });
            }, 500);
        }

        return () => {
            timeout && clearTimeout(timeout);
            line && line.remove();
        };
    }, [ref1, ref2]);

    return null;
};
