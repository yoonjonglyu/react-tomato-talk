import React, { useContext } from 'react';
import SystemMessage from './systemMessage';
import PartnerMessage from './partnerMessage';
import UserMessage from './userMessage';
import { StoreContext } from '../../store/configureStore';

const ChatMessage = props => {
  const {
    messages,
    userId
  } = props;
  const {
    handleIsModal,
    handleModalContents
  } = useContext(StoreContext);

  const openImageModal = src => {
    handleModalContents( /*#__PURE__*/React.createElement("img", {
      src: src,
      style: {
        maxWidth: "100%",
        maxHeight: "100%"
      }
    }));
    handleIsModal(true);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, messages.map((current, idx) => {
    return /*#__PURE__*/React.createElement("article", {
      key: idx,
      style: {
        display: "flex",
        flexFlow: "column"
      }
    }, current.idx === '#system' && /*#__PURE__*/React.createElement(SystemMessage, {
      message: current.message
    }), current.idx !== '#system' && current.idx !== userId && /*#__PURE__*/React.createElement(PartnerMessage, {
      idx: current.idx,
      message: current.message,
      openImageModal: openImageModal,
      time: current.time
    }), current.idx !== '#system' && current.idx === userId && /*#__PURE__*/React.createElement(UserMessage, {
      message: current.message,
      openImageModal: openImageModal,
      time: current.time
    }));
  }));
};

export default ChatMessage;