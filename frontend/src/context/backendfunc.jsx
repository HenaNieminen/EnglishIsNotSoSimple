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
        const response = await axios.get(`api/translations`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
};

const fetchLangById = async (id) => {

};

const fetchWordsById = async (id) => {

};

const fetchTransForWordId = async (id) => {

};

const postWords = async (langId, word) => {

};

const postTrans = async (id, transId) => {

};

const deleteWords = async (id) => {

};

const deleteTrans = async (wordId, transId) => {

};

const patchWords = async (id, langId, word) => {

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
