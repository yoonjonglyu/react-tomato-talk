import React, { useContext } from 'react';
import PotoIcon from '../../assets/poto.png';
import ChatEvents from '../../lib/chatEvents';
import { ConfigContext } from '../../store/configContext';
import { ModalContext } from '../../store/modalContext';

const SendPoto = ({
  socket
}) => {
  const {
    room,
    imageSize
  } = useContext(ConfigContext);
  const {
    handleIsModal,
    handleModal
  } = useContext(ModalContext);

  const openModal = message => {
    handleModal( /*#__PURE__*/React.createElement("h3", {
      style: {
        width: "80%",
        margin: "0 auto",
        textAlign: "center",
        fontSize: "1rem",
        color: "rgb(94 22 22)"
      }
    }, message));
    handleIsModal(true);
  };

  const handleFile = e => {
    const file = e.target.files;

    if (file !== null) {
      const Events = new ChatEvents(socket);
      const mb = 1024 * 1024;
      const result = Events.sendImage(file[0], room, imageSize * mb);

      if (!result) {
        openModal(`${imageSize}MB 이하의 이미지 파일만 전송 할 수 있습니다.`);
      }
    }

    e.target.value = '';
  };

  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      marginRight: "3px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PotoIcon,
    width: "30px"
  }), /*#__PURE__*/React.createElement("input", {
    type: "file",
    style: {
      display: "none"
    },
    onChange: handleFile,
    accept: "image/*"
  }));
};

export default SendPoto;