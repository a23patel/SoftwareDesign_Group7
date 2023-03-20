const {
  createProfile,
  generateProfile,
  updateProfile,
  profiles,
} = require('./profile')

describe('The Profile Management Module', () => {
  test('should load', () => {
    expect(createProfile).not.toBe(undefined)
    expect(generateProfile).not.toBe(undefined)
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

  test('should generate a profile for an existing user', () => {
    const username = 'peter'
    createProfile(username)
    const result = generateProfile(username)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Profile generated successfully !')
    expect(profiles[username].fullName).toBe('peter')
    expect(profiles[username].email).toBe('peter653@gmail.com')
    expect(profiles[username].address1).toBe('9703 Dunlap Ave')
    expect(profiles[username].city).toBe('Cleveland')
    expect(profiles[username].state).toBe('OH')
    expect(profiles[username].zipcode).toBe('44090')
    expect(profiles[username].phone).toBe('2348722325')
  })

  test('should throw an error if the username is not a string', () => {
    expect(() => generateProfile(123)).toThrow(
      'Unable to generate profile: Invalid Username'
    )
  })

  test('should throw an error if the username is empty', () => {
    expect(() => generateProfile('   ')).toThrow(
      'Unable to generate profile: Invalid Username'
    )
  })

  test('should throw an error if no profile exists with the given username', () => {
    const username = 'eve'
    expect(() => generateProfile('user')).toThrow(
      'Unable to generate profile: Profile does not exist'
    )
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
