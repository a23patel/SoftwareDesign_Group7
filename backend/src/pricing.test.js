const FuelDelivery = require('./pricing')

describe('Pricing Module', () => {
  test('should load', () => {
    expect(getPricePerGallon).not.toBe(undefined)
    expect(getTotalAmountDue).not.toBe(undefined)
  })

  test('calculates the correct suggested price per gallon for a fuel delivery to Texas', async () => {
    const delivery = new FuelDelivery(
      100,
      '123 Main St',
      'Houston',
      'TX',
      '77097',
      'johnny'
    )
    const suggestedPrice = await delivery.getPricePerGallon()
    expect(suggestedPrice).toBeCloseTo(1.566, 3)
  })

  test('calculates the correct suggested price per gallon for a delivery outside of Texas', async () => {
    const delivery = new FuelDelivery(
      100,
      '2550 Council St',
      'San Francisco',
      'CA',
      '99465',
      'jason'
    )
    const suggestedPrice = await delivery.getPricePerGallon()
    expect(suggestedPrice).toBeCloseTo(1.617, 3)
  })

  test('calculates the correct suggested price per gallon for a delivery of more than 1000 gallons', async () => {
    const delivery = new FuelDelivery(
      2000,
      '123 Main St',
      'Houston',
      'TX',
      '77001',
      'dosbol'
    )
    const suggestedPrice = await delivery.getPricePerGallon()
    expect(suggestedPrice).toBeCloseTo(1.542, 3)
  })

  test('calculates the correct total amount due for a valid delivery', async () => {
    const delivery = new FuelDelivery(
      100,
      '123 Main St',
      'Houston',
      'TX',
      '77097',
      'johnny'
    )
    const totalAmountDue = await delivery.getTotalAmountDue()
    expect(totalAmountDue).toBeCloseTo(156.6, 2)
  })

  test('totalAmountDue returns NaN when gallons requested is negative', async () => {
    const delivery = new FuelDelivery(
      -100,
      '123 Main St',
      'Houston',
      'TX',
      '77097',
      'johnny'
    )
    const totalAmountDue = await delivery.getTotalAmountDue()
    expect(totalAmountDue).toBe(NaN)
  })

  test('returns 0 when gallons requested is 0', async () => {
    const delivery = new FuelDelivery(
      0,
      '234 Hornwood Dr',
      'Houston',
      'TX',
      '77064',
      'rishi'
    )
    const totalAmountDue = await delivery.getTotalAmountDue()
    expect(totalAmountDue).toBe(NaN)
  })
})
