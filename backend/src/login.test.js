const { knexClient } = require('./knexClient');
const { generate_token, validate_token, invalidate_token, create_user } = require('./login');

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

const db_cleanup = () => knexClient.transaction(async trx => {
    await trx('sessions').del();
    await trx('profile').del();
    await trx('quote').del();
    await trx('users').del();
});

beforeEach(() => db_cleanup());
afterEach(() => db_cleanup());

describe('The login module', () => {
    test('sanity check', () => {
        expect(1+1).toBe(2);
    });
    test('should load', async () => {
        expect(generate_token).not.toBe(undefined);
    });
    test('allows valid username and password for registration', async () => {
        expect(create_user(valid_user.username, valid_user.password)).resolves.not.toBeUndefined();
    });
    test('forbids illegal characters in usernames', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
//        expect(async () => await create_user('it\'sme!', 'This1SecurePass')).toThrow();
        expect(create_user('it\'sme!', 'This1SecurePass')).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('forbids usernames to be too short', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        expect(create_user('a', 'This1SecurePass')).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('allows valid users to log in', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        expect(generate_token(valid_user.username, valid_user.password)).resolves.not.toBeUndefined();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('forbid nonexistent users to log in', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        expect(generate_token(invalid_user.username, invalid_user.password)).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('returns an error for incorrect password', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        expect(generate_token(bad_password.username, bad_password.password)).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('generates valid tokens on successful login', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        expect(generate_token(valid_user.username, valid_user.password).then((token) => {
            return validate_token(valid_user.username, token)
        })).resolves.toBe(true);
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('does not validate forged tokens', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        expect(await validate_token(valid_user.username, fake_token)).toBe(false);
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('throws error if logout is attempted on an invalid token', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        expect(invalidate_token(valid_user.username, fake_token)).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('successfully invalidates a valid token on log out', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(token).not.toBeUndefined();
        const was_invalidated = await invalidate_token(valid_user.username, token);
        expect(was_invalidated).toBe(true);
        //expect(await validate_token(valid_user.username, token)).toBe(false);
        expect(invalidate_token(valid_user.username, token)).resolves.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('does not allow log in as a different user with a valid token', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(await validate_token(other_user, token)).toBe(false);
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
    test('does not allow invalidation of another user\'s token', async () => {
        await knexClient('sessions').del();
        await knexClient('users').del();
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        expect(invalidate_token(other_user, token)).rejects.toThrow();
        await knexClient('sessions').del();
        await knexClient('users').del();
    });
});