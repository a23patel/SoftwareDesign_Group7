use cosc4353app;
drop table profile;
drop table quote;
drop table users;
create table users (
		username varchar(16) not null check(username regexp '^[a-zA-Z0-9]{3,}$'),
        password char(44) not null,
        primary key(username)
);
CREATE TABLE profile (
        client_username  varchar(16) NOT NULL CHECK(client_username REGEXP '^[a-zA-Z0-9]{3,}$'),
        full_name varchar(50) NOT NULL,
        email varchar(50) NOT NULL CHECK(email REGEXP '^[[:alnum:]]+([\.-]?[[:alnum:]]+)*@\[[:alnum:]]+([\.-]?[[:alnum:]]+)*(\.[[:alnum:]]{2,3})+$'),
        address1 varchar(80) NOT NULL,
        address2 varchar(80),
        city varchar(50) NOT NULL,
        state char(2) NOT NULL,
        zipcode char(5) NOT NULL CHECK(zipcode REGEXP '^[0-9]{5}$'),
        phone char(10) NOT NULL CHECK(phone REGEXP '[0-9]{10}'),
        PRIMARY KEY(client_username),
        FOREIGN KEY(client_username) REFERENCES users(username)
);
CREATE TABLE quote (
        client_username varchar(16) NOT NULL,
        delivery_date date NOT NULL,
        gallons_requested integer NOT NULL CHECK(gallons_requested > 0),
        suggested_price  decimal(10,2) NOT NULL,
        amount_due decimal(10,2) NOT NULL,
        delivery_address varchar(160) NOT NULL,
        delivery_city varchar(50) NOT NULL,
        delivery_state  char(2) NOT NULL,
        delivery_zipcode  char(5) NOT NULL CHECK(delivery_zipcode REGEXP '^[0-9]{5}$' ),
        FOREIGN KEY(client_username) REFERENCES users(username)
);
commit;