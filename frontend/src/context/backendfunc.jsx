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
}

const fetchTrans = async () => {
    try {
        const response = await axios.get(`api/translations`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
}


export {
    fetchLang,
    fetchWords,
    fetchTrans
};