const express = require('express')
const { generateFuelQuote } = require('./fuelquotes')
const { createProfile, getProfile, updateProfile } = require('./profile')
const { generate_token, validate_token, invalidate_token, create_user } = require('./login')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())


app.get('/api/history/:username', (req, res) => {
  const { username} = req.params
  const token = req.headers['authorization'].split(' ')[1]
  if (!validate_token(username, token)) {
    res.status(400).json({ msg: 'Error: Invalid login' })
  } else {
    // we would use getQuoteHistory to get the quote history
    const historyQuotes = getQuoteHistory(username)
    res.status(200).json(historyQuotes)
  }
})

app.post('/api/login', (req, res) => {
    try {
        const token = generate_token(req.body.username, req.body.password)
        res.status(200).json({
            token,
            msg: 'The login was successful'
        })
    } catch (e) {
        res.status(400).json({ msg: 'Error: Invalid login' })
    }
})

app.post('/api/logout', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    const { username } = req.body
    if (!validate_token(username, token)) {
        res.status(400).json({ msg: 'Error: Invalid login'})
    } else {
        try {
            invalidate_token(username, token)
            res.status(200).json({ msg: 'Success' })
        } catch (e) {
            res.status(400).json({ msg: 'Error: Invalid login'})
        }
    }
})

app.post('/api/register', (req, res) => {
    try {
        const { username, password } = req.body
        const success = create_user(username, password)
        createProfile(username)
        res.status(200).json({ msg: 'Success' })
    } catch (e) {
        res.status(400).json({ msg: e })
    }
})

app.get('/api/profile/:username', (req, res) => {
    const { username } = req.params
    const token = req.headers['authorization'].split(' ')[1]
    if (!validate_token(username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // we would use generateProfile to get the profile
      const profile = getProfile(username)
      res.status(200).json(profile)
    }
  })

  app.post('/api/profile/edit', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    console.log(req.body.username)
    if (!validate_token(req.body.username, token)) {
      res.status(400).json({ msg: 'Error: Invalid login' })
    } else {
      // we would use updateProfile to edit the profile
      console.log(req.body);
      const updatedProfile = updateProfile(req.body.username, req.body)
      res.status(200).json(updatedProfile)
    }
  })

module.exports = app
