import { useState } from 'react';
export const initState = {
  step: 0,
  handleStep: step => {}
};
export function setContext() {
  const [step, setStep] = useState(0);

  const handleStep = step => setStep(step);

  return {
    step,
    handleStep
  };
}