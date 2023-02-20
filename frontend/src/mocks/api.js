import { setupWorker, rest } from 'msw';

/*
    Definitions for mock JSON API handlers to be run in a Service Worker
 */

let users = new Map();
users.set('michael', {
        username: 'michael',
        email: 'test1@uh.edu',
        address1: '7001 Calhoun',
        address2: '',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        phone: '7137778888',
});

//const valid_token = (username, token) => { return token === 'secrettoken93423'; };
const valid_token = (username, token) => { return true; };

const handlers = [
    rest.post('/api/login', async (req, res, ctx) => {
        const { username, password } = await req.json();
        return res(
            ctx.json({
                username,
                token: 'secrettoken93423',
                password: password,
            })
        )
    }),
    rest.get('/api/profile/:username', (req, res, ctx) => {
        const { username } = req.params;
        const { token } = req.headers.get('Authorization').split(' ')[1];
        let result = undefined;
        if (users.has(username) && valid_token(username, token)) {
            result = users.get(username);
            result.token = token;
            return res(
               ctx.status(200),
               ctx.json(result)
            );
        }
        else {
            return res(
                ctx.status(400),
                ctx.json({ message: `Error: login of username ${username} invalid!`})
            );
        }
    }),
    // rest.post('/api/profile', (req, res, ctx) => {
    //     const { username, token, name, email, address1, address2, city, state, zip, phone } = req.json();
    //     let result = { username, token, name, email, address1, address2, city, state, zip, phone };
    //     if (username === 'michael' && valid_token(username, token)) {
    //         users.set(username, result);
    //     }
    // }),
    // rest.get('/debug_success', (req, res, ctx) => {
    //     return res(
    //         ctx.status(200),
    //         ctx.body('Debug message: success')
    //     )
    // }),
    // rest.get('/debug_fail', (req, res, ctx) => {
    //     return res(
    //         ctx.status(404),
    //         ctx.body('Debug message: failure')
    //     )
    // })
];

export const worker = setupWorker(...handlers)