const FuelDelivery = require('./PricingModule');

describe('FuelDelivery', () => {
  test('getTotalAmountDue() returns the correct amount', () => {
    const delivery = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
    expect(delivery.getTotalAmountDue()).toBe(250);
  });

  test('getTotalAmountDue() returns Correct amount when either gallonsRequested or suggestedPricePerGallon is a STRING ', () => {
    const delivery1 = new FuelDelivery("100", '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
    expect(delivery1.getTotalAmountDue()).toBe(250);

    const delivery2 = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', '2.50');
    expect(delivery2.getTotalAmountDue()).toBe(250);
  });

  test('getTotalAmountDue() returns NaN when either gallonsRequested or suggestedPricePerGallon are negative', () => {
    const delivery1 = new FuelDelivery(-100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
    expect(delivery1.getTotalAmountDue()).toBe(NaN);

    const delivery2 = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', -2.50);
    expect(delivery2.getTotalAmountDue()).toBe(NaN);
});


  test('getTotalAmountDue() returns 0 when gallonsRequested is 0', () => {
    const delivery = new FuelDelivery(0, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.50);
    expect(delivery.getTotalAmountDue()).toBe(0);
  });
  
  test('getTotalAmountDue() returns the correct amount when suggestedPricePerGallon is 0', () => {
    const delivery = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 0);
    expect(delivery.getTotalAmountDue()).toBe(0);
  });

  test('getTotalAmountDue() rounds the result to 2 decimal places', () => {
    const delivery = new FuelDelivery(100, '2023-03-08', '123 Main St', 'Anytown', 'CA', '12345', 2.536);
    expect(delivery.getTotalAmountDue()).toBeCloseTo(253.60, 2);
  });
});
