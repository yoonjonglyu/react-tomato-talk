import React, { createContext, useState } from 'react';
export const ModalContext = /*#__PURE__*/createContext({
  isModal: false,
  modalContents: '',
  handleIsModal: data => {},
  handleModal: data => {}
});

const ModalContextProvider = ({
  children
}) => {
  const [isModal, setisModal] = useState(false);
  const [modalContents, setModalContents] = useState();

  const handleIsModal = data => setisModal(data);

  const handleModal = data => setModalContents(data);

  return /*#__PURE__*/React.createElement(ModalContext.Provider, {
    value: {
      isModal,
      modalContents,
      handleModal,
      handleIsModal
    }
  }, children);
};

export default ModalContextProvider;