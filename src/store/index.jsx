import React from 'react';

import ConfigureStoreProvider from './configureStore';

const RootContextProvider = ({ children }) => {
    return (
        <ConfigureStoreProvider>
            {children}
        </ConfigureStoreProvider>
    );
};

export default RootContextProvider;
