class FuelDelivery {
  constructor(gallons, address, city, state, zipcode, price) {
    this.gallons = gallons
    this.address = address
    this.city = city
    this.state = state
    this.zipcode = zipcode
    this.price = price
  }

  getTotalAmountDue() {
    if (this.gallons < 0 || this.price < 0) {
      return NaN
    }
    return this.gallons * this.price
  }
}

module.exports = FuelDelivery
