const { generateProfile, getProfile, updateProfile } = require('./profile')

describe('The Profile Management Module', () => {
  test('should load', async () => {
    await expect(generateProfile).not.toBe(undefined)
    await expect(getProfile).not.toBe(undefined)
    await expect(updateProfile).not.toBe(undefined)
  })

  test('should create a profile with a valid username', async () => {
    const username = 'michael'
    const result = await generateProfile(username)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile created successfully !')
  })

  test('should throw an error if the username is not a string when trying to generate a profile', async () => {
    await expect(generateProfile(123)).rejects.toThrow()
  })

  test('should throw an error if a profile does not exist with the given username', async () => {
    const username = 'eve'
    await expect(getProfile(username)).rejects.toThrow()
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
    await expect(() => getProfile(250)).toThrow()
  })

  test('should throw an error if the username is empty when trying to get a profile', async () => {
    await expect(() => getProfile('   ')).toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid username', async () => {
    await expect(updateProfile(' ', {})).rejects.toThrow()
  })

  test('should throw an error if trying to update a non-existent profile', async () => {
    const username = 'john'
    await expect(updateProfile(username, {})).rejects.toThrow(
      'Unable to update profile of client: Profile does not exist'
    )
  })

  test('should throw an error if an invalid field is provided when trying to update a profile', async () => {
    const username = 'dosbol'
    await generateProfile(username)
    await expect(() => updateProfile(username, { password: 'test' })).toThrow()
  })

  test('throws an error if trying to update a profile with invalid name', async () => {
    const username = 'rishi'
    await generateProfile(username)
    await expect(() => {
      updateProfile(username, { full_name: 123 })
    }).toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid email', async () => {
    const username = 'peter'
    await generateProfile(username)
    await expect(
      updateProfile(username, { email: 'peter.630.gmail.com' })
    ).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid city', async () => {
    const username = 'andy'
    await generateProfile(username)
    await expect(() => {
      updateProfile(username, { city: true })
    }).toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid state', async () => {
    const username = 'dosbol'
    await expect(() => {
      updateProfile(username, { state: [] })
    }).toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid zipcode', async () => {
    const username = 'peter'
    await generateProfile(username)
    await expect(updateProfile(username, { zipcode: '732' })).rejects.toThrow()
  })

  test('should throw an error if trying to update a profile with an invalid phone', async () => {
    const username = 'peter'
    const invalidPhone = 8324562
    await generateProfile(username)
    await expect(
      updateProfile(username, { phone: invalidPhone })
    ).rejects.toThrow()
  })
})
