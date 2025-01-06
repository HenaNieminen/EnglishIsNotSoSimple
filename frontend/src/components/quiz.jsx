import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/datacontext';

const Quiz = ({ language }) => {
    const { langs, words, trans } = useContext(DataContext);

};

export default Quiz;