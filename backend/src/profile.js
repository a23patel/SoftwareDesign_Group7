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

const updateProfile = (username, newProfileData) => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Unable to update profile: Invalid Username')
  }

  if (!profiles[username]) {
    throw new Error('Unable to update profile: Profile does not exist')
  }

  let oldProfile = profiles[username]

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
  Object.keys(newProfileData).forEach((key) => {
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid field provided: ${key}`)
    }
    // If the new profile data doesn't update anything, we ignore it by returning early
    if (newProfileData[key] === undefined) return
    if (
      key == 'email' &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newProfileData.email)
    ) {
      throw new Error('Invalid email address provided')
    }
    if (key === 'phone' && !/^[0-9]{10}$/.test(newProfileData.phone)) {
      throw new Error('Invalid phone number provided')
    }
    if (key === 'zipcode' && !/^[0-9]{5}$/.test(newProfileData.zipcode)) {
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
      typeof newProfileData[key] !== 'string'
    ) {
      throw new Error(`${key} should be a string`)
    }

    // At this point, the new profile data is what we want to replace the old with, and has been validated
    oldProfile[key] = newProfileData[key]
  })

  profiles[username] = oldProfile

  return { success: true, message: 'Profile updated successfully !' }
}

module.exports = { createProfile, generateProfile, getProfile, updateProfile }
