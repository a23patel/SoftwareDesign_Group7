import { render, screen, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

jest.spyOn(window, 'alert').mockImplementation(() => { });

describe("Registration page", () => {
    test('should be able to mount', async () => {
        expect(() => {
            render(<RegistrationForm />, { wrapper: BrowserRouter });
        }).not.toThrow();
    });
    test('nonexistent user should be able to register and log in', async () => {
        jest.spyOn(Storage.prototype, 'setItem');
        render(<RegistrationForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByLabelText(/User Name/i), 'robert');
        await userEvent.type(screen.getByLabelText(/Email/i), 'robert@uh.edu');
        await userEvent.type(screen.getByLabelText(/Phone/i), '9997778888');
        await userEvent.type(screen.getByLabelText(/^Password/i), 'Testpassword5');
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'Testpassword5');
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile/edit');
        }, { timeout: 3000 });
        expect(alert).toHaveBeenCalledTimes(0);
        expect(localStorage.setItem).toHaveBeenCalledWith('username', 'robert');
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'secrettoken93423');
    });
    test('user that already exists should not be able to register', async () => {
        jest.spyOn(Storage.prototype, 'setItem');
        render(<RegistrationForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByLabelText(/User Name/i), 'michael');
        await userEvent.type(screen.getByLabelText(/Email/i), 'robert@uh.edu');
        await userEvent.type(screen.getByLabelText(/Phone/i), '9997778888');
        await userEvent.type(screen.getByLabelText(/^Password/i), 'Testpassword5');
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'Testpassword5');
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/registration');
        }, { timeout: 3000 });
        expect(alert).toHaveBeenCalled();
        expect(localStorage.setItem).not.toHaveBeenCalledWith('username', 'michael');
        expect(localStorage.setItem).not.toHaveBeenCalledWith('token', 'secrettoken93423');
    });
    test('non-matching passwords should not be validated', async () => {
        jest.spyOn(Storage.prototype, 'setItem');
        render(<RegistrationForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByLabelText(/User Name/i), 'robert');
        await userEvent.type(screen.getByLabelText(/Email/i), 'robert@uh.edu');
        await userEvent.type(screen.getByLabelText(/Phone/i), '9997778888');
        await userEvent.type(screen.getByLabelText(/^Password/i), 'Testpassword5');
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'Testpassw0rd5');
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            //expect(mockedUsedNavigate).not.toHaveBeenCalled();
            expect(alert).toHaveBeenCalled();
        }, { timeout: 3000 });
        expect(localStorage.setItem).not.toHaveBeenCalledWith('username', 'robert');
        expect(localStorage.setItem).not.toHaveBeenCalledWith('token', 'secrettoken93423');
    });
});