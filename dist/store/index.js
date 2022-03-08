import React from 'react';
import ConfigureStoreProvider from './configureStore';

const RootContextProvider = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(ConfigureStoreProvider, null, children);
};

export default RootContextProvider;