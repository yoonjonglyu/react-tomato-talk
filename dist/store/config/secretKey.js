import { useState } from 'react';
export const initState = {
  secretKey: '',
  handleSecretKey: secretKey => {}
};
export function setContext() {
  const [secretKey, setSecretKey] = useState('');

  const handleSecretKey = secretKey => {
    if (secretKey.length > 0) setSecretKey(secretKey);
  };

  return {
    secretKey,
    handleSecretKey
  };
}