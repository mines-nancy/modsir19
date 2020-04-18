import { useEffect } from 'react';
import LeaderLine from 'leader-line';

export const Edge = ({ ref1, ref2 }) => {
    let line;

    useEffect(() => {
        if (ref1 && ref2) {
            line = new LeaderLine(
                LeaderLine.pointAnchor(ref1, { x: '50%', y: '100%' }),
                LeaderLine.pointAnchor(ref2, { x: '50%', y: 0 }),
                { size: 3 },
            );

            line.setOptions({ startSocket: 'bottom', endSocket: 'top' });
        }

        return () => line && line.remove();
    }, [ref1, ref2]);

    return null;
};
