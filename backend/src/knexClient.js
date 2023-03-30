const knex = require('knex');

const node_env = process.env.NODE_ENV;

const mySQLConnection = {
    host: '127.0.0.1',
    port: 3306,
    user: 'app',
    password: 'test_password',
    database: 'cosc4353app'
};

const knexClientConfigs = {
    development: {
        client: 'mysql',
        connection: mySQLConnection
    },
    production: {
        client: 'mysql',
        connection: mySQLConnection
    },
    testing: {
        client: 'mysql',
        connection: mySQLConnection
    }
}

// const knexClientConfigs = {
//     development: {
//         client: 'sqlite3',
//         connection: {
//             filename: 'db/fuel_database.db'
//         }
//     },
//     production: {
//         client: 'sqlite3',
//         connection: {
//             filename: 'db/fuel_database.db'
//         }
//     },
//     testing: {
//         client: 'sqlite3',
//         connection: {
//             filename: 'db/fuel_database.db'
//         }
//     }
// }

const config = () => {
    if (node_env.match(/prod/)) {
        return knexClientConfigs['production']
    } else if (node_env.match(/test/)) {
        return knexClientConfigs['testing']
    } else {
        return knexClientConfigs['development']
    }
}

const knexClient = knex(config());

module.exports = { knexClient };