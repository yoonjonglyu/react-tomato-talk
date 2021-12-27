import React from 'react';
import ModalContextProvider from './modalContext';
import ConfigContextProvider from './configContext';

const RootContextProvider = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(ConfigContextProvider, null, /*#__PURE__*/React.createElement(ModalContextProvider, null, children));
};

export default RootContextProvider;