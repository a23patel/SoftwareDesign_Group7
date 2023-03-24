import axios from 'axios';
import { baseURL } from './config';

// Create an unauthenticated Axios client pointing at the API base
// Calls to POST and GET requests are made relative to baseURL/api
const client = axios.create({
    baseURL: `${baseURL}/api`,
});

// Wrapper for authentication with a token
// Creates an Axios client with Bearer authorization using our token
// Calls to POST and GET requests are made relative to baseURL/api
const clientWithAuth = (token) => axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        Authorization: `Bearer ${token}`,
    }
});

export { client, clientWithAuth };