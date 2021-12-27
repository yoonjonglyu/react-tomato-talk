import React from 'react';

import ModalContextProvider from './modalContext';
import ConfigContextProvider from './configContext';

const RootContextProvider = ({ children }) => {
    return (
        <ConfigContextProvider>
            <ModalContextProvider>
                {children}
            </ModalContextProvider>
        </ConfigContextProvider>
    );
};

export default RootContextProvider;
