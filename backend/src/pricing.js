const { knexClient } = require('./knexClient')

class FuelDelivery {
  constructor(gallons, address, city, state, zipcode, username) {
    this.gallons = gallons
    this.address = address
    this.city = city
    this.state = state
    this.zipcode = zipcode
    this.username = username
  }

  async getPricePerGallon() {
    const locationFactor = this.state === 'TX' ? 0.02 : 0.04
    const gallonsRequestedFactor = this.gallons > 1000 ? 0.02 : 0.03
    const companyProfitFactor = 0.1

    const quoteHistory = await knexClient('quote').select().where('client_username', '=', this.username)
    const rateHistoryFactor = quoteHistory.length > 0 ? 0.01 : 0

    const currentPrice = 1.5
    const margin =
      currentPrice *
      (locationFactor -
        rateHistoryFactor +
        gallonsRequestedFactor +
        companyProfitFactor)

    const suggestedPrice = currentPrice + margin

    return suggestedPrice
  }

  async getTotalAmountDue() {
    const suggestedPricePerGallon = await this.getPricePerGallon()
    if (this.gallons <= 0) {
      return NaN
    }
    return this.gallons * suggestedPricePerGallon
  }
}

module.exports = FuelDelivery
