const express = require('express')
const { generateFuelQuote } = require('./fuelquotes')
const { generateProfile, updateProfile } = require('./profile')

const PORT = process.env.PORT || 3001

const app = express()

app.listen(PORT, () => {
  console.log(`Starting server listening on port ${PORT}`)
})

app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params
  const token = req.headers['Authorization'].split(' ')[1]
  if (!validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use generateProfile to get the profile
    const profile = generateProfile(username)
    res.status(200).json(profile)
  }
})

app.post('/api/profile/edit', (req, res) => {
  const { username, profileData } = req.params
  const token = req.headers['Authorization'].split(' ')[1]
  if (!validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use updateProfile to edit the profile
    const updatedProfile = updateProfile(username, profileData)
    res.status(200).json(updatedProfile)
  }
})
