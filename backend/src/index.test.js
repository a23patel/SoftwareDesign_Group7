const axios = require('axios');

const app = require('./index');
const PORT = 3001;
const BACKEND_URL = `http://localhost:${PORT}`;

let server = undefined; 

beforeAll(() => {
    server = app.listen(PORT, () => {
        console.log(`Starting server listening on port ${PORT}`)
    });
});

beforeEach(() => {
    console.log('Performing setup');
});

afterEach(() => {
    console.log('Performing teardown');
});

afterAll(() => {
    server.close();
})

describe('The Express app', () => {
    const client = axios.create({ baseURL: BACKEND_URL });
    const clientWithAuth = (token) => axios.create({
        baseURL: BACKEND_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    test('should handle login/logout of valid users with valid passwords', async () => {
        const username = 'michael';
        const password = 'test1';
        const reqBody = { username, password };
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(e);
            throw Error('Failure 1');
        });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { console.log(e); throw Error('Failure 2'); });
    });
});
