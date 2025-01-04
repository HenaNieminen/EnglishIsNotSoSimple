import axios from 'axios';

const fetchLang = async (setLanguages) => {
    try {
        const response = await axios.get(`/api/languages`);
        console.log(response);
        setLanguages(response.data);
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
};

const fetchWords = async (setWords) => {
    try {
        const response = await axios.get(`/api/words`);
        console.log(response);
        setWords(response.data);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

const fetchTrans = async (setTranslations) => {
    try {
        const response = await axios.get(`api/translations`);
        console.log(response);
        setTranslations(response.data);
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
}


export {
    fetchLang,
    fetchWords,
    fetchTrans
};