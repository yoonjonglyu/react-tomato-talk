import { useState } from 'react';
export const initState = {
  modalContents: '',
  handleModalContents: contents => {}
};
export function setContext() {
  const [modalContents, setModalContents] = useState();

  const handleModalContents = contents => setModalContents(contents);

  return {
    modalContents,
    handleModalContents
  };
}