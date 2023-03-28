PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "USERS" (
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("username")
);
CREATE TABLE IF NOT EXISTS "PROFILE" (
	"client_username"	TEXT NOT NULL,
	"full_name"	TEXT NOT NULL,
	"address1"	TEXT NOT NULL,
	"address2"	TEXT NOT NULL,
	"city"	TEXT NOT NULL,
	"state"	TEXT NOT NULL,
	"zipcode"	TEXT NOT NULL,
	FOREIGN KEY("client_username") REFERENCES "USERS"("username"),
	PRIMARY KEY("client_username")
);
CREATE TABLE IF NOT EXISTS "QUOTE" (
	"client_username"	TEXT NOT NULL,
	"delivery_date"	TEXT NOT NULL,
	"gallons_requested"	INTEGER NOT NULL,
	"suggested_price"	INTEGER NOT NULL,
	"amount_due"	INTEGER NOT NULL,
	"delivery_address"	INTEGER NOT NULL,
	"delivery_city"	TEXT NOT NULL,
	"delivery_state"	TEXT NOT NULL,
	"delivery_zipcode"	TEXT NOT NULL,
	FOREIGN KEY("client_username") REFERENCES "USERS"("username")
);
COMMIT;
