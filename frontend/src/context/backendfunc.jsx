import axios from 'axios';

const fetchLanguages = async (setLanguages) => {
    try {
        //Get the env for the api url from the viteconfig
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${URL}languages`);
        setLanguages(response.data);
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
};

const fetchWords = async (setWords) => {
    try {
        //Get the env for the api url from the viteconfig
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${URL}words`);
        setWords(response.data);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

const fetchTranslations = async (setTranslations) => {
    try {
        //Get the env for the api url from the viteconfig
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${URL}translations`);
        setTranslations(response.data);
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
}


export {
    fetchLanguages,
    fetchWords,
    fetchTranslations
};