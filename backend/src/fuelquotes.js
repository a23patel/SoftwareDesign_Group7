const FuelDelivery = require('./pricing')
const { knexClient } = require('./knexClient')
const { getProfile } = require('./profile')

const generateFuelQuote = async (username, gallons) => {
  // validate username
  if (!username) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  if (typeof username !== 'string') {
    throw new Error('Unable to generate fuel quote: Invalid Username')
  }

  const profile = await getProfile(username)
  if (!profile) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  const address = profile.address1 + ', ' + profile.address2
  const city = profile.city
  const state = profile.state
  const zipcode = profile.zipcode

  if (!address || !city || !state || !zipcode) {
    throw new Error('Unable to generate fuel quote: Incomplete profile')
  }

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
    username
  )

  const newQuote = {
    gallons: Number(gallons),
    address,
    city,
    state,
    zipcode,
    price: Number(await fuelDelivery.getPricePerGallon()).toFixed(2),
    due: Number(await fuelDelivery.getTotalAmountDue()).toFixed(2),
  }

  return newQuote
}

const submitFuelQuote = async (username, gallons, date) => {
  // validate username
  if (!username || typeof username !== 'string') {
    throw new Error('Unable to submit fuel quote: Invalid Username')
  }

  if (!date || isNaN(Date.parse(date))) {
    throw new Error('Unable to submit fuel quote: Invalid date')
  }

  const quote = await generateFuelQuote(username, gallons)
  quote.date = date

  // insert quote object into the quotes table
  await knexClient('quote').insert({ client_username: username, ...quote })

  return { success: true, message: 'Fuel quote submitted successfully!' }
}

const getQuoteHistory = async (username) => {
  const quotes = await knexClient('quote')
    .select(
      'gallons',
      'address',
      'city',
      'state',
      'zipcode',
      'price',
      'due',
      'date'
    )
    .where('client_username', '=', username)

  quotes.forEach((quote) => {
    quote.date = new Date(quote.date).toISOString().split('T')[0]
    quote.due = Number(quote.due).toFixed(2)
    quote.price = Number(quote.price).toFixed(2)
  })
  return quotes
}

module.exports = {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
}
