const { generateFuelQuote, getQuoteHistory } = require('./fuelquotes')

// Mocking profile data
const profile = {
  username: 'dosbol',
  address: '123 Hornwood Dr',
  city: 'Houston',
  state: 'TX',
  zipcode: '77097',
}

// Mocking quote history data
const quoteHistory = [
  {
    gallonsRequested: 100,
    deliveryDate: '2023-03-26',
    suggestedPricePerGallon: 1.5,
    totalAmountDue: 150,
  },
  {
    gallonsRequested: 200,
    deliveryDate: '2023-03-28',
    suggestedPricePerGallon: 1.4,
    totalAmountDue: 280,
  },
]

// Mocking generateProfile function
jest.mock('./profile', () => ({
  generateProfile: jest.fn(() => profile),
}))

describe('The Fuel Quote Module', () => {
  test('should load', () => {
    expect(generateFuelQuote).not.toBe(undefined)
    expect(getQuoteHistory).not.toBe(undefined)
  })

  test('should generate a fuel quote for a user with complete profile and valid gallons requested', () => {
    const result = generateFuelQuote('jdosbol', 150, '2023-03-31')

    expect(result).toEqual({
      gallonsRequested: 150,
      deliveryDate: '2023-03-31',
      suggestedPricePerGallon: 1.5,
      totalAmountDue: 225,
    })
  })

  test('should throw an error when profile is incomplete', () => {
    profile.address = null

    expect(() => {
      generateFuelQuote('dosbol', 150, '2023-03-31')
    }).toThrow()
  })

  test('should throw an error when gallons requested is invalid', () => {
    expect(() => {
      generateFuelQuote('dosbol', -1, '2023-03-31')
    }).toThrow()
  })

  test('should add the new quote to the quote history', () => {
    generateFuelQuote('jdosbol', 150, '2023-03-31')
    const result = getQuoteHistory('dosbol')

    expect(result.length).toBe(1)
    expect(result[0]).toEqual({
      deliveryDate: '2023-03-31',
      gallonsRequested: 150,
      deliveryAddress: '123 Hornwood Dr',
      deliveryCity: 'Houston',
      deliveryState: 'TX',
      deliveryZipcode: '77097',
      suggestedPricePerGallon: 1.5,
      totalAmountDue: 225,
    })
  })

  test('should return the quote history for a user', () => {
    quoteHistory[0].username = 'dosbol'
    quoteHistory[1].username = 'dosbol'
    quoteHistory[2].username = 'dosbol'

    const result = getQuoteHistory('dosbol')

    expect(result).toEqual(quoteHistory.slice(0, 9))
  })

  test('should throw an error when there is no quote history for the user', () => {
    expect(() => {
      getQuoteHistory('dosbol')
    }).toThrow()
  })
})
