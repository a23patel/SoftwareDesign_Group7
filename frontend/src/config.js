const node_env = process.env.NODE_ENV

const test = {
    baseURL: 'http://localhost:3000',
    start_mock: true
}

const development = {
    baseURL: 'http://localhost:3001',
    start_mock: false
}

const production = {
    baseURL: process.env.REACT_APP_BASE_URL,
    start_mock: false
}

const config = () => {
    if (node_env.match(/prod/)) {
        return production
    } else if (node_env.match(/test/)) {
        return test
    } else {
        return development
    }
}

const baseURL = config().baseURL

const start_mock = config().start_mock

export { baseURL, start_mock }