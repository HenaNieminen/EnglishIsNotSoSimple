import axios from 'axios';

//Axios get request for languages
const fetchLang = async () => {
    try {
        const response = await axios.get(`/api/languages`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            //Returns an empty array if none are found
            return [];
        }
        throw error;
    }
};

//Get request for words
const fetchWords = async () => {
    try {
        const response = await axios.get(`/api/words`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        throw error;
    }
};

//Get request for translations
const fetchTrans = async () => {
    try {
        const response = await axios.get(`/api/translations`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        throw error;
    }
};

//Get request for getting language by ID
const fetchLangById = async (id) => {
    try {
        const response = await axios.get(`/api/languages/${id}`);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        throw error;
    }
};

//Get request to get words by ID
const fetchWordsById = async (id) => {
    try {
        const response = await axios.get(`/api/words/${id}`);
        return response.data
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        throw error;
    }
};

//Get request to get all translations for a word
const fetchTransForWordId = async (id) => {
    try {
        const response = await axios.get(`/api/translationsforword/${id}`);
        return response.data;
    } catch (error) {
        //If not found, just return nothing.
        if (error.status === 404) {
            return [];
        };
        throw error;
    }
};

//Post request for inserting words
const postWords = async (word) => {
    await axios.post(`/api/words`, {
        langId: word.lang_id,
        word: word.word,
    });
};

//Post request for inserting translations
const postTrans = async (wordId, transId) => {
    await axios.post(`/api/translations`, {
        id: wordId,
        transId: transId
    });
};

//Delete request for words
const deleteWords = async (id) => {
    await axios.delete(`/api/words/${id}`);
};

//Delete request for translations
const deleteTrans = async (wordId, transId) => {
    await axios.delete(`/api/translations/${wordId}&${transId}`);
};

//Patch request for words
const patchWords = async (newWord) => {
    await axios.patch(`/api/words`, {
        id: newWord.id,
        langId: newWord.lang_id,
        word: newWord.word,
    });
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
