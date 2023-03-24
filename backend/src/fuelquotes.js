const FuelDelivery = require('./pricing')
const { getProfile } = require('./profile')

const quoteHistory = {}

const generateFuelQuote = (username, gallons) => {
  const profile = getProfile(username)

  if (!username) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  if (typeof username !== 'string') {
    throw new Error('Unable to generate fuel quote: Invalid Username')
  }

  const address = profile.address1 + profile.address2
  const city = profile.city
  const state = profile.state
  const zipcode = profile.zipcode

  if (!address || !city || !state || !zipcode) {
    throw new Error('Unable to generate fuel quote: Incomplete profile')
  }
  // TODO make this so that it parses the input as a number
  if (typeof gallons !== 'number' || gallons < 0) {
    throw new Error('Unable to generate fuel quote: Invalid gallons requested')
  }

  const price = 1.5
  const fuelDelivery = new FuelDelivery(
    gallons,
    address,
    city,
    state,
    zipcode,
    price
  )

  const newQuote = {
    gallons,
    address,
    city,
    state,
    zipcode,
    price,
    due: fuelDelivery.getTotalAmountDue(),
  }

  return newQuote
}

const submitFuelQuote = (username, gallons, date) => {
  if (typeof username !== 'string') {
    throw new Error('Unable to submit fuel quote: Invalid Username')
  }

  const quote = generateFuelQuote(username, gallons, date)
  quote.date = date

  if (!quoteHistory[username]) {
    quoteHistory[username] = []
  }

  quoteHistory[username].push(quote)

  return { success: true, message: 'Fuel quote submitted successfully !' }
}

const getQuoteHistory = (username) => {
  if (!quoteHistory[username]) {
    throw new Error(
      'Unable to get quote history: No quotes found for this user'
    )
  }

  return quoteHistory[username]
}

module.exports = {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
}
