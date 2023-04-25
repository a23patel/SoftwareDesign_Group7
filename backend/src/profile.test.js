const { generateProfile, getProfile, updateProfile } = require('./profile')
const { knexClient } = require('./knexClient')

const db_setup = () => knexClient.transaction(async trx => {
  await trx('sessions').del();
  await trx('profile').del();
  await trx('users').del();
  await trx('users').insert({ username: 'peter', password: '3J9YmiYMzPzLfr3h96c4O/vKGjZuDwhpJo05wSJOZls='});
});

const db_cleanup = () => knexClient.transaction(async trx => {
  await trx('sessions').del();
  await trx('profile').del();
  await trx('users').del();
});

beforeEach(() => db_setup());
afterEach(() => db_cleanup());
afterAll(() => knexClient.destroy());

describe('The Profile Management Module', () => {
  test('should load', () => {
    expect(generateProfile).not.toBe(undefined)
    expect(getProfile).not.toBe(undefined)
    expect(updateProfile).not.toBe(undefined)
  })

  test('should create a profile with a valid username', async () => {
    const username = 'peter'
    const result = await generateProfile(username)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile generated successfully !')
  })

  test('should throw an error if the username is not a string when trying to generate a profile', async () => {
    return expect(generateProfile(123)).rejects.toThrow()
  })

  test('should throw an error if a profile does not exist with the given username', async () => {
    const username = 'eve'
    return expect(getProfile(username)).rejects.toThrow()
  })

  test('should get the profile for an existing user', async () => {
    const username = 'peter'
    await generateProfile(username)
    const { full_name, email, address1, city, state, zipcode, phone } =
      await getProfile(username)
    expect(full_name).toEqual(null)
    expect(email).toEqual('peter653@gmail.com')
    expect(address1).toEqual(null)
    expect(city).toEqual(null)
    expect(state).toEqual(null)
    expect(zipcode).toEqual(null)
    expect(phone).toEqual('2348722325')
  })

  test('should throw an error if the username is not a string when trying to get a profile', async () => {
    return expect(getProfile(250)).rejects.toThrow()
  })

  test('should throw an error if the username is empty when trying to get a profile', async () => {
    return expect(getProfile('   ')).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid username', async () => {
    return expect(updateProfile(' ', {})).rejects.toThrow()
  })

  test('should throw an error if trying to update a non-existent profile', async () => {
    const username = 'john'
    return expect(updateProfile(username, {})).rejects.toThrow();
  })

  test('should throw an error if an invalid field is provided when trying to update a profile', async () => {
    const username = 'peter'
    await generateProfile(username)
    return expect(updateProfile(username, { password: 'test' })).rejects.toThrow()
  })

  test('throws an error if trying to update a profile with invalid name', async () => {
    const username = 'peter'
    await generateProfile(username)
    return expect(
      updateProfile(username, { full_name: 123 })
    ).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid email', async () => {
    const username = 'peter'
    await generateProfile(username)
    return expect(
      updateProfile(username, { email: 'peter.630.gmail.com' })
    ).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid city', async () => {
    const username = 'peter'
    await generateProfile(username)
    return expect(updateProfile(username, { city: true })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid state', async () => {
    const username = 'peter'
    return expect(updateProfile(username, { state: [] })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid zipcode', async () => {
    const username = 'peter'
    await generateProfile(username)
    return expect(updateProfile(username, { zipcode: '732' })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid phone', async () => {
    const username = 'peter'
    const invalidPhone = 8324562
    await generateProfile(username)
    return expect(
      updateProfile(username, { phone: invalidPhone })
    ).rejects.toThrow()
  })
})
