import { createContext, useState } from 'react';
import { fetchLang, fetchWords, fetchTrans } from 'backendfunc.jsx'

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [words, setWords] = useState([]);
    const [trans, setTrans] = useState([]);

    const syncData = async () => {
        try {
            await fetchLang(setLanguages);
            await fetchWords(setWords);
            await fetchTrans(setTrans);
        } catch (error) {
            console.log('Error syncing data:', error);
        }
    };

    return (
        <DataContext.Provider value={{ languages, words, trans, setLanguages, setWords, setTrans, syncData }}>
            {children}
        </DataContext.Provider>
    );
};