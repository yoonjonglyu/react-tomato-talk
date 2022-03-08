import React, { createContext, useState } from 'react';
import RootState from './rootState';
export const StoreContext = /*#__PURE__*/createContext({ ...RootState.reduce((result, context) => ({ ...result,
    ...context.initState
  }), {})
});

const ConfigureStore = ({
  children
}) => {
  const state = RootState.reduce((result, context) => ({ ...result,
    ...context.setContext()
  }), {});
  return /*#__PURE__*/React.createElement(StoreContext.Provider, {
    value: { ...state
    }
  }, children);
};

export default ConfigureStore;