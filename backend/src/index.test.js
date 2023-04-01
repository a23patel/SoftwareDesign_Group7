const axios = require('axios')
const { knexClient } = require('./knexClient');

const app = require('./index')
const PORT = 3001
const BACKEND_URL = `http://localhost:${PORT}`

let server = undefined
let client = undefined
let clientWithAuth = undefined

const db_cleanup = () => knexClient.transaction(async trx => {
  console.log('DEBUG: performing DB cleanup');
  await trx('sessions').del();
  await trx('profile').del();
  await trx('quote').del();
  await trx('users').del();
});

beforeEach(() => {
  server = app.listen(PORT, () => {
    console.log(`Starting server listening on port ${PORT}`)
  })
  client = axios.create({ baseURL: BACKEND_URL })
  clientWithAuth = (token) =>
    axios.create({
      baseURL: BACKEND_URL,
      headers: { Authorization: `Bearer ${token}` },
    })
  return db_cleanup();
})

afterEach(() => {
  server.close()
  return db_cleanup();
})

describe('The Express app', () => {
  test('should handle login/logout of valid users with valid passwords', async () => {
    const username = 'richard'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: error in registration`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: error in login`)
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should allow users to view their profile', async () => {
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failure in registration`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: failure in login`)
        throw e
      })
    await clientWithAuth(token)
      .get('/api/profile/' + username)
      .then((response) => {
        const {
          full_name,
          email,
          address1,
          address2,
          city,
          state,
          zipcode,
          phone,
        } = response.data
        expect(full_name).toBe('johnny nguyen')
        expect(email).toBe('johnny123@gmail.com')
        expect(address1).toBe('4320 Beechnut St')
        expect(address2).toBe('')
        expect(city).toBe('Houston')
        expect(state).toBe('TX')
        expect(zipcode).toBe('77092')
        expect(phone).toBe('2814563224')
      })
      .catch((e) => {
        console.log(`Error: failure in fetching profile`)
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should allow users to edit their profile', async () => {
    const username = 'riley'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: failed to login`)
        throw e
      })
    let profileBody = {
      username,
      fullname: 'Robert Robertson',
      email: 'rob@uh.edu',
      address1: '111 Somewhere Street',
      address2: 'Apartment 2',
      city: 'Houston',
      state: 'TX',
      phone: '7137137133',
      zipcode: '77001',
    }
    await clientWithAuth(token)
      .post('/api/profile/edit', profileBody)
      .then((response) => {})
      .catch((e) => {
        console.log(`Error: failed to modify profile`)
        throw e
      })
    await clientWithAuth(token)
      .get('/api/profile/' + username)
      .then((response) => {
        const {
          fullname,
          email,
          address1,
          address2,
          city,
          state,
          zipcode,
          phone,
        } = response.data
        expect(fullname).toBe('Robert Robertson')
        expect(email).toBe('rob@uh.edu')
        expect(address1).toBe('111 Somewhere Street')
        expect(address2).toBe('Apartment 2')
        expect(city).toBe('Houston')
        expect(state).toBe('TX')
        expect(phone).toBe('7137137133')
        expect(zipcode).toBe('77001')
      })
      .catch((e) => {
        console.log(`Error: failed to fetch profile`)
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should allow users to generate quotes', async () => {
    const username = 'roland'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: failed to login`)
        throw e
      })
    let profileBody = {
      username,
      fullname: 'Robert Robertson',
      email: 'rob@uh.edu',
      address1: '111 Somewhere Street',
      address2: 'Apartment 2',
      city: 'Houston',
      state: 'TX',
      phone: '7137137133',
      zipcode: '77001',
    }
    await clientWithAuth(token)
      .post('/api/profile/edit', profileBody)
      .then((response) => {})
      .catch((e) => {
        console.log(`Error: failed to modify profile`)
        throw e
      })
    await clientWithAuth(token)
      .get('/api/profile/' + username)
      .then((response) => {
        const {
          fullname,
          email,
          address1,
          address2,
          city,
          state,
          zipcode,
          phone,
        } = response.data
        expect(fullname).toBe('Robert Robertson')
        expect(email).toBe('rob@uh.edu')
        expect(address1).toBe('111 Somewhere Street')
        expect(address2).toBe('Apartment 2')
        expect(city).toBe('Houston')
        expect(state).toBe('TX')
        expect(phone).toBe('7137137133')
        expect(zipcode).toBe('77001')
      })
      .catch((e) => {
        console.log(`Error: failed to fetch profile`)
        throw e
      })
    const gallons = 5
    await clientWithAuth(token)
      .get('/api/quote/' + username + '/' + gallons)
      .then((response) => {
        const { price, due } = response.data
        expect(price).toBe(1.5)
        expect(due).toBeCloseTo(gallons * price)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should allow users to submit quotes', async () => {
    const username = 'rachel'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: failed to login`)
        throw e
      })
    let profileBody = {
      username,
      fullname: 'Robert Robertson',
      email: 'rob@uh.edu',
      address1: '111 Somewhere Street',
      address2: 'Apartment 2',
      city: 'Houston',
      state: 'TX',
      phone: '7137137133',
      zipcode: '77001',
    }
    await clientWithAuth(token)
      .post('/api/profile/edit', profileBody)
      .then((response) => {})
      .catch((e) => {
        console.log(`Error: failed to modify profile`)
        throw e
      })
    await clientWithAuth(token)
      .get('/api/profile/' + username)
      .then((response) => {
        const {
          fullname,
          email,
          address1,
          address2,
          city,
          state,
          zipcode,
          phone,
        } = response.data
        expect(fullname).toBe('Robert Robertson')
        expect(email).toBe('rob@uh.edu')
        expect(address1).toBe('111 Somewhere Street')
        expect(address2).toBe('Apartment 2')
        expect(city).toBe('Houston')
        expect(state).toBe('TX')
        expect(phone).toBe('7137137133')
        expect(zipcode).toBe('77001')
      })
      .catch((e) => {
        console.log(`Error: failed to fetch profile`)
        throw e
      })
    const gallons = 5
    let price, due
    const date = '2023-04-03'
    await clientWithAuth(token)
      .get('/api/quote/' + username + '/' + gallons)
      .then((response) => {
        console.log(response.data.price)
        price = response.data.price
        due = response.data.due
        expect(price).toBe(1.5)
        expect(due).toBeCloseTo(gallons * price)
      })
      .catch((e) => {
        throw e
      })
    const quoteBody = { username, gallons, date, price, due }
    await clientWithAuth(token)
      .post('/api/quote', quoteBody)
      .then((response) => {})
      .catch((e) => {
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should allow users to view quote history', async () => {
    const username = 'raquel'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', reqBody)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    let token = undefined
    await client
      .post('/api/login', reqBody)
      .then((response) => {
        token = response.data.token
        expect(token).not.toBeUndefined()
      })
      .catch((e) => {
        console.log(`Error: failed to login`)
        throw e
      })
    let profileBody = {
      username,
      fullname: 'Robert Robertson',
      email: 'rob@uh.edu',
      address1: '111 Somewhere Street',
      address2: 'Apartment 2',
      city: 'Houston',
      state: 'TX',
      phone: '7137137133',
      zipcode: '77001',
    }
    await clientWithAuth(token)
      .post('/api/profile/edit', profileBody)
      .then((response) => {})
      .catch((e) => {
        console.log(`Error: failed to modify profile`)
        throw e
      })
    let profile
    await clientWithAuth(token)
      .get('/api/profile/' + username)
      .then((response) => {
        const {
          fullname,
          email,
          address1,
          address2,
          city,
          state,
          zipcode,
          phone,
        } = response.data
        profile = response.data
        expect(fullname).toBe('Robert Robertson')
        expect(email).toBe('rob@uh.edu')
        expect(address1).toBe('111 Somewhere Street')
        expect(address2).toBe('Apartment 2')
        expect(city).toBe('Houston')
        expect(state).toBe('TX')
        expect(phone).toBe('7137137133')
        expect(zipcode).toBe('77001')
      })
      .catch((e) => {
        console.log(`Error: failed to fetch profile`)
        throw e
      })
    const gallons = 5
    let price, due
    const date = '2023-04-03'
    await clientWithAuth(token)
      .get('/api/quote/' + username + '/' + gallons)
      .then((response) => {
        console.log(response.data.price)
        price = response.data.price
        due = response.data.due
        expect(price).toBe(1.5)
        expect(due).toBeCloseTo(gallons * price)
      })
      .catch((e) => {
        throw e
      })
    const quoteBody = { username, gallons, date, price, due }
    await clientWithAuth(token)
      .post('/api/quote', quoteBody)
      .then((response) => {})
      .catch((e) => {
        throw e
      })
    await clientWithAuth(token)
      .get('/api/history/' + username)
      .then((response) => {
        console.log(response.data)
        const { gallons, address, city, state, zipcode, date, price, due } =
          response.data.quotes[0]
        expect(gallons).toBe(quoteBody.gallons)
        expect(date).toBe(quoteBody.date)
        expect(price).toBe(quoteBody.price)
        expect(due).toBe(quoteBody.due)
        expect(address).toBe(profile.address1 + profile.address2)
        expect(city).toBe(profile.city)
        expect(state).toBe(profile.state)
        expect(zipcode).toBe(profile.zipcode)
      })
      .catch((e) => {
        throw e
      })
    await clientWithAuth(token)
      .post('/api/logout', { username, token })
      .then((response) => {})
      .catch((e) => {
        throw e
      })
  })
  test('should prohibit illegal username or password', async () => {
    const bad_username = 'a'
    const good_username = 'abel'
    const good_password = 'Test!Pass77'
    const bad_password = 'password'
    expect(
      async () =>
        await client
          .post('/api/register', { bad_username, good_password })
          .then((_) => {
            throw Error('Should not succeed')
          })
          .catch((_) => {})
    ).not.toThrow()
    expect(
      async () =>
        await client
          .post('/api/register', { good_username, bad_password })
          .then((_) => {
            throw Error('Should not succeed')
          })
          .catch((_) => {})
    ).not.toThrow()
  })
  test('should not allow nonexistent user to log in', async () => {
    const bad_username = 'eve'
    const password = 'Test!Pass77'
    expect(
      async () =>
        await client
          .post('/api/login', { bad_username, password })
          .then((_) => {
            throw Error('Should not succeed')
          })
          .catch((_) => {})
    ).not.toThrow()
  })
})
