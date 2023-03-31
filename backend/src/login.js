// Login module skeleton
const { initializeQuoteHistory } = require('./fuelquotes')
const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
const { knexClient } = require('./knexClient');

// TODO make this crypto secure!
const token_secret = 'mysecretkeylol';

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

const make_invalid = async (username, token) => {
    knexClient('sessions').insert({username, token})
        .catch((e) => {throw e});
}

const token_is_invalid = async (token) => {
    const rows = await knexClient.select().where('token', '=', token).from('sessions');
    if (rows.length > 0) {
        console.log(`TESTING: token_is_invalid yields ${rows.length} rows`);
        return true;
    }
    return false;
}

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
    return token;
};

const validate_token = async (username, token) => {
    if (await token_is_invalid(token)) {
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

const invalidate_token = async (username, token) => {
    try {
        const payload = jwt.verify(token, token_secret, { expiresIn: 1800 });
        if (username !== payload.username) {
            console.log(`DEBUG: token passed to invalidate_token is for a different user`);
            throw Error('Cannot invalidate an invalid token!');
        }
        if (await token_is_invalid(token)) {
            console.log(`DEBUG: token passed to invalidate_token has already been invalidated`);
            throw Error('Cannot invalidate an invalid token!');
        }
        console.log(`DEBUG: attempting to list token as invalidated...`);
        await make_invalid(username, token);
        return true;
    } catch (e) {
        throw Error('Cannot invalidate an invalid token!');
    }
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
    return true;
}

module.exports = { generate_token, validate_token, invalidate_token, create_user };