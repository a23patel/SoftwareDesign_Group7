const express = require('express')
const cors = require('cors')
const {
    generateFuelQuote,
    submitFuelQuote,
    getQuoteHistory, } = require('./fuelquotes')
const { createProfile, getProfile, updateProfile } = require('./profile')
const {
  generate_token,
  validate_token,
  invalidate_token,
  create_user,
} = require('./login')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get('/api/quote/:username/:gallons', (req, res) => {
    const { username, gallons } = req.params
    const token = req.headers['authorization'].split(' ')[1]
    if (!validate_token(username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // we would use getQuoteHistory to get the quote history
      const { price, due } = generateFuelQuote(username, Number(gallons))
      res.status(200).json({ price, due })
    }
})

app.post('/api/quote', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    if (!validate_token(req.body.username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // We use submitFuelQuote
      const { username, gallons, date } = req.body
      const { success, message } = submitFuelQuote(username, Number(gallons), date)
      res.status(200).json({ message })
    }
  })

app.get('/api/history/:username', (req, res) => {
  const { username} = req.params
  const token = req.headers['authorization'].split(' ')[1]
  if (!validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use getQuoteHistory to get the quote history
    const historyQuotes = getQuoteHistory(username)
    res.status(200).json({ message: 'Success', quotes: historyQuotes })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const token = await generate_token(req.body.username, req.body.password)
    res.status(200).json({
      token,
      msg: 'The login was successful',
    })
  } catch (e) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  }
})

app.post('/api/logout', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]
  const { username } = req.body
  console.log(`LOGOUT: attempt by ${username}, with token ${token}`)
  const is_valid = await validate_token(username, token);
  console.log(`LOGOUT: token passed is valid: ${is_valid}`)
  if (!is_valid) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    try {
      await invalidate_token(username, token)
      res.status(200).json({ msg: 'Success' })
    } catch (e) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    }
  }
})

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const success = await create_user(username, password)
    updateProfile(username, {})
    res.status(200).json({ msg: 'Success' })
  } catch (e) {
    res.status(400).json({ msg: e })
  }
})

app.get('/api/profile/:username', async (req, res) => {
  const { username } = req.params
  const token = req.headers['authorization'].split(' ')[1]
  if (!validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use getProfile to get the profile
    try {
      const profile = await getProfile(username)
      // TODO change this
      profile['fullname'] = profile['full_name']
      res.status(200).json(profile)
    } catch (e) {
      res.status(400).json({ msg: e.message})
    }
  }
})

app.post('/api/profile/edit', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]
  if (!validate_token(req.body.username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use updateProfile to edit the profile
    const { fullname, email, address1, address2, city, state, zipcode, phone } = req.body
    const newProfile = { full_name: fullname, email, address1, address2, city, state, zipcode, phone }
    const updatedProfile = await updateProfile(req.body.username, newProfile)
    res.status(200).json(updatedProfile)
  }
})

module.exports = app
