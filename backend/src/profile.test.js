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
afterAll(() => db_cleanup());

describe('The Profile Management Module', () => {
  test('should load', async () => {
    await expect(generateProfile).not.toBe(undefined)
    await expect(getProfile).not.toBe(undefined)
    await expect(updateProfile).not.toBe(undefined)
  })

  test('should create a profile with a valid username', async () => {
    const username = 'peter'
    const result = await generateProfile(username)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile generated successfully !')
  })

  test('should throw an error if the username is not a string when trying to generate a profile', async () => {
    expect(generateProfile(123)).rejects.toThrow()
  })

  test('should throw an error if a profile does not exist with the given username', async () => {
    const username = 'eve'
    expect(getProfile(username)).rejects.toThrow()
  })

  test('should get the profile for an existing user', async () => {
    const username = 'peter'
    await generateProfile(username)
    const { full_name, email, address1, city, state, zipcode, phone } =
      await getProfile(username)
    expect(full_name).toEqual('peter')
    expect(email).toEqual('peter653@gmail.com')
    expect(address1).toEqual('9703 Dunlap Ave')
    expect(city).toEqual('Cleveland')
    expect(state).toEqual('OH')
    expect(zipcode).toEqual('44090')
    expect(phone).toEqual('2348722325')
  })

  test('should throw an error if the username is not a string when trying to get a profile', async () => {
    await expect(getProfile(250)).rejects.toThrow()
  })

  test('should throw an error if the username is empty when trying to get a profile', async () => {
    expect(getProfile('   ')).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid username', async () => {
    expect(updateProfile(' ', {})).rejects.toThrow()
  })

  test('should throw an error if trying to update a non-existent profile', async () => {
    const username = 'john'
    expect(updateProfile(username, {})).rejects.toThrow();
  })

  test('should throw an error if an invalid field is provided when trying to update a profile', async () => {
    const username = 'peter'
    await generateProfile(username)
    expect(updateProfile(username, { password: 'test' })).rejects.toThrow()
  })

  test('throws an error if trying to update a profile with invalid name', async () => {
    const username = 'peter'
    await generateProfile(username)
    expect(
      updateProfile(username, { full_name: 123 })
    ).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid email', async () => {
    const username = 'peter'
    await generateProfile(username)
    expect(
      updateProfile(username, { email: 'peter.630.gmail.com' })
    ).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid city', async () => {
    const username = 'peter'
    await generateProfile(username)
    expect(updateProfile(username, { city: true })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid state', async () => {
    const username = 'peter'
    expect(updateProfile(username, { state: [] })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid zipcode', async () => {
    const username = 'peter'
    await generateProfile(username)
    expect(updateProfile(username, { zipcode: '732' })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid phone', async () => {
    const username = 'peter'
    const invalidPhone = 8324562
    await generateProfile(username)
    expect(
      updateProfile(username, { phone: invalidPhone })
    ).rejects.toThrow()
  })
})
