const FuelDelivery = require('./pricing')
const { generateProfile } = require('./profile')

const quoteHistory = {}

const generateFuelQuote = (username, gallonsRequested, deliveryDate) => {
  const profile = generateProfile(username)

  if (!profile) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  const { deliveryAddress, deliveryCity, deliveryState, deliveryZipcode } =
    profile

  if (!deliveryAddress || !deliveryCity || !deliveryState || !deliveryZipcode) {
    throw new Error('Unable to generate fuel quote: Incomplete profile')
  }

  if (typeof gallonsRequested !== 'number' || gallonsRequested < 0) {
    throw new Error('Unable to generate fuel quote: Invalid gallons requested')
  }

  const suggestedPricePerGallon = 1.5
  const fuelDelivery = new FuelDelivery(
    gallonsRequested,
    deliveryDate,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZipcode,
    suggestedPricePerGallon
  )

  if (!quoteHistory[username]) {
    quoteHistory[username] = []
  }

  const newQuote = {
    deliveryDate,
    gallonsRequested,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZipcode,
    suggestedPricePerGallon,
    totalAmountDue: fuelDelivery.getTotalAmountDue(),
  }

  quoteHistory[username].push(newQuote)

  return newQuote
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
  getQuoteHistory,
}
