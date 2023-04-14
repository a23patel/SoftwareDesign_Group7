const FuelDelivery = require('./pricing')
const { knexClient } = require('./knexClient')

const db_setup = () =>
  knexClient.transaction(async (trx) => {
    await trx('sessions').del()
    await trx('profile').del()
    await trx('quote').del()
    await trx('users').del()
  })

beforeAll(() => db_setup())
afterAll(() => knexClient.destroy())

describe('Pricing Module', () => {
  test('should load', () => {
    expect(FuelDelivery).not.toBeUndefined()
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
    expect(suggestedPrice).toBeCloseTo(1.725, 3)
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
    expect(suggestedPrice).toBeCloseTo(1.755, 3)
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
    expect(suggestedPrice).toBeCloseTo(1.71, 3)
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
    expect(totalAmountDue).toBeCloseTo(172.5, 2)
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
