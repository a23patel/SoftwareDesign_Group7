-- Deinitialize everything if it is setup
DROP USER IF EXISTS 'app';
DROP DATABASE IF EXISTS cosc4353app;
COMMIT;

-- Initialize the database
CREATE DATABASE cosc4353app;
USE cosc4353app;

-- Create our tables
CREATE TABLE users (
  username VARCHAR(16) NOT NULL CHECK(username REGEXP '^[a-zA-Z0-9]{3,}$'),
  password CHAR(44) NOT NULL CHECK(password REGEXP '^[a-zA-Z0-9+/=]{44}$'),
  PRIMARY KEY(username)
);

CREATE TABLE quote (
  client_username VARCHAR(16) NOT NULL,
  delivery_date DATE NOT NULL,
  gallons_requested INTEGER NOT NULL CHECK(gallons_requested > 0),
  suggested_price DECIMAL(10,2) NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  delivery_address VARCHAR(160) NOT NULL,
  delivery_city VARCHAR(50) NOT NULL,
  delivery_state CHAR(2) NOT NULL,
  delivery_zipcode CHAR(5) NOT NULL CHECK(delivery_zipcode REGEXP '^[0-9]{5}$'),
  FOREIGN KEY(client_username) REFERENCES users(username)
);



COMMIT;

-- Create a role 'app' and login for the backend to use on the database
CREATE USER 'app' IDENTIFIED WITH mysql_native_password BY 'test_password';

-- Granting necessarily data-modification privileges to 'app'
GRANT INSERT, DELETE, SELECT, UPDATE ON cosc4353app.* TO 'app'@'localhost';

COMMIT;
