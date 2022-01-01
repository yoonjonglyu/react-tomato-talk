import React from 'react';

const PartnerMessage = (props) => {
    const {
        idx,
        message,
        openImageModal,
        time
    } = props;

    const messageStyle = {
        maxWidth: "58%",
        padding: "8px",
        margin: "8px",
        fontSize: "1rem",
        color: "#1b1b1b",
        wordBreak: "break-word",
        background: "#eeeeee",
        borderRadius: "6px",
    };
    const boxStyle = {
        display: "flex",
        flex: "1",
        flexFlow: "row",
        width: "100%",
        margin: 0,
        marginRight: "auto"
    };

    return (
        <>
            <span
                style={{
                    paddingLeft: "8px",
                    fontSize: "0.8rem",
                }}
            >
                {idx}
            </span>
            <p style={boxStyle}>
                {
                    message.slice(0, 5) !== '@$IMG' ?
                        <span
                            data-testid="partner"
                            style={messageStyle}
                        >
                            {message}
                        </span > :
                        <img
                            data-testid="partner-image"
                            src={message.slice(5)}
                            style={messageStyle}
                            onClick={() => openImageModal(message.slice(5))}
                            alt="전송된 이미지"
                        />
                }
                <time
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        marginBottom: "8px",
                        fontSize: "0.7rem",
                    }}
                >
                    {time}
                </time>
            </p>
        </>
    );
};

export default PartnerMessage;