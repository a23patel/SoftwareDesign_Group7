const FuelDelivery = require('./PricingModule');

describe('FuelDelivery', () => {
  test('getTotalAmountDue() returns the correct amount', () => {
    const delivery = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
    expect(delivery.getTotalAmountDue()).toBe(250);
  });
});
