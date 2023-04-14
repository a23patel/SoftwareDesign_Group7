const axios = require('axios');

// Helper functions for using Axios

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

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

module.exports = { client, clientWithAuth };