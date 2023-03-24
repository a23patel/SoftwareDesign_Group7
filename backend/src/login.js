// Login module skeleton
const { initializeQuoteHistory } = require('./fuelquotes')
const jwt = require('jsonwebtoken');

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

var invalid_sessions = new Map();

// TODO need to add input validation
const generate_token = (username, password) => {
    // Validate that the username and password are in agreement
    // TODO implement a database lookup to do this
    const is_valid = users.get(username) === password;
    if (!is_valid) {
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

const create_user = (username, password) => {
    if (users.has(username)) {
        throw Error('User already exists');
    } else if (!username_validate(username)) {
        throw Error('Username contains illegal characters or is the wrong length');
    } else if (!password_validate(password)) {
        throw Error('Password contains illegal characters or is not the correct length');
    }
    users.set(username, password);
    initializeQuoteHistory(username);
    return true;
}

module.exports = { generate_token, validate_token, invalidate_token, create_user };