const { knexClient } = require('./knexClient')

const generateProfile = async (username) => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw Error('Unable to generate profile of client: Invalid Username')
  }

  const profileData = {
    client_username: username,
    full_name: undefined,
    email: 'peter653@gmail.com',
    address1: undefined,
    address2: '',
    city: undefined,
    state: undefined,
    zipcode: undefined,
    phone: '2348722325',
  }

  await knexClient('profile').insert(profileData).into('profile')

  return { success: true, message: 'Profile generated successfully !' }
}

const getProfile = async (username) => {
  // input validation for username
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw Error('Unable to get profile of client: Invalid Username')
  }

  const profileData = await knexClient
    .select()
    .from('profile')
    .where('client_username', '=', username)
    .first()

  if (!profileData) {
    throw new Error('Unable to get profile of client: Profile does not exist')
  }

  return profileData
}

const updateProfile = async (username, newProfileData) => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Unable to update profile: Invalid Username')
  }

  const existingProfile = await knexClient()
    .select()
    .from('profile')
    .where('client_username', '=', username)
    .first()

  const validKeys = [
    'full_name',
    'email',
    'address1',
    'address2',
    'city',
    'state',
    'zipcode',
    'phone'
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
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        newProfileData['email']
      )
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
        key === 'full_name') &&
      typeof newProfileData[key] !== 'string'
    ) {
      throw new Error(`${key} should be a string`)
    }
  });

  if (!existingProfile) {
    const profileData = {
      client_username: username,
      full_name: 'johnny nguyen',
      email: 'johnny123@gmail.com',
      address1: '4320 Beechnut St',
      address2: '',
      city: 'Houston',
      state: 'TX',
      zipcode: '77092',
      phone: '2814563224',
    }
    // At this point, the new profile data is what we want to replace the old with, and has been validated
    Object.keys(newProfileData).forEach((key) => {
      profileData[key] = newProfileData[key]
    })

    await knexClient('profile').insert(profileData)
  } else {
    await knexClient('profile')
      .where('client_username', '=', username)
      .update(newProfileData)

    return { success: true, message: 'Profile updated successfully!' }
  }
}

module.exports = { generateProfile, getProfile, updateProfile }
