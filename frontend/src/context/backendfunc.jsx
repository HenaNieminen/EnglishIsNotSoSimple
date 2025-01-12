import axios from 'axios';

const fetchLang = async () => {
    try {
        const response = await axios.get(`/api/languages`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        return [];
    }
};

const fetchWords = async () => {
    try {
        const response = await axios.get(`/api/words`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        return [];
    }
};

const fetchTrans = async () => {
    try {
        const response = await axios.get(`/api/translations`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        return [];
    }
};

const fetchLangById = async (id) => {
    try {
        const response = await axios.get(`/api/languages/${id}`);
        return response.data;
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const fetchWordsById = async (id) => {
    try {
        const response = await axios.get(`/api/words/${id}`);
        return response.data
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const fetchTransForWordId = async (id) => {
    try {
        const response = await axios.get(`/api/translationsforword/${id}`);
        return response.data;
    } catch (error) {
        //If not found, just return nothing.
        if (error.status === 404) {
            return null;
        };
        return error;
    }
};

const postWords = async (word) => {
    //Word object should contain the langId and the word as text
    try {
        await axios.post(`/api/words`, {
            langId: word.lang_id,
            word: word.word,
        });
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const postTrans = async (trans) => {
    //Trans should contain id and trans_id
    try {
        await axios.post(`/api/translations`, trans);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const deleteWords = async (id) => {
    try {
        await axios.delete(`/api/words/${id}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const deleteTrans = async (wordId, transId) => {
    try {
        await axios.delete(`/api/words/${wordId}&${transId}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
    }
};

const patchWords = async (newWord) => {
    //Seems like I was passing it incorrectly hence edits did not work
    try {
        await axios.patch(`/api/words`, {
            id: newWord.id,
            langId: newWord.lang_id,
            word: newWord.word,
        });
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        return error;
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
