import React, { useContext } from 'react';
import { GraphContext } from './GraphProvider';
import { Edge } from './Edge';

export const Edges = () => {
    const { nodes } = useContext(GraphContext);
    if (nodes === null) {
        return null;
    }

    return Object.keys(nodes).map((name) =>
        nodes[name].targets.map((target) => (
            <Edge
                key={`${name}-${target}`}
                ref1={nodes[name].ref.current}
                ref2={nodes[target].ref.current}
            />
        )),
    );
};
