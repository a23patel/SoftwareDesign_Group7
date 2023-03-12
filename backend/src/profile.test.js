const { createProfile, generateProfile, updateProfile } = require('./profile')

describe('The Profile Management Module', () => {
  test('should load', () => {
    expect(createProfile).not.toBe(undefined)
    expect(generateProfile).not.toBe(undefined)
    expect(updateProfile).not.toBe(undefined)
  })

  test('should create a profile for a valid user', () => {
    const username = 'michael'
    try {
      const response = createProfile(username)
      expect(response.success).toBe(true)
      expect(response.message).toEqual('Profile created successfully !')
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  test('should throw an error for an invalid username', () => {
    const username = 'eve'
    expect(() => {
      createProfile(username)
    }).toThrow('Unable to create profile: Invalid Username')
  })

  test('should throw an error if profile already exists for the user', () => {
    const username = 'michael'
    expect(() => {
      createProfile(username)
    }).toThrow('Unable to create profile: profile already exists')
  })

  test('should generate a profile for a valid user', () => {
    const username = 'abraar'
    try {
      const response = generateProfile(username)
      expect(response.success).toBe(true)
      expect(response.message).toEqual('Profile generated successfully !')
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  test('should throw an error for an invalid username', () => {
    const username = 'eve'
    expect(() => {
      generateProfile(username)
    }).toThrow('Unable to generate profile: Invalid Username')
  })

  test('should throw an error if profile does not exist for the user', () => {
    expect(() => {
      generateProfile('varun')
    }).toThrow('Unable to generate profile: Profile does not exist')
  })

  test('should update an existing profile for a valid user', () => {
    const username = 'michael'
    const profiledata = {
      fullName: 'michael',
      address1: '9703 Dunlap Ave',
      city: 'Cleveland',
      state: 'OH',
      zipcode: '44090',
    }
    try {
      const response = updateProfile(username, profiledata)
      expect(response.success).toBe(true)
      expect(response.message).toEqual('Profile updated successfully !')
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })
  test('should throw an error for an invalid username', () => {
    const username = 'eve'
    const profileData = {
      full_name: 'eve',
      address1: '123 Main St',
      city: 'Houston',
      state: 'TX',
      zipcode: '77003',
    }
    expect(() => {
      update_profile(username, profileData)
    }).toThrow('Unable to update profile: Invalid Username')
  })

  test('should throw an error if profile does not exist for the user', () => {
    const username = 'elliot'
    const profileData = {
      full_name: 'elliot',
      address1: '335 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipcode: '66453',
    }
    expect(() => {
      update_profile(username, profileData)
    }).toThrow('Unable to update profile: Profile does not exist')
  })
})
