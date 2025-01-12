import { createContext, useState, useEffect } from 'react';
import { fetchLang, fetchWords, fetchTrans } from './backendfunc.jsx';
import { toast } from 'react-toastify';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [langs, setLangs] = useState([]);
    const [words, setWords] = useState([]);
    const [trans, setTrans] = useState([]);

    const syncData = async () => {
        try {
            const fetchedLang = await fetchLang();
            const fetchedWord = await fetchWords();
            const fetchedTrans = await fetchTrans();

            setLangs(fetchedLang);
            console.log('Fetched languages:', fetchedLang);
            setWords(fetchedWord);
            console.log('Fetched words:', fetchedWord);
            setTrans(fetchedTrans);
            console.log('Fetched translations:', fetchedTrans);
        } catch (error) {
            console.error('Error syncing data:', error);
            toast.error(`Error syncing data: ${error.message}`);
        }
    };
    useEffect(() => {
        console.log("Syncing data");
        syncData();
    }, []);

    return (
        <DataContext.Provider value={{ langs, words, trans, syncData }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext };
