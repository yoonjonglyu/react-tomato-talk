import React, { createContext, useState } from 'react';
import RootState from './rootState';

export const StoreContext = createContext({
    ...RootState.reduce((result, context) => ({
        ...result,
        ...context.initState,
    }), {})
});

const ConfigureStore = ({ children }) => {
    const state = RootState.reduce((result, context) => ({
        ...result,
        ...context.setContext(),
    }), {});

    return (
        <StoreContext.Provider
            value={{
                ...state
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export default ConfigureStore;
