import { useState } from 'react';

export { createTheme } from 'react-native-themesheet';
export { createCol, createRow } from 'react-native-col';

export * from './col';

export function useInput() {
  const [value, setValue] = useState('');
  const [isTouched, setTouched] = useState(false);

  function handleChange(val: string) {
    setTouched(true);
    setValue(val);
  }

  return {
    isTouched,
    handleChange,
    value,
  };
}
