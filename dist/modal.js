import React, { useContext } from 'react';
import { ModalContext } from './store/modalContext';

const Modal = () => {
  const {
    handleIsModal,
    modalContents
  } = useContext(ModalContext);

  const closeModal = () => {
    handleIsModal(false);
  };

  return /*#__PURE__*/React.createElement("article", {
    style: {
      position: "absolute",
      display: "flex",
      flexFlow: "column",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      background: "rgb(0,0,0, 0.5)"
    },
    onClick: closeModal
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "modal-box",
    style: {
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "center",
      minWidth: "50%",
      minHeight: "30%",
      margin: "0 auto",
      background: "#bb5f5f",
      borderRadius: "3px"
    }
  }, modalContents));
};

export default Modal;