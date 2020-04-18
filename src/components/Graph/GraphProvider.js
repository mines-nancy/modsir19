import React, { useCallback } from 'react';

export const GraphProvider = ({ children }) => {
    const [nodes, setNodes] = React.useState(null);
    const [version, setVersion] = React.useState(0);

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

    const refresh = useCallback(() => {
        setVersion((version) => version + 1);
    }, []);

    return (
        <GraphContext.Provider
            value={{
                nodes,
                registerNode,
                refresh,
                version,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};

export const GraphContext = React.createContext({
    nodes: null,
    registerNode: () => {},
    refresh: () => {},
    version: 0,
});
