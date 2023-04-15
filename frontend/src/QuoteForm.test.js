import { render, screen, waitFor } from '@testing-library/react';
import QuoteForm from './QuoteForm';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { client, clientWithAuth } from './axiosClient';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

let history = []

jest.mock('axiosClient', () => ({
    ...jest.requireActual('axiosClient'),
    clientWithAuth: (token) => { return {
        get: (route) => {
            if (route.match(/profile/)) {
                return Promise.resolve({ data: fakeProfile })
            } else if (route.match(/quote/)) {
                return Promise.resolve({ data: fakeQuote })
            }
        },
        post: (route, payload) => {
                    if (route.match(/quote/)) {
                        history.push(payload)
                        return Promise.resolve(undefined)
                    }
        }
    }}
}));

jest.spyOn(window, 'alert').mockImplementation(() => { });

const fakeProfile = {
    address1: '7001 Calhoun',
    address2: 'Apartment 2',
    city: 'Dallas',
    state: 'TX',
    zipcode: '76177',
};

const fakeQuote = {
    price: '7.77',
    due: '21.55'
};

const fakeHistory = {
    username: 'robert',
    gallons: '15',
    date: '2024-01-01',
    ...fakeQuote,
    ...fakeProfile
};

describe("Quote Form page", () => {
    test.only('should be able to mount', async () => {
        return expect(() => {
            render(<QuoteForm />, { wrapper: BrowserRouter });
        }).not.toThrow();
    });
    test.only('should redirect when user not logged in', async () => {
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn((arg) => undefined);
        render(<QuoteForm />, { wrapper: BrowserRouter });
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    });
    test.only('should display profile information when the user is logged in', async () => {
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn(arg => {
            const store = { username: 'robert', token: 'token' }
            return store[arg]
        });
        await render(<QuoteForm />, { wrapper: BrowserRouter });
        await waitFor(() => {
            expect(screen.getByLabelText(/Delivery Address/).value).toBe('7001 Calhoun, Apartment 2');
        }, { timeout: 3000 });
        expect(screen.getByLabelText(/Delivery City/).value).toBe('Dallas');
        expect(screen.getByLabelText(/Delivery State/).value).toBe('TX');
        expect(screen.getByLabelText(/Delivery Zipcode/).value).toBe('76177');
    });
    test.only('should display quote information when the user is logged in', async () => {
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn(arg => {
            const store = { username: 'robert', token: 'token' }
            return store[arg]
        });
        await render(<QuoteForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByLabelText(/Delivery Date/i), '2024-01-01');
        await userEvent.type(screen.getByLabelText(/Gallons Requested/i), '15');
        await userEvent.click(screen.getByText(/GET QUOTE/));
        await waitFor(() => {
            expect(screen.getByLabelText(/Suggested Price/).value).toBe('$7.77')
        })
        expect(screen.getByLabelText(/Total Amount Due/).value).toBe('$21.55')
    });
    test.only('should submit the quote upon clicking submit button', async () => {
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn(arg => {
            const store = { username: 'robert', token: 'token' }
            return store[arg]
        });
        await render(<QuoteForm />, { wrapper: BrowserRouter });
        await userEvent.type(screen.getByLabelText(/Delivery Date/i), '2024-01-01');
        await userEvent.type(screen.getByLabelText(/Gallons Requested/i), '15');
        await userEvent.click(screen.getByText(/GET QUOTE/));
        await waitFor(() => {
            expect(screen.getByLabelText(/Suggested Price/).value).toBe('$7.77')
        })
        expect(screen.getByLabelText(/Total Amount Due/).value).toBe('$21.55')
        await userEvent.click(screen.getByText(/SUBMIT QUOTE/));
        expect(history[0]).toStrictEqual(fakeHistory);
    })
});