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


export {
    fetchLanguages
};