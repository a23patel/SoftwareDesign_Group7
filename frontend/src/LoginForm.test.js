import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe("Login page", () => {
    test('valid user should be able to log in', () => {
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'abraar'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'test2'}});
        fireEvent.click(screen.getByLabelText('LOGIN'));
    })
})