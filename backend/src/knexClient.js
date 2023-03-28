const knex = require('knex');

const env = process.env.NODE_ENV;

const knexClient = {
    development: knex({
        client: 'sqlite3',
        connection: {
            filename: 'test_db.sqlite'
        }
    }),
    production: knex({
        client: 'sqlite3',
        connection: {
            filename: 'test_db.sqlite'
        }
    })
}

module.exports = knexClient[env];