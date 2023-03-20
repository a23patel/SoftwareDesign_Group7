const {
  createProfile,
  generateProfile,
  getProfile,
  updateProfile,
} = require('./profile')

describe('The Profile Management Module', () => {
  test('should load', () => {
    expect(createProfile).not.toBe(undefined)
    expect(getProfile).not.toBe(undefined)
    expect(updateProfile).not.toBe(undefined)
  })

  test('should create a profile with a valid username', () => {
    const username = 'michael'
    const result = createProfile(username)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile created successfully !')
  })

  test('should throw an error if the username is not a string', () => {
    expect(() => createProfile(123)).toThrow()
  })

  test('should throw an error if the username is empty', () => {
    expect(() => createProfile('   ')).toThrow()
  })

  test('should throw an error if a profile already exists with the given username', () => {
    const username = 'dosbol'
    createProfile(username)
    expect(() => createProfile(username)).toThrow()
  })

  test('should get the profile for an existing user', () => {
    const username = 'peter'
    createProfile(username)
    generateProfile(username)
    const { fullName, email, address1, city, state, zipcode, phone } =
      getProfile(username)
    expect(fullName).toEqual('peter')
    expect(email).toEqual('peter653@gmail.com')
    expect(address1).toEqual('9703 Dunlap Ave')
    expect(city).toEqual('Cleveland')
    expect(state).toEqual('OH')
    expect(zipcode).toEqual('44090')
    expect(phone).toEqual('2348722325')
  })

  test('should throw an error if the username is not a string', () => {
    expect(() => getProfile(123)).toThrow()
  })

  test('should throw an error if the username is empty', () => {
    expect(() => getProfile('   ')).toThrow()
  })

  test('should throw an error if no profile exists with the given username', () => {
    const username = 'eve'
    expect(() => getProfile(username)).toThrow()
  })

  test('should update a profile successfully with valid data', () => {
    const username = 'abraar'
    createProfile(username)
    const profileData = {
      fullName: 'abraar',
      address1: '2350 Bellaire Blvd',
      city: 'Houston',
      state: 'TX',
      zipcode: '77001',
    }
    const result = updateProfile(username, profileData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile updated successfully !')
  })

  test('should throw an error if the username is not a string', () => {
    const profileData = {
      fullName: 'abraar',
      address1: '2350 Bellaire Blvd',
      city: 'Houston',
      state: 'TX',
      zipcode: '77001',
    }
    expect(() => updateProfile(123, profileData)).toThrow(
      'Unable to update profile: Invalid Username'
    )
  })

  test('should throw an error if the username is empty', () => {
    const profileData = {
      fullName: 'abraar',
      address1: '2350 Bellaire Blvd',
      city: 'Houston',
      state: 'TX',
      zipcode: '77001',
    }
    expect(() => updateProfile('   ', profileData)).toThrow(
      'Unable to update profile: Invalid Username'
    )
  })

  test('should throw an error if no profile exists with the given username', () => {
    const username = 'eve'
    const profileData = {
      fullName: 'eve',
      address1: '234 Main St',
      city: 'Houston',
      state: 'TX',
      zipcode: '77003',
    }
    expect(() => updateProfile(username, profileData)).toThrow()
  })

  test('should throw an error if an invalid field is provided', () => {
    const username = 'dosbol'
    const profileData = { password: 'test' }
    expect(() => updateProfile(username, profileData)).toThrow()
  })

  test('throws an error if an invalid name is provided', () => {
    const username = 'peter'
    expect(() => {
      updateProfile(username, { fullName: 123 })
    }).toThrow()
  })

  test('should throw an error if an invalid email is provided', () => {
    const username = 'karthik'
    createProfile(username)
    const invalidEmail = 'karthik.233.gmail.com'
    expect(() => updateProfile(username, { email: invalidEmail })).toThrow()
  })

  test('should throw an error if an invalid address is provided', () => {
    const username = 'taylor'
    expect(() => {
      updateProfile(username, { address1: 457 })
    }).toThrow()
  })

  it('should throw an error if an invalid city is provided', () => {
    const username = 'andy'
    expect(() => {
      updateProfile(username, { city: true })
    }).toThrow()
  })

  test('should throw an error if an invalid state is provided', () => {
    const username = 'dosbol'
    expect(() => {
      updateProfile(username, { state: [] })
    }).toThrow()
  })

  test('should throw an error if an invalid zipcode is provided', () => {
    const username = 'darsh'
    createProfile(username)
    const invalidZipcode = 664
    expect(() => updateProfile(username, { zipcode: invalidZipcode })).toThrow()
  })

  test('should throw an error if an invalid phone number is provided', () => {
    const username = 'tommy'
    createProfile(username)
    const invalidPhone = 8324562
    expect(() => updateProfile(username, { phone: invalidPhone })).toThrow()
  })
})
