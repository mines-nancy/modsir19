import { useEffect } from 'react';
import LeaderLine from 'leader-line';

export const Edge = ({ ref1, ref2 }) => {
    useEffect(() => {
        if (ref1 && ref2) {
            new LeaderLine(ref1, ref2);
        }
    }, [ref1, ref2]);

    return null;
};
