const { knexClient } = require('./knexClient')

const {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
} = require('./fuelquotes')

const db_setup = () =>
  knexClient.transaction(async (trx) => {
    await trx('sessions').del()
    await trx('profile').del()
    await trx('quote').del()
    await trx('users').del()
    await trx('users').insert({
      username: 'dosbol',
      password: '3J9YmiYMzPzLfr3h96c4O/vKGjZuDwhpJo05wSJOZls=',
    })
  })

const db_cleanup = () =>
  knexClient.transaction(async (trx) => {
    await trx('sessions').del()
    await trx('profile').del()
    await trx('quote').del()
    await trx('users').del()
  })

beforeEach(() => db_setup())
afterEach(() => db_cleanup())
afterAll(() => knexClient.destroy())

// Mocking profile data
const profile = {
  address1: '123 Hornwood Dr',
  address2: '',
  city: 'Houston',
  state: 'TX',
  zipcode: '77097',
}

// Mocking generateProfile function
jest.mock('./profile', () => ({
  getProfile: jest.fn(async () => profile),
}))

describe('The Fuel Quote Module', () => {
  test('should load', () => {
    expect(generateFuelQuote).not.toBe(undefined)
    expect(getQuoteHistory).not.toBe(undefined)
  })

  test('throws an error if profile does not exist', () => {
    return expect(generateFuelQuote(null, 280)).rejects.toThrow()
  })

  test('throws an error if username is invalid', () => {
    return expect(generateFuelQuote(235, 125)).rejects.toThrow()
  })

  test('should generate a fuel quote for a user with complete profile and valid gallons requested', async () => {
    const result = await generateFuelQuote('dosbol', 150)

    expect(result).toEqual(
      expect.objectContaining({
        gallons: 150,
        address: '123 Hornwood Dr, ',
        city: 'Houston',
        state: 'TX',
        zipcode: '77097',
        price: "1.73",
        due: "258.75",
      })
    )
  })

  test('should submit the fuel quote for the user', async () => {
    const result = await submitFuelQuote('dosbol', 150, '2023-03-31')
    expect(result.success).toBe(true)
    expect(result.message).toBe('Fuel quote submitted successfully!')
  })

  test('should throw an error when profile is incomplete', async () => {
    profile.zipcode = null

    return expect(generateFuelQuote('dosbol', 150)).rejects.toThrow()
  })

  test('should throw an error when gallons requested is invalid', async () => {
    return expect(generateFuelQuote('dosbol', -10)).rejects.toThrow()
  })

  test('should add the new quote to the quote history', async () => {
    profile.zipcode = '77097'
    await submitFuelQuote('dosbol', 150, '2023-03-31')
    const result = await getQuoteHistory('dosbol')

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        date: '2023-03-31',
        gallons: 150,
        address: '123 Hornwood Dr, ',
        city: 'Houston',
        state: 'TX',
        zipcode: '77097',
        price: "1.73",
        due: "258.75",
      })
    )
  })
})
