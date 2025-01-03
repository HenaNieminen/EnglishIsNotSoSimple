import { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [words, setWords] = useState([]);
    const [translations, setTranslations] = useState([]);

    return (
        <DataContext.Provider value={{ languages, words, translations, setLanguages, setWords, setTranslations }}>
            {children}
        </DataContext.Provider>
    );
};