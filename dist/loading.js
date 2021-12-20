import React from 'react';

const Loading = ({
  state
}) => {
  const message = ["연결중입니다.", "채팅 서버 상태를 확인해주세요."];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexFlow: "column",
      justifyContent: "center",
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "rgb(60, 60, 60, 50%)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: "center",
      fontSize: "0.9rem",
      fontWeight: "normal",
      color: "tomato",
      textShadow: "0.5px 0.5px #88473b"
    }
  }, message[state]));
};

export default Loading;