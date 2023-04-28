const axios = require('axios')
const { knexClient } = require('./knexClient');

const app = require('./index')
const PORT = 3001
const BACKEND_URL = `http://localhost:${PORT}`

let server = undefined
let client = undefined
let clientWithAuth = undefined

const db_cleanup = () => knexClient.transaction(async trx => {
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

afterAll(() => {
  knexClient.destroy();
})

const user = {
  username: 'robert',
  password: 'Test!Pass77',
  email: 'rob@uh.edu',
  phone: '7137137133',
}

const profile = {
  username: 'robert',
  fullname: 'Robert Robertson',
  email: 'rob@uh.edu',
  address1: '111 Somewhere Street',
  address2: 'Apartment 2',
  city: 'Houston',
  state: 'TX',
  phone: '7137137133',
  zipcode: '77001',
}

const quoteInput = {
  username: 'robert',
  gallons: 5,
  date:'2024-04-03',
}

const login_shim = async () => {
  await client.post('/api/register', user)
  return await client.post('/api/login', user).then((response) => {
    return response.data.token
  })
}

const profile_shim = async () => {
  const token = await login_shim()
  await clientWithAuth(token).post('/api/profile/edit', profile)
  return token
}

const get_quote_shim = async () => {
  const token = await profile_shim()
  const resp = await clientWithAuth(token).get('/api/quote/robert/5')
  const { price, due } = resp.data
  return { token, quote: { price, due, ...quoteInput}}
}

const post_quote_shim = async () => {
  const { token, quote } = await get_quote_shim()
  await clientWithAuth(token).post('/api/quote', quoteInput)
  return token
}

describe('The Express app', () => {
  test('should handle login/logout of valid users with valid passwords', async () => {
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', user)
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
      .post('/api/register', user)
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
        expect(full_name).toBe(null)
        expect(email).toBe('rob@uh.edu')
        expect(address1).toBe(null)
        expect(address2).toBe('')
        expect(city).toBe(null)
        expect(state).toBe(null)
        expect(zipcode).toBe(null)
        expect(phone).toBe('7137137133')
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
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', user)
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
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', user)
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
        expect(price).toBe("1.73")
        expect(Number(due)).toBeCloseTo(gallons * Number(price), 0.02)
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
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', user)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    const token = await client.post('/api/login', reqBody).then((response) => {
      return response.data.token
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
    await clientWithAuth(token).post('/api/profile/edit', profileBody)
    const gallons = 5
    const date = '2024-04-03'
    const { price, due } = await clientWithAuth(token)
      .get('/api/quote/' + username + '/' + gallons)
      .then((response) => {
        const { price, due } = response.data
        return { price, due }
      })
      .catch((e) => {
        throw e
      })
    const quoteBody = { username, gallons, date, price, due }
    return expect(clientWithAuth(token).post('/api/quote', quoteBody)).resolves.not.toBe(undefined)
  })
  test('should allow users to view quote history', async () => {
    const username = 'robert'
    const password = 'Test!Pass77'
    let reqBody = { username, password }
    await client
      .post('/api/register', user)
      .then((response) => {
        expect(response.data.msg).toBe('Success')
      })
      .catch((e) => {
        console.log(`Error: failed to register`)
        throw e
      })
    const token = await client.post('/api/login', reqBody).then((response) => {
      return response.data.token
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
    const gallons = 5
    const date = '2024-04-03'
    const { price, due } = await clientWithAuth(token)
      .get('/api/quote/' + username + '/' + gallons)
      .then((response) => {
        const { price, due } = response.data
        return { price, due }
      })
      .catch((e) => {
        throw e
      })
    const quoteBody = { username, gallons, date, price, due }
    await clientWithAuth(token).post('/api/quote', quoteBody)
    await clientWithAuth(token)
      .get('/api/history/' + username)
      .then((response) => {
        const { gallons_requested, address, city, state, zipcode, date, price, due } =
          response.data.quotes[0]
        expect(gallons).toBe(quoteBody.gallons)
        expect(date).toBe(quoteBody.date)
        expect(price).toBe(quoteBody.price)
        expect(due).toBe(quoteBody.due)
        expect(address).toBe(profileBody.address1 + ', ' + profileBody.address2)
        expect(city).toBe(profileBody.city)
        expect(state).toBe(profileBody.state)
        expect(zipcode).toBe(profileBody.zipcode)
      })
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
  test('should prevent users from accessing profile without authentication', async () => {
    await profile_shim()
    return expect(client.get('/api/profile/richard')).rejects.toThrow()
  })
  test('should prevent users from accessing profile with bogus tokens', async () => {
    await profile_shim()
    return expect(clientWithAuth('badtoken').get('/api/profile/richard')).rejects.toThrow()
  })
  test('should prevent users from editing profile without authentication', async () => {
    await login_shim()
    return expect(client.post('/api/profile', profile)).rejects.toThrow()
  })
  test('should prevent users from editing profile with bogus tokens', async () => {
    await login_shim()
    return expect(clientWithAuth('badtoken').post('/api/profile', profile)).rejects.toThrow()
  })
  test('should prevent users from accessing quotes without authentication headers', async () => {
    const token = await login_shim()
    return expect(client.get('/api/quote/richard/5')).rejects.toThrow()
  })
  test('should prevent users from accessing quotes with bogus tokens', async () => {
    const token = await login_shim()
    return expect(clientWithAuth('baloney').get('/api/quote/richard/5')).rejects.toThrow()
  })
  test('should prevent users from posting quotes without authentication headers', async () => {
    const { token, quote } = await get_quote_shim()
    return expect(client.post('/api/quote', quote)).rejects.toThrow()
  })
  test('should prevent users from posting quotes with bogus tokens', async () => {
    const { token, quote } = await get_quote_shim()
    return expect(clientWithAuth('faketoken').post('/api/quote', quote)).rejects.toThrow()
  })
  test('should prevent users from accessing history without authentication headers', async () => {
    const token = await post_quote_shim()
    return expect(client.get('/api/history/robert')).rejects.toThrow()
  })
  test('should prevent users from accessing history with bogus tokens', async () => {
    const token = await post_quote_shim()
    return expect(clientWithAuth('notgood').get('/api/history/robert')).rejects.toThrow()
  })
})
