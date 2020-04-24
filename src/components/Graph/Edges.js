import React, { useContext } from 'react';
import { GraphContext } from './GraphProvider';
import { Edge } from './Edge';

export const Edges = () => {
    const { nodes } = useContext(GraphContext);
    if (nodes === null) {
        return null;
    }

    return Object.keys(nodes).map((name) =>
        nodes[name].targets.map((target, index) => {
            const targetName = typeof target === 'string' ? target : target.name;
            const options = typeof target === 'string' ? {} : target.options;

            return (
                <Edge
                    key={`${name}-${targetName}-${index}`}
                    ref1={nodes[name].ref.current}
                    ref2={nodes[targetName].ref.current}
                    options={options}
                    anchorStartOptions={options.anchorStart}
                    anchorEndOptions={options.anchorEnd}
                />
            );
        }),
    );
};
