import { setupServer } from 'msw/node'
import { handlers } from './api'

const server = setupServer(...handlers);

module.exports = { server };