import axios from 'axios';

const fetchLang = async () => {
    try {
        const response = await axios.get(`/api/languages`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
};

const fetchWords = async () => {
    try {
        const response = await axios.get(`/api/words`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching words:', error);
    }
};

const fetchTrans = async () => {
    try {
        const response = await axios.get(`/api/translations`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
};

const fetchLangById = async (id) => {
    try {
        await axios.get(`/api/languages/${id}`);
    } catch (error) {
        console.error('Error fetching language', error);
    }
};

const fetchWordsById = async (id) => {
    try {
        await axios.get(`/api/words/${id}`);
    } catch (error) {
        console.error('Error fetching word', error);
    }
};

const fetchTransForWordId = async (id) => {
    try {
        await axios.get(`/api/translationsforword/${id}`);
    } catch (error) {
        console.error('Error fetching word', error);
    }
};

const postWords = async (langId, word) => {
    try {

    } catch (error) {

    }
};

const postTrans = async (id, transId) => {
    try {

    } catch (error) {

    }
};

const deleteWords = async (id) => {
    try {

    } catch (error) {

    }
};

const deleteTrans = async (wordId, transId) => {
    try {

    } catch (error) {

    }
};

const patchWords = async (id, langId, word) => {
    try {

    } catch (error) {

    }
};

export {
    fetchLang,
    fetchWords,
    fetchTrans,
    fetchLangById,
    fetchWordsById,
    fetchTransForWordId,
    postWords,
    postTrans,
    deleteWords,
    deleteTrans,
    patchWords,
};
