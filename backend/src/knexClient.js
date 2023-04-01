const mysql = require('mysql2');
const knex = require('knex');
require('dotenv').config();

// Configuration for the MySQL client
// Do not modify the values here; use the .env file at the project root

const node_env = process.env.NODE_ENV;

const mySQLConnection = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
};

const knexClientConfigs = {
    development: {
        client: 'mysql2',
        connection: mySQLConnection
    },
    production: {
        client: 'mysql2',
        connection: mySQLConnection
    },
    testing: {
        client: 'mysql2',
        connection: mySQLConnection
    }
}

const config = () => {
    if (node_env.match(/prod/)) {
        return knexClientConfigs['production']
    } else if (node_env.match(/test/)) {
        return knexClientConfigs['testing']
    } else {
        return knexClientConfigs['development']
    }
}
console.log(config())
const knexClient = knex(config());
module.exports = { knexClient };