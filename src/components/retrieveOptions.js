import axios from 'axios';

const retrieveOptions = async (endpoint, body) => {
    //retrieves the options for specified input box from backend (to keep API keys safe)
    let regions = await axios.post(endpoint, body)
    return regions.data
}

export default retrieveOptions