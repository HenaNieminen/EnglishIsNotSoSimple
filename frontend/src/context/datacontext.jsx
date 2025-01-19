import { createContext, useState, useEffect } from 'react';
import { fetchLang, fetchWords, fetchTrans } from './backendfunc.jsx';
import { toast } from 'react-toastify';
//Create the context to use
const DataContext = createContext();

export const DataProvider = ({ children }) => {
    //Set the states for data from all tables in the database
    const [ langs, setLangs ] = useState([]);
    const [ words, setWords ] = useState([]);
    const [ trans, setTrans ] = useState([]);

    const syncData = async () => {
        try {
            //Sync all data in one nice clump
            const fetchedLang = await fetchLang();
            const fetchedWord = await fetchWords();
            const fetchedTrans = await fetchTrans();

            //Set all general states
            setLangs(fetchedLang);
            setWords(fetchedWord);
            setTrans(fetchedTrans);
        } catch (error) {
            //Catch errors and spit out its error code.
            toast.error(`Error syncing data: ${error.response.status}`);
        }
    };
    useEffect(() => {
        //Sync all data when the site loads
        syncData();
    }, []);

    return (
        //Make a provider for the DataContext, giving the states and syncData function to refresh data
        <DataContext.Provider value={{ langs, words, trans, syncData }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext };
