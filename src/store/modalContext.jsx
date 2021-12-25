import React, { createContext, useState } from 'react';

export const ModalContext = createContext({
    isModal: false,
    modalContents: '',
    handleIsModal: (data) => { },
    handleModal: (data) => { }
});

const ModalContextProvider = ({ children }) => {
    const [isModal, setisModal] = useState(false);
    const [modalContents, setModalContents] = useState();
    const handleIsModal = (data) => setisModal(data);
    const handleModal = (data) => setModalContents(data);

    return (
        <ModalContext.Provider
            value={{
                isModal,
                modalContents,
                handleModal,
                handleIsModal
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export default ModalContextProvider;
