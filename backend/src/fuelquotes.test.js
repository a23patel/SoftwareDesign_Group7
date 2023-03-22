const {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
} = require('./fuelquotes')

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
  getProfile: jest.fn(() => profile),
}))

describe('The Fuel Quote Module', () => {
  test('should load', () => {
    expect(generateFuelQuote).not.toBe(undefined)
    expect(getQuoteHistory).not.toBe(undefined)
  })

  test('throws an error if profile does not exist', () => {
    expect(() => generateFuelQuote(null, 280, '2023-04-03')).toThrow()
  })

  test('throws an error if username is invalid', () => {
    expect(() => generateFuelQuote(235, 125, '2023-04-07')).toThrow()
  })

  test('should generate a fuel quote for a user with complete profile and valid gallons requested', () => {
    const result = generateFuelQuote('dosbol', 150, '2023-03-31')

    expect(result).toEqual(
      expect.objectContaining({
        gallons: 150,
        address: '123 Hornwood Dr',
        city: 'Houston',
        state: 'TX',
        zipcode: '77097',
        price: 1.5,
        due: 225,
      })
    )
  })

  test('should submit the fuel quote for the user', () => {
    const result = submitFuelQuote('dosbol', 150, '2023-03-31')
    expect(result.success).toBe(true)
    expect(result.message).toBe('Fuel quote submitted successfully !')
  })

  test('should throw an error when profile is incomplete', () => {
    profile.zipcode = null

    expect(() => {
      generateFuelQuote('dosbol', 150, '2023-03-31')
    }).toThrow()
  })

  test('should throw an error when gallons requested is invalid', () => {
    expect(() => {
      generateFuelQuote('dosbol', -10, '2023-03-31')
    }).toThrow()
  })

  test('should add the new quote to the quote history', () => {
    const result = getQuoteHistory('dosbol')

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        date: '2023-03-31',
        gallons: 150,
        address: '123 Hornwood Dr',
        city: 'Houston',
        state: 'TX',
        zipcode: '77097',
        price: 1.5,
        due: 225,
      })
    )
  })

  test('should throw an error when there is no quote history for the user', () => {
    expect(() => {
      getQuoteHistory('rishi')
    }).toThrow()
  })
})
