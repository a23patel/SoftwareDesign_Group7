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
    return this.gallonsRequested * this.suggestedPricePerGallon;
  }
}

module.exports = FuelDelivery;
// export default FuelDelivery
// const delivery = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
// const totalAmountDue = delivery.getTotalAmountDue();
// console.log(totalAmountDue);
