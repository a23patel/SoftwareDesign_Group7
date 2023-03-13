// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { server } from './mocks/server';

// Establish API mocking before all tests.

beforeAll(() => {
    console.log("Setting up MSW server for Jest testing");
    server.listen();
});

// Reset any request handlers that we may add during the tests,

// so they don't affect other tests.

afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.

afterAll(() => {
    console.log("Shutting down MSW server for Jest testing");
    server.close();
});