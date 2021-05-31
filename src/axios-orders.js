import axios from 'axios';

const instance = axios.create({
    baseURL : "https://myburgerbuilder-49bac-default-rtdb.firebaseio.com/"
});

export default instance;