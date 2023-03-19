import { render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
    jest.spyOn(Storage.prototype, 'setItem');
    const mockedUsedNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockedUsedNavigate,
    }));
    jest.spyOn(window, 'alert').mockImplementation(() => { });
});

describe("Login page", () => {
    test('should be able to mount', async () => {
        expect(() => {
            render(<LoginForm />, { wrapper: BrowserRouter });
        }).not.toThrow();
    });
    test('valid user should be able to log in', async () => {
        render(<LoginForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByRole('textbox', { name: /user/i }), 'abraar');
        await userEvent.type(screen.getByPlaceholderText(/.*password.*/), 'test2');
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith('username', 'abraar');
        }, { timeout: 3000 });
        expect(alert).toHaveBeenCalledTimes(0);
        expect(localStorage.setItem).toHaveBeenCalledWith('username', 'abraar');
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'secrettoken93423');
    });
    test('invalid user should not be able to log in', async () => {
        render(<LoginForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByRole('textbox', { name: /user/i }), 'abraar');
        await userEvent.type(screen.getByPlaceholderText(/.*password.*/), 'badpass');
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(alert).toHaveBeenCalledTimes(1);
        }, { timeout: 3000 });
        expect(alert).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).not.toHaveBeenCalledWith('username', 'abraar');
        expect(localStorage.setItem).not.toHaveBeenCalledWith('token', 'secrettoken93423');
    });
});