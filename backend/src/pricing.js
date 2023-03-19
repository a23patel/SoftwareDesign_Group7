class FuelDelivery {
  constructor(
    gallonsRequested,
    deliveryDate,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZipcode,
    suggestedPricePerGallon
  ) {
    this.gallonsRequested = gallonsRequested;
    this.deliveryDate = deliveryDate;
    this.deliveryAddress = deliveryAddress;
    this.deliveryCity = deliveryCity;
    this.deliveryState = deliveryState;
    this.deliveryZipcode = deliveryZipcode;
    this.suggestedPricePerGallon = suggestedPricePerGallon;
  }

  getTotalAmountDue() {
    if (this.gallonsRequested < 0 || this.suggestedPricePerGallon < 0) {
      return NaN;
    }
    return this.gallonsRequested * this.suggestedPricePerGallon;
  }
}

module.exports = FuelDelivery;
