import { rest } from 'msw';

/*
    Definitions for mock JSON API handlers
    It can be run inside of a Service Worker for interactive browser testing,
    or be used inside Jest for integration testing
 */

let users = new Map();
users.set('michael', {
    fullname: 'michael',
    password: 'test1',
    email: 'test1@uh.edu',
    address1: '7001 Calhoun Rd',
    address2: '',
    city: 'Houston',
    state: 'TX',
    zipcode: '77001',
    phone: '7137778888',
});
users.set('abraar', {
    fullname: 'abraar',
    password: 'test2',
    email: 'test2@uh.edu',
    address1: '7001 Calhoun Rd',
    address2: '',
    city: 'Houston',
    state: 'TX',
    zipcode: '77001',
    phone: '7138889999',
});
users.set('dosbol', {
    fullname: 'dosbol',
    password: 'test3',
    email: 'test3@uh.edu',
    address1: '7001 Calhoun Rd',
    address2: '',
    city: 'Houston',
    state: 'TX',
    zipcode: '77001',
    phone: '7138882222',
});

let sessions = new Map();
let history = new Map();
history.set('abraar', [{
    gallons: 3.7,
    address: '7001 Calhoun Rd',
    city: 'Houston',
    state: 'TX',
    zipcode: '77001',
    date: "2023-01-01",
    price: 5.00, 
    due: 3.7*5.00,
}, {
    gallons: 4.1,
    address: '302 N Grace St',
    city: 'Lombard',
    state: 'IL',
    zipcode: '60645',
    date: "2023-01-02",
    price: 6.00, 
    due: 4.1*6.00,
}, {
    gallons: 6.2,
    address: '7132 Nicolls St',
    city: 'Riverside',
    state: 'CA',
    zipcode: '92509',
    date: "2023-01-03",
    price: 8.00, 
    due: 6.2*8.00,
}, {
    gallons: 7.1,
    address: '2300 Perry Blvd',
    city: 'Atlanta',
    state: 'GA',
    zipcode: '30314',
    date: "2023-01-04",
    price: 4.5, 
    due: 7.1*4.5,
}, {
    gallons: 5.6,
    address: '11802 N Lane Dr',
    city: 'Lakewood',
    state: 'OH',
    zipcode: '44107',
    date: "2023-01-05",
    price: 7.2, 
    due: 5.6*7.2,
}]);

//const valid_token = (username, token) => { return token === 'secrettoken93423'; };
const valid_token = (username, token) => { return true; };

const valid_password = (username, password) => {
    //    return true; 
    return password === users.get(username).password;
};

const generate_token = (username) => { return 'secrettoken93423'; };

const handlers = [
    rest.post('http://localhost:3001/api/login', async (req, res, ctx) => {
        const { username, password } = await req.json();
        if (!users.has(username) || !valid_password(username, password)) {
            return res(
                ctx.status(400),
                ctx.json({
                    message: `Error: login failed for ${username}`
                })
            )
        }
        const token = generate_token(username);
        sessions.set(username, token)
        return res(
            ctx.status(200),
            ctx.json({
                username,
                token,
                password,
            })
        )
    }),
    rest.get('http://localhost:3001/api/profile/:username', (req, res, ctx) => {
        const { username } = req.params;
        const { token } = req.headers.get('Authorization').split(' ')[1];
        let result = undefined;
        if (users.has(username) && valid_token(username, token)) {
            result = users.get(username);
            return res(
                ctx.status(200),
                ctx.json(result)
            );
        }
        else {
            return res(
                ctx.status(400),
                ctx.json({ message: `Error: login of username ${username} invalid!` })
            );
        }
    }),
    rest.post('http://localhost:3001/api/profile/edit', async (req, res, ctx) => {
        const { username, ...profile } = await req.json();
        const { token } = req.headers.get('Authorization').split(' ')[1];
        if (users.has(username) && valid_token(username, token)) {
            users.set(username, profile);
            return res(
                ctx.status(200),
                ctx.json({ message: `Profile saved`})
            );
        }
        else {
            return res(
                ctx.status(400),
                ctx.json({ message: `Error updating profile`})
            );
        }
    }),
    rest.get('http://localhost:3001/api/history/:username', (req, res, ctx) => {
        const { username } = req.params;
        const { token } = req.headers.get('Authorization').split(' ')[1];
        if (!users.has(username) || !valid_token(username, token)) {
            return res(
                ctx.status(400),
                ctx.json({ message: `Invalid credentials` })
            );
        }
        let result = []
        if (history.get(username)) {
            result = history.get(username);
        }
        return res(
            ctx.status(200),
            ctx.json({ quotes: result, message: `Operation successful` })
        );
    }),
    rest.get('http://localhost:3001/api/quote/:username/:gallons', (req, res, ctx) => {
        const { username, gallons } = req.params;
        const { token } = req.headers.get('Authorization').split(' ')[1];
        if (!users.has(username) || !valid_token(username, token)) {
            return res(
                ctx.status(400),
                ctx.json({ message: `Invalid credentials` })
            );
        }
        const price = 2.50;
        const due = gallons * price;
        return res(
            ctx.status(200),
            ctx.json({ price, due, message: `Operation succeeded` })
        );
    }),
    rest.post('http://localhost:3001/api/quote', async (req, res, ctx) => {
        const { username, address1, address2, city, state, zipcode, gallons, date, price, due } = await req.json();
        const { token } = req.headers.get('Authorization').split(' ')[1];
        if (!users.has(username) || !valid_token(username, token)) {
            return res(
                ctx.status(400),
                ctx.json({ message: `Invalid credentials` })
            );
        }
        let quotes = history.get(username);
        if (!quotes) {
            history.set(username, []);
            quotes = [];
        }
        history.set(username, quotes.concat({
            gallons,
            address: address1+' '+address2,            
            city,
            state,
            zipcode,
            date,
            price,
            due,
        }));
        return res(
            ctx.status(200),
            ctx.json({ message: `Operation succeeded` })
        );
    }),
    rest.post('http://localhost:3001/api/register', async (req, res, ctx) => {
        const { username, email, phone, password } = await req.json();
        if (users.has(username) || password === undefined || email === undefined) {
            return res(
                ctx.status(400),
                ctx.json({ message: `Registration failed` })
            );
        }
        else {
            users.set(username, {
                username,
                password,
                email,
                address1: '',
                address2: '',
                city: '',
                state: '',
                zip: '',
                phone
            });
            return res(
                ctx.status(200),
                ctx.json({ message: `Registration succeeded for ${username}` })
            );
        }
    }),
    rest.post('http://localhost:3001/api/logout', async (req, res, ctx) => {
        const { username } = await req.json();
        const { token } = req.headers.get('Authorization').split(' ')[1];
        if (sessions.has(username) && valid_token(username, token)) {
            sessions.delete(username);
            return res(
                ctx.status(200),
                ctx.json({ message: `Logout successful for ${username}` })
            );
        }
        else {
            return res(
                ctx.status(400),
                ctx.json({ message: `No session found for ${username} or token invalid` })
            )
        }
    }),

];

module.exports = { handlers };
