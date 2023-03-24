const axios = require('axios');

const app = require('./index');
const PORT = 3001;
const BACKEND_URL = `http://localhost:${PORT}`;

let server = undefined; 
let client = undefined;
let clientWithAuth = undefined;

beforeEach(() => {
    server = app.listen(PORT, () => {
        console.log(`Starting server listening on port ${PORT}`)
    });
    client = axios.create({ baseURL: BACKEND_URL });
    clientWithAuth = (token) => axios.create({
        baseURL: BACKEND_URL,
        headers: { Authorization: `Bearer ${token}`}
    });
});

afterEach(() => {
    server.close();
});

describe('The Express app', () => {
    test('should handle login/logout of valid users with valid passwords', async () => {
        const username = 'richard';
        const password = 'testpass';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: error in registration`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: error in login`);
            throw e;
        });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
    test('should allow users to view their profile', async () => {
        const username = 'robert';
        const password = 'testpass2';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: failure in registration`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: failure in login`);
            throw e;
        });
        await clientWithAuth(token).get('/api/profile/' + username)
            .then((response) => {
                const { fullname, email, address1, address2, city, state, zipcode, phone } = response.data;
                expect(fullname).toBe('');
                expect(email).toBe('');
                expect(address1).toBe('');
                expect(address2).toBe('');
                expect(city).toBe('');
                expect(state).toBe('');
                expect(zipcode).toBe('');
                expect(phone).toBe('');
            }).catch(e => {
                console.log(`Error: failure in fetching profile`);
                throw e;
        });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
    test('should allow users to edit their profile', async () => {
        const username = 'riley';
        const password = 'testpass3';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: failed to register`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: failed to login`);
            throw e;
        });
        let profileBody = {
            username,
            fullname: 'Robert Robertson',
            email: 'rob@uh.edu',
            address1: '111 Somewhere Street',
            address2: 'Apartment 2',
            city: 'Houston',
            state: 'TX',
            phone: '7137137133',
            zipcode: '77001'
        };
        await clientWithAuth(token).post('/api/profile/edit', profileBody)
            .then((response) => { })
            .catch(e => {
                console.log(`Error: failed to modify profile`);
                throw e;
            });
        await clientWithAuth(token).get('/api/profile/' + username)
            .then((response) => {
                const { fullname, email, address1, address2, city, state, zipcode, phone } = response.data;
                expect(fullname).toBe('Robert Robertson');
                expect(email).toBe('rob@uh.edu');
                expect(address1).toBe('111 Somewhere Street');
                expect(address2).toBe('Apartment 2');
                expect(city).toBe('Houston');
                expect(state).toBe('TX');
                expect(phone).toBe('7137137133');
                expect(zipcode).toBe('77001');
            }).catch(e => {
                console.log(`Error: failed to fetch profile`);
                throw e;
        });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
    test('should allow users to generate quotes', async () => {
        const username = 'roland';
        const password = 'testpass2';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: failed to register`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: failed to login`);
            throw e;
        });
        let profileBody = {
            username,
            fullname: 'Robert Robertson',
            email: 'rob@uh.edu',
            address1: '111 Somewhere Street',
            address2: 'Apartment 2',
            city: 'Houston',
            state: 'TX',
            phone: '7137137133',
            zipcode: '77001'
        };
        await clientWithAuth(token).post('/api/profile/edit', profileBody)
            .then((response) => { })
            .catch(e => {
                console.log(`Error: failed to modify profile`);
                throw e;
            });
        await clientWithAuth(token).get('/api/profile/' + username)
            .then((response) => {
                const { fullname, email, address1, address2, city, state, zipcode, phone } = response.data;
                expect(fullname).toBe('Robert Robertson');
                expect(email).toBe('rob@uh.edu');
                expect(address1).toBe('111 Somewhere Street');
                expect(address2).toBe('Apartment 2');
                expect(city).toBe('Houston');
                expect(state).toBe('TX');
                expect(phone).toBe('7137137133');
                expect(zipcode).toBe('77001');
            }).catch(e => {
                console.log(`Error: failed to fetch profile`);
                throw e;
        });
        const gallons = 5;
        await clientWithAuth(token).get('/api/quote/'+ username + '/' + gallons)
            .then((response) => {
                const { price, due } = response.data;
                expect(price).toBe(1.5);
                expect(due).toBeCloseTo(gallons*price);
            }).catch(e => { 
                console.log(e)
                throw e 
            });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
    test('should allow users to submit quotes', async () => {
        const username = 'rachel';
        const password = 'testpass2';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: failed to register`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: failed to login`);
            throw e;
        });
        let profileBody = {
            username,
            fullname: 'Robert Robertson',
            email: 'rob@uh.edu',
            address1: '111 Somewhere Street',
            address2: 'Apartment 2',
            city: 'Houston',
            state: 'TX',
            phone: '7137137133',
            zipcode: '77001'
        };
        await clientWithAuth(token).post('/api/profile/edit', profileBody)
            .then((response) => { })
            .catch(e => {
                console.log(`Error: failed to modify profile`);
                throw e;
            });
        await clientWithAuth(token).get('/api/profile/' + username)
            .then((response) => {
                const { fullname, email, address1, address2, city, state, zipcode, phone } = response.data;
                expect(fullname).toBe('Robert Robertson');
                expect(email).toBe('rob@uh.edu');
                expect(address1).toBe('111 Somewhere Street');
                expect(address2).toBe('Apartment 2');
                expect(city).toBe('Houston');
                expect(state).toBe('TX');
                expect(phone).toBe('7137137133');
                expect(zipcode).toBe('77001');
            }).catch(e => {
                console.log(`Error: failed to fetch profile`);
                throw e;
        });
        const gallons = 5;
        let price, due;
        const date = '2023-04-03';
        await clientWithAuth(token).get('/api/quote/'+ username + '/' + gallons)
            .then((response) => {
                console.log(response.data.price)
                price = response.data.price
                due = response.data.due
                expect(price).toBe(1.5);
                expect(due).toBeCloseTo(gallons*price);
            }).catch(e => { throw e });
        const quoteBody = { username, gallons, date, price, due };
        await clientWithAuth(token).post('/api/quote', quoteBody)
            .then((response) => { })
            .catch(e => { throw e });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
    test('should allow users to view quote history', async () => {
        const username = 'raquel';
        const password = 'testpass2';
        let reqBody = { username, password };
        await client.post('/api/register', reqBody).then((response) => {
            expect(response.data.msg).toBe('Success');
        }).catch(e => {
            console.log(`Error: failed to register`);
            throw e;
        });
        let token = undefined;
        await client.post('/api/login', reqBody).then((response) => {
            token = response.data.token;
            expect(token).not.toBeUndefined();
        }).catch(e => { 
            console.log(`Error: failed to login`);
            throw e;
        });
        let profileBody = {
            username,
            fullname: 'Robert Robertson',
            email: 'rob@uh.edu',
            address1: '111 Somewhere Street',
            address2: 'Apartment 2',
            city: 'Houston',
            state: 'TX',
            phone: '7137137133',
            zipcode: '77001'
        };
        await clientWithAuth(token).post('/api/profile/edit', profileBody)
            .then((response) => { })
            .catch(e => {
                console.log(`Error: failed to modify profile`);
                throw e;
            });
        let profile;
        await clientWithAuth(token).get('/api/profile/' + username)
            .then((response) => {
                const { fullname, email, address1, address2, city, state, zipcode, phone } = response.data;
                profile = response.data;
                expect(fullname).toBe('Robert Robertson');
                expect(email).toBe('rob@uh.edu');
                expect(address1).toBe('111 Somewhere Street');
                expect(address2).toBe('Apartment 2');
                expect(city).toBe('Houston');
                expect(state).toBe('TX');
                expect(phone).toBe('7137137133');
                expect(zipcode).toBe('77001');
            }).catch(e => {
                console.log(`Error: failed to fetch profile`);
                throw e;
        });
        const gallons = 5;
        let price, due;
        const date = '2023-04-03';
        await clientWithAuth(token).get('/api/quote/'+ username + '/' + gallons)
            .then((response) => {
                console.log(response.data.price)
                price = response.data.price
                due = response.data.due
                expect(price).toBe(1.5);
                expect(due).toBeCloseTo(gallons*price);
            }).catch(e => { throw e });
        const quoteBody = { username, gallons, date, price, due };
        await clientWithAuth(token).post('/api/quote', quoteBody)
            .then((response) => { })
            .catch(e => { throw e });
        await clientWithAuth(token).get('/api/history/' + username)
            .then((response) => {
                console.log(response.data)
                const { gallons, address, city, state, zipcode, date, price, due } = response.data.quotes[0];
                expect(gallons).toBe(quoteBody.gallons);
                expect(date).toBe(quoteBody.date);
                expect(price).toBe(quoteBody.price);
                expect(due).toBe(quoteBody.due);
                expect(address).toBe(profile.address1 + profile.address2);
                expect(city).toBe(profile.city);
                expect(state).toBe(profile.state);
                expect(zipcode).toBe(profile.zipcode);
            }).catch(e => { throw e });
        await clientWithAuth(token).post('/api/logout', { username, token })
            .then((response) => {})
            .catch(e => { throw e });
    });
});
