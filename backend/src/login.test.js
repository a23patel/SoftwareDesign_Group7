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
afterAll(() => knexClient.destroy());

describe('The login module', () => {
    test('sanity check', () => {
        expect(1+1).toBe(2);
    });
    test('should load', async () => {
        expect(generate_token).not.toBe(undefined);
    });
    test('allows valid username and password for registration', async () => {
        return expect(create_user(valid_user.username, valid_user.password)).resolves.not.toBeUndefined();
    });
    test('forbids illegal characters in usernames', async () => {
        return expect(create_user('it\'sme!', 'This1SecurePass')).rejects.toThrow();
    });
    test('forbids usernames to be too short', async () => {
        return expect(create_user('a', 'This1SecurePass')).rejects.toThrow();
    });
    test('allows valid users to log in', async () => {
        await create_user(valid_user.username, valid_user.password);
        return expect(generate_token(valid_user.username, valid_user.password)).resolves.not.toBeUndefined();
    });
    test('forbid nonexistent users to log in', async () => {
        return expect(generate_token(invalid_user.username, invalid_user.password)).rejects.toThrow();
    });
    test('returns an error for incorrect password', async () => {
        await create_user(valid_user.username, valid_user.password);
        return expect(generate_token(bad_password.username, bad_password.password)).rejects.toThrow();
    });
    test('generates valid tokens on successful login', async () => {
        await create_user(valid_user.username, valid_user.password);
        return expect(generate_token(valid_user.username, valid_user.password).then((token) => {
            return validate_token(valid_user.username, token)
        })).resolves.toBe(true);
    });
    test('does not validate forged tokens', async () => {
        await create_user(valid_user.username, valid_user.password);
        return expect(validate_token(valid_user.username, fake_token)).resolves.toBe(false);
    });
    test('throws error if logout is attempted on an invalid token', async () => {
        await create_user(valid_user.username, valid_user.password);
        return expect(invalidate_token(valid_user.username, fake_token)).rejects.toThrow();
    });
    test('successfully invalidates a valid token on log out', async () => {
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        const was_invalidated = await invalidate_token(valid_user.username, token);
        expect(was_invalidated).toBe(true);
        //return expect(invalidate_token(valid_user.username, token)).rejects.toThrow();
        return expect(invalidate_token(valid_user.username, token)).rejects.toThrow();
    });
    test('does not allow log in as a different user with a valid token', async () => {
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        return expect(await validate_token(other_user, token)).toBe(false);
    });
    test('does not allow invalidation of another user\'s token', async () => {
        await create_user(valid_user.username, valid_user.password);
        const token = await generate_token(valid_user.username, valid_user.password);
        return expect(invalidate_token(other_user, token)).rejects.toThrow();
    });
});