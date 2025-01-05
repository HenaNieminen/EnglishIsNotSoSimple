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
        console.error('Error fetching translations for word', error);
    }
};

const postWords = async (word) => {
    //Word object should contain the langId and the word as text
    try {
        await axios.post(`/api/words/`, word);
    } catch (error) {
        console.error('Error posting word', error);
    }
};

const postTrans = async (trans) => {
    //Trans should contain id and trans_id
    try {
        await axios.post(`/api/translations`, trans);
    } catch (error) {
        console.error('Error posting translation', error);
    }
};

const deleteWords = async (id) => {
    try {
        await axios.delete(`/api/words/${id}`);
    } catch (error) {
        console.error('Error deleting word', error);
    }
};

const deleteTrans = async (wordId, transId) => {
    try {
        await axios.delete(`/api/words/${wordId}&${transId}`);
    } catch (error) {
        console.error('Error deleting translation', error);
    }
};

const patchWords = async (newWord) => {
    //newWord object assumes id, langId and word are all there
    try {
        await axios.patch(`/api/words/`, newWord);
    } catch (error) {
        console.error('Error editing word', error);
    }
};

/*Consistency may become a problem. I need to make sure that the variable names align
with the database at some point if problems arise*/

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
