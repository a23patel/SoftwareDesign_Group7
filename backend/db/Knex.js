const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'app',
    password: 'test_password',
    database: 'cosc4353app'
  }
});

knex.schema.dropTableIfExists('quote')
  .dropTableIfExists('users')
  .dropTableIfExists('sessions')
  .dropTableIfExists('profile')
  .then(function () {
    return knex.schema.createTable('users', function (table) {
      table.string('username', 16).notNullable().unique().checkIn('username', /^[a-zA-Z0-9]{3,}$/);
      table.string('password', 44).notNullable().checkIn('password', /^[a-zA-Z0-9+/=]{44}$/);
      table.primary(['username']);
    });
  })
  .then(function () {
    return knex.schema.createTable('quote', function (table) {
      table.string('client_username', 16).notNullable().references('username').inTable('users');
      table.date('delivery_date').notNullable();
      table.integer('gallons_requested').notNullable().checkIn('gallons_requested', function (value) {
        return value > 0;
      });
      table.decimal('suggested_price', 10, 2).notNullable();
      table.decimal('amount_due', 10, 2).notNullable();
      table.string('delivery_address', 160).notNullable();
      table.string('delivery_city', 50).notNullable();
      table.string('delivery_state', 2).notNullable();
      table.string('delivery_zipcode', 5).notNullable().checkIn('delivery_zipcode', /^[0-9]{5}$/);
    });
  })
  .then(function () {
    return knex.schema.createTable('sessions', function (table) {
      table.string('username', 16).notNullable().references('username').inTable('users');
      table.string('token', 512).notNullable();
      table.primary(['username', 'token']);
    });
  })
  .then(function () {
    return knex.schema.createTable('profile', function (table) {
      table.string('client_username', 16).notNullable().references('username').inTable('users');
      table.string('full_name', 50).notNullable();
      table.string('email', 50).notNullable().checkIn('email', /^[[:alnum:]]+([\.-]?[[:alnum:]]+)*@\[[:alnum:]]+([\.-]?[[:alnum:]]+)*(\.[[:alnum:]]{2,3})+$/);
      table.string('address1', 80).notNullable();
      table.string('address2', 80);
      table.string('city', 50).notNullable();
      table.string('state', 2).notNullable();
      table.string('zipcode', 5).notNullable().checkIn('zipcode', /^[0-9]{5}$/);
      table.primary(['client_username']);
    });
  })
  .catch(function (err) {
    console.log(err);
  })
  .finally(function () {
    knex.destroy();
  });
