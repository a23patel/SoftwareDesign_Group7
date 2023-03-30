// Login module skeleton
const { initializeQuoteHistory } = require('./fuelquotes')
const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
const { knexClient } = require('./knexClient');

// TODO make this crypto secure!
const token_secret = 'mysecretkeylol';

// "Hard"-coded storage of username/passwords until we implement database
var users = new Map();
users.set('michael', 'test1');
users.set('abraar', 'test2');
users.set('dosbol', 'test3');
users.set('rishi', 'test4');

const username_validate = (username) => {
    // Validate the the username does not include any illegal characters and is the required length
    return username.match(/^[a-zA-z0-9]{3,}$/)
};

const password_validate = (password) => {
    return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
};

const is_valid = async (username, password) => {
    return knexClient.select('password').where('username', '=', username).from('USERS')
        .then((rows) => {
            if (rows.length !== 1) {
                console.log(`Our returned rows are ${rows}`)
                return false;
            }
            console.log(rows);
            const db_hash = rows[0]['password'];
            const passed_hash = SHA256(password).toString(Base64);
            console.log(`The stored hash is ${db_hash}, the passed hash is ${passed_hash}`)
            if (db_hash !== passed_hash) {
                return false;
            }
            return true;
        });
}

const username_exists = async (username) => {
    return knexClient.select('username').where('username', '=', username).from('USERS')
        .then((rows) => { return rows.length > 0 });
}

const useradd = async (username, password) => {
    return knexClient('users').insert({username, password: SHA256(password).toString(Base64)}).then((_) => { 
        console.log(`Adding user ${username} with ${SHA256(password).toString(Base64)} hashed password`)
    }).catch((e) => { throw e });
}

var invalid_sessions = new Map();

// TODO need to add input validation
const generate_token = async (username, password) => {
    // Validate that the username and password are in agreement
    // TODO implement a database lookup to do this
    //const is_valid = users.get(username) === password;
    //if (!is_valid) {
    const valid_user = await is_valid(username, password);
    console.log(valid_user);
    if (!valid_user) {
        throw new Error('Invalid user or password');
    }
    const token = jwt.sign({ username: username}, token_secret, { expiresIn: 1800 });
    invalid_sessions.delete(token);
    return token;
};

const validate_token = (username, token) => {
    if (invalid_sessions.has(token)) {
        return false;
    }
    else {
        try {
            const payload = jwt.verify(token, token_secret, { expiresIn: 1800 });
            return username === payload.username;
        }
        catch (e) {
            return false;
        }
    }
};

const invalidate_token = (username, token) => {
    if (invalid_sessions.has(token)) {
        throw Error('Cannot invalidate an invalid token!');
    }
    try {
        const payload = jwt.verify(token, token_secret, { expiresIn: 1800 });
        if (username !== payload.username) {
            throw Error('Cannot invalidate an invalid token!');
        }
        invalid_sessions.set(token, 1);
    }
    catch (e) {
        throw Error('Cannot invalidate an invalid token!');
    }
    return true;
};

const create_user = async (username, password) => {
    if (await username_exists(username)) {
        throw Error('User already exists');
    } else if (!username_validate(username)) {
        throw Error('Username contains illegal characters or is the wrong length');
    } else if (!password_validate(password)) {
        throw Error('Password contains illegal characters or is not the correct length');
    }
    //users.set(username, password);
    console.log("Test: got here")
    try {
        await useradd(username, password)
    } catch (e) {
        console.log(e);
        throw e;
    }
    console.log("Test: got here too")
    initializeQuoteHistory(username);
    return true;
}

module.exports = { generate_token, validate_token, invalidate_token, create_user };