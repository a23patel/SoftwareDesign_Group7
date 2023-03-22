const profiles = {}

const createProfile = (username) => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Unable to create profile: Invalid Username')
  }

  if (profiles[username]) {
    throw new Error('Unable to create profile: Profile already exists')
  }

  const profileData = {
    fullname: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
  }

  profiles[username] = profileData

  return { success: true, message: 'Profile created successfully !' }
}

const generateProfile = (username) => {
  const profileData = profiles[username]

  // Generating random profile data
  profileData.fullname = 'peter'
  profileData.email = 'peter653@gmail.com'
  profileData.address1 = '9703 Dunlap Ave'
  profileData.address2 = ''
  profileData.city = 'Cleveland'
  profileData.state = 'OH'
  profileData.zipcode = '44090'
  profileData.phone = '2348722325'

  return { success: true, message: 'Profile generated successfully !' }
}

const getProfile = (username) => {
  // input validation for username
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw Error('Unable to get profile of client: Invalid Username')
  }

  const profileData = profiles[username]

  if (!profileData) {
    throw new Error('Unable to get profile of client: Profile does not exist')
  }

  return profileData
}

const updateProfile = (username, profileData) => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Unable to update profile: Invalid Username')
  }

  if (!profiles[username]) {
    throw new Error('Unable to update profile: Profile does not exist')
  }

  const validKeys = [
    'fullname',
    'email',
    'address1',
    'address2',
    'city',
    'state',
    'zipcode',
    'phone',
  ]

  // input validation for the fields of profileData
  Object.keys(profileData).forEach((key) => {
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid field provided: ${key}`)
    }
    if (
      key == 'email' &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(profileData.email)
    ) {
      throw new Error('Invalid email address provided')
    }
    if (key === 'phone' && !/^[0-9]{10}$/.test(profileData.phone)) {
      throw new Error('Invalid phone number provided')
    }
    if (key === 'zipcode' && !/^[0-9]{5}$/.test(profileData.zipcode)) {
      throw new Error('Invalid zipcode provided')
    }
    if (
      (key === 'state' ||
        key === 'city' ||
        key === 'address1' ||
        key === 'address2' ||
        key === 'email' ||
        key === 'phone' ||
        key === 'fullname') &&
      typeof profileData[key] !== 'string'
    ) {
      throw new Error(`${key} should be a string`)
    }
  })

  const existingProfile = profiles[username]
  const updatedData = Object.assign({}, existingProfile, profileData)

  profiles[username] = updatedData

  return { success: true, message: 'Profile updated successfully !' }
}

module.exports = { createProfile, generateProfile, getProfile, updateProfile }
