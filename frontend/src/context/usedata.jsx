import { useContext } from 'react';
import DataContext from './datacontext.jsx';

export const useData = () => useContext(DataContext);