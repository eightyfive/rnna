import { useContext } from 'react';
import { NavigatorContext } from './NavigatorContext';

export const useNavigator = () => {
  const { navigator } = useContext(NavigatorContext);

  return navigator;
};
