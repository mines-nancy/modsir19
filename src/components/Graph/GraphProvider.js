import React, { useCallback } from 'react';

export const GraphProvider = ({ children }) => {
    const [nodes, setNodes] = React.useState(null);

    const registerNode = useCallback((name, ref, targets) => {
        setNodes((n) => {
            const node = { ref, targets };

            if (n === null) {
                return { [name]: node };
            } else
                return {
                    ...n,
                    [name]: node,
                };
        });
    }, []);

    return (
        <GraphContext.Provider
            value={{
                nodes,
                registerNode,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};

export const GraphContext = React.createContext({ nodes: null, registerNode: () => {} });
