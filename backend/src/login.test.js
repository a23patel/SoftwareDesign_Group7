const { knexClient } = require('./knexClient');

const valid_user = {
    username: 'abraar',
    password: 'FancyTest12',
    hashed_password: '3J9YmiYMzPzLfr3h96c4O/vKGjZuDwhpJo05wSJOZls='
};
const invalid_user = {
    username: 'eve',
    password: 'DubiousPassword13',
};
const bad_password = {
    username: 'abraar',
    password: 'NotRightPassword13',
};
const fake_token = 'obviousfaketoken';
const other_user = 'rishi';

beforeAll(async () => {
    await knexClient('users').del();
    await knexClient('users').insert({ 
        username: valid_user.username, 
        password: valid_user.hashed_password });
});

afterAll(async () => {
    await knexClient('users').del();
});

const { generate_token, validate_token, invalidate_token, create_user } = require('./login');

describe('The login module', () => {
    test('should load', async () => {
        expect(generate_token).not.toBe(undefined);
    });
    test('forbids illegal characters in usernames', async () => {
//        expect(async () => await create_user('it\'sme!', 'This1SecurePass')).toThrow();
        expect(create_user('it\'sme!', 'This1SecurePass')).rejects.toThrow();
    });
    test('forbids usernames to be too short', async () => {
        expect(create_user('a', 'This1SecurePass')).rejects.toThrow();
    });
    test('allows valid users to log in', async () => {
        expect(generate_token(valid_user.username, valid_user.password)).resolves.not.toBeUndefined();
    });
    test('forbid nonexistent users to log in', async () => {
        expect(generate_token(invalid_user.username, invalid_user.password)).rejects.toBeUndefined();
    });
    test('returns an error for incorrect password', async () => {
        expect(generate_token(bad_password.username, bad_password.password)).rejects.toBeUndefined();
    });
    test('generates valid tokens on successful login', async () => {
        expect(generate_token(valid_user.username, valid_user.password).then((token) => {
            return validate_token(valid_user.username, token)
        })).resolves.toBe('true');
    });
    test('does not validate forged tokens', () => {
        expect(validate_token(valid_user.username, fake_token)).toBe(false);
    });
    test('throws error if logout is attempted on an invalid token', () => {
        expect(() => invalidate_token(valid_user.username, fake_token)).toThrow();
    });
    test('successfully invalidates a valid token on log out', async () => {
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(token).not.toBeUndefined();
        const was_invalidated = invalidate_token(valid_user.username, token);
        expect(was_invalidated).toBe(true);
        expect(validate_token(valid_user.username, token)).toBe(false);
        expect(() => invalidate_token(valid_user.username, token)).toThrow();
    });
    test('does not allow log in as a different user with a valid token', async () => {
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(validate_token(other_user, token)).toBe(false);
    });
    test('does not allow invalidation of another user\'s token', async () => {
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(() => invalidate_token(other_user, token)).toThrow();
    });
});