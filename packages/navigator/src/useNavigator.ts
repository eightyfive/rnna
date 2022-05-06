import { useContext } from 'react';
import { NavigatorContext } from './NavigatorContext';

export const useNavigator = () => {
  return useContext(NavigatorContext);
};
