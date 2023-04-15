const express = require('express')
const cors = require('cors')
const {
    generateFuelQuote,
    submitFuelQuote,
    getQuoteHistory, } = require('./fuelquotes')
const { getProfile, updateProfile } = require('./profile')
const {
  generate_token,
  validate_token,
  invalidate_token,
  create_user,
} = require('./login')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(cors())
console.log(process.env.NODE_ENV)

app.get('/api/quote/:username/:gallons', async (req, res) => {
    const { username, gallons } = req.params
    let token = undefined
    try {
      token = req.headers['authorization'].split(' ')[1]
      console.log(token)
    } catch (e) {
      res.status(400).json({ msg: 'Error: Invalid login' })
      return
    }
    if (!await validate_token(username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // we would use getQuoteHistory to get the quote history
      try {
        // TODO we need to decide if we're going to change the names on the database or in the backend
        //const { price, due } = await generateFuelQuote(username, Number(gallons))
        //res.status(200).json({ price, due })
        const { price, due } = await generateFuelQuote(username, Number(gallons))
        res.status(200).json({ price, due })
      } catch (e) {
        res.status(400).json({ msg: 'Error: Could not get quote' })
      }
    }
})

app.post('/api/quote', async (req, res) => {
    let token = undefined
    try {
      token = req.headers['authorization'].split(' ')[1]
    } catch (e) {
      res.status(400).json({ msg: 'Error: Invalid login' })
      return
    }
    if (!await validate_token(req.body.username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // We use submitFuelQuote
      try {
        const { username, gallons, date } = req.body
        const { message } = await submitFuelQuote(username, Number(gallons), date)
        res.status(200).json({ message })
      } catch (e) {
        res.status(400).json({ msg: `Error: Could not save quote: ${e}` })
      }

    }
  })

app.get('/api/history/:username', async (req, res) => {
  const { username} = req.params
  let token = undefined
  try {
    token = req.headers['authorization'].split(' ')[1]
  } catch (e) {
    res.status(400).json({ msg: 'Error: Invalid login' })
    return
  }
  if (!await validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use getQuoteHistory to get the quote history
    try {
      const historyQuotes = await getQuoteHistory(username)
      res.status(200).json({ message: 'Success', quotes: historyQuotes })
    } catch (e) {
      res.status(400).json({ msg: 'Error: Could not fetch quotes' })
    }
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
  const { username } = req.body
  let token = undefined
  try {
    token = req.headers['authorization'].split(' ')[1]
  } catch (e) {
    res.status(400).json({ msg: 'Error: Invalid login' })
    return
  }
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
    let success = await create_user(username, password)
    success = await updateProfile(username, {})
    res.status(200).json({ msg: 'Success' })
  } catch (e) {
    res.status(400).json({ msg: e })
  }
})

app.get('/api/profile/:username', async (req, res) => {
  const { username } = req.params
  let token = undefined
  try {
    token = req.headers['authorization'].split(' ')[1]
  } catch (e) {
    res.status(400).json({ msg: 'Error: Invalid login' })
    return
  }
  if (!await validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    console.log(`${token} is valid? for ${username}`)
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
  let token = undefined
  try {
    token = req.headers['authorization'].split(' ')[1]
  } catch (e) {
    res.status(400).json({ msg: 'Error: Invalid login' })
    return
  }
  if (!await validate_token(req.body.username, token)) {
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
