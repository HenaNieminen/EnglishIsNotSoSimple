const connect = (array) => {
    const apiUrl = `/api/locations`;
    async function getDatabase() {
        try {
            //Use async await fetch to get the data
            const response = await fetch(apiUrl);
            const data = await response.json();
            array(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    getDatabase();
}

export default connect;