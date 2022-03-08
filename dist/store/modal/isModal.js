import { useState } from 'react';
export const initState = {
  isModal: false,
  handleIsModal: flag => {}
};
export function setContext() {
  const [isModal, setisModal] = useState(false);

  const handleIsModal = flag => setisModal(flag);

  return {
    isModal,
    handleIsModal
  };
}