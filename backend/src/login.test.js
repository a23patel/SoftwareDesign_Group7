const valid_user = {
    username: 'abraar',
    password: 'test',
};
const invalid_user = {
    username: 'eve',
    password: 'badpass',
};
const bad_password = {
    username: 'abraar',
    password: 'wrongpass',
};
const fake_token = 'obviousfaketoken';

const { generate_token, validate_token, invalidate_token } = require('./login');

describe('The login module', () => {
    test('should load', () => {
        
        expect(generate_token).not.toBe(undefined);
    });
    test('allows valid users to log in', () => {
        let token = undefined;
        try {
            token = generate_token(valid_user.username, valid_user.password);
        } catch (e) {
            token = undefined;
        }
        expect(token).not.toBeUndefined();
    });
    test('forbid nonexistent users to log in', () => {
        let token = undefined;
        try {
            token = generate_token(invalid_user.username, invalid_user.password);
        } catch (e) {
            token = undefined;
        }
        expect(token).toBeUndefined();
    });
    test('returns an error for incorrect password', () => {
        let token = undefined;
        try {
            token = generate_token(bad_password.username, bad_password.password);
        } catch (e) {
            token = undefined;
        }
        expect(token).toBeUndefined();
    });
    test('generates valid tokens on successful login', () => {
        let token = undefined
        try {
            token = generate_token(valid_user.username, valid_user.password);
        } catch (e) {
            token = undefined;
        }
        expect(validate_token(valid_user.username, token)).toBe(true);
    });
    test('does not validate forged tokens', () => {
        expect(validate_token(valid_user.username, fake_token)).toBe(false);
    });
    test('throws error if logout is attempted on an invalid token', () => {
        expect(() => invalidate_token(valid_user.username, fake_token)).toThrow();
    });
    test('successfully invalidates a valid token on log out', () => {
        const token = generate_token(valid_user.username, valid_user.password);
        expect(token).not.toBeUndefined();
        const was_invalidated = invalidate_token(valid_user.username, token);
        expect(was_invalidated).toBe(true);
        expect(() => invalidate_token(valid_user.username, token)).toThrow();
    });
});