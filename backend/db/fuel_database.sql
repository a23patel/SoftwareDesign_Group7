PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "USERS" (
        "username" TEXT NOT NULL CHECK("username" REGEXP '^[a-zA-Z0-9]{3,}$'),
        "password" TEXT NOT NULL,
        PRIMARY KEY("username")
);
CREATE TABLE IF NOT EXISTS "PROFILE" (
        "client_username"  TEXT NOT NULL CHECK("client_username" REGEXP '^[a-zA-Z0-9]{3,}$'),
        "full_name" TEXT NOT NULL,
        "email" TEXT NOT NULL CHECK("email" REGEXP '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'),
        "address1"  TEXT NOT NULL,
        "address2"  TEXT,
        "city"  TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "zipcode"  TEXT NOT NULL CHECK("zipcode" REGEXP '^[0-9]{5}$'),
        "phone" TEXT NOT NULL CHECK("phone" REGEXP '^[0-9]{10}$'),
        PRIMARY KEY("client_username"),
        FOREIGN KEY("client_username") REFERENCES "USERS"("username")
);
CREATE TABLE IF NOT EXISTS "QUOTE" (
        "client_username"  TEXT NOT NULL CHECK("client_username" REGEXP '^[a-zA-Z0-9]{3,}$'),
        "delivery_date" TEXT NOT NULL,
        "gallons_requested" INTEGER NOT NULL CHECK("gallons_requested" > 0),
        "suggested_price"  INTEGER NOT NULL,
        "amount_due"   INTEGER NOT NULL,
        "delivery_address"   TEXT NOT NULL,
        "delivery_city" TEXT NOT NULL,
        "delivery_state"  TEXT NOT NULL,
        "delivery_zipcode"  TEXT NOT NULL CHECK("delivery_zipcode" REGEXP '^[0-9]{5}$' ),
        FOREIGN KEY("client_username") REFERENCES "USERS"("username")
);
COMMIT;
