import { createContext, useState, useEffect } from 'react';
import { fetchLang, fetchWords, fetchTrans } from 'backendfunc.jsx'
import { toast } from 'react-toastify';
/*Toast is a library to get toast alerts on the right upper corner
of the screen. I'm not sure if this is the correct way to use these,
but this is how I utilized them in my other react project to notify the user on
what the hell is going on*/

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [words, setWords] = useState([]);
    const [trans, setTrans] = useState([]);

    const syncData = async () => {
        //Sync all data from the backend
        try {
            await fetchLang(setLanguages);
            await fetchWords(setWords);
            await fetchTrans(setTrans);
        //Catch an error if something happens
        } catch (error) {
            console.log('Error syncing data:', error);
            toast.error("Error syncing data");
        }
    };

    useEffect(() => {
        syncData();
    }, []);

    return (
        <DataContext.Provider value={{ languages, words, trans, setLanguages, setWords, setTrans, syncData }}>
            {children}
        </DataContext.Provider>
    );
};