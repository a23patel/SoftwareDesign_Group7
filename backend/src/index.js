const express = require('express');
const { generateFuelQuote } = require('./fuelquotes');
const { generateProfile } = require('./profile');

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
    console.log(`Starting server listening on port ${PORT}`);
});

app.get('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const token = req.headers['Authorization'].split(' ')[1];
    if (!validate_token(username, token)) {
        res.status(400).json({ msg: 'Error: invalid login'});
    } else {
        // we would use getProfile to get the profile
        const profile = generateProfile(username);
        res.status(200).json(profile);
    }
});