const FuelDelivery = require('./pricing')
const { getProfile } = require('./profile')
const { knexClient } = require('./knexClient')

const generateFuelQuote = async (username, gallons) => {
  // validate username
  if (!username) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  if (typeof username !== 'string') {
    throw new Error('Unable to generate fuel quote: Invalid Username')
  }

  // replace this with some invocation of getProfile?
  const profile = await knex('profiles').select().where('client_username', '=', username).first()
  
  if (!profile) {
    throw new Error('Unable to generate fuel quote: Profile does not exist')
  }

  const address = profile.address1 + profile.address2
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
    price
  )

  const newQuote = {
    gallons,
    address,
    city,
    state,
    zipcode,
    price,
    total_amount_due: fuelDelivery.getTotalAmountDue(),
  }

  return newQuote
}

const submitFuelQuote = async (username, gallons, date) => {
  // validate username
  if (!username || typeof username !== 'string') {
    throw new Error('Unable to submit fuel quote: Invalid Username')
  }

  const quote = await generateFuelQuote(username, gallons)
  quote.date = date

  // insert quote into the quotes table
  // this should be about right?
  await knex('quotes').insert({ username, ...quote })

  return { success: true, message: 'Fuel quote submitted successfully!' }
}

const getQuoteHistory = async (username) => {
  // this should be doing input validation
  // also the table column name is client_username
  // and it probably should be able to display quote history if there are no quotes for the user
  const quotes = await knex('quotes').where('username', username)
  if (quotes.length === 0) {
    throw new Error('Unable to get quote history: No quotes found for this user')
  }
  return quotes
}


module.exports = {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
}





// const FuelDelivery = require('./pricing')
// const { getProfile } = require('./profile')

// const quoteHistory = {}

// const generateFuelQuote = (username, gallons) => {
//   const profile = getProfile(username)

//   if (!username) {
//     throw new Error('Unable to generate fuel quote: Profile does not exist')
//   }

//   if (typeof username !== 'string') {
//     throw new Error('Unable to generate fuel quote: Invalid Username')
//   }

//   const address = profile.address1 + profile.address2
//   const city = profile.city
//   const state = profile.state
//   const zipcode = profile.zipcode

//   if (!address || !city || !state || !zipcode) {
//     throw new Error('Unable to generate fuel quote: Incomplete profile')
//   }
//   // TODO make this so that it parses the input as a number
//   if (typeof gallons !== 'number' || gallons < 0) {
//     throw new Error('Unable to generate fuel quote: Invalid gallons requested')
//   }

//   const price = 1.5
//   const fuelDelivery = new FuelDelivery(
//     gallons,
//     address,
//     city,
//     state,
//     zipcode,
//     price
//   )

//   const newQuote = {
//     gallons,
//     address,
//     city,
//     state,
//     zipcode,
//     price,
//     due: fuelDelivery.getTotalAmountDue(),
//   }

//   return newQuote
// }

// const submitFuelQuote = (username, gallons, date) => {
//   if (typeof username !== 'string') {
//     throw new Error('Unable to submit fuel quote: Invalid Username')
//   }

//   const quote = generateFuelQuote(username, gallons, date)
//   quote.date = date

//   if (!quoteHistory[username]) {
//     quoteHistory[username] = []
//   }

//   quoteHistory[username].push(quote)

//   return { success: true, message: 'Fuel quote submitted successfully !' }
// }

// const getQuoteHistory = (username) => {
//   if (!quoteHistory[username]) {
//     throw new Error(
//       'Unable to get quote history: No quotes found for this user'
//     )
//   }

//   return quoteHistory[username]
// }

// // TODO we might refactor this away, this depends on separation of concerns
// // who should handle this? login module or quote module?
// // For now, it has to be here to provide the login module access to modify quoteHistory
// const initializeQuoteHistory = (username) => {
//   // validate username
//   if (!username || typeof username !== 'string') {
//     throw new Error('Unable to initialize quote history: username is invalid')
//   }
//   if (quoteHistory[username] !== undefined) {
//     throw new Error('Unable to initialize quote history: user already exists')
//   }
//   quoteHistory[username] = []
// }

// module.exports = {
//   generateFuelQuote,
//   submitFuelQuote,
//   getQuoteHistory,
//   initializeQuoteHistory
// }
