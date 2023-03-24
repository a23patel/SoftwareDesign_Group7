# API Revision 1.1

All protected paths require Bearer token in Authorization header

## POST /register

Parameters: JSON body
username (string, required)
email (string, required)
phone (string, required)
password (string, required)

Return values: JSON body
message (string)

HTTP Status Codes:
200 OK: The registration was successful
400 Bad Request: The request was malformed or missing required parameters
500 Internal Server Error: An unexpected error occurred on the server

## POST /login

Parameters: JSON body
username (string, required)
password (string, required)

Return value: JSON body
message (string)
token (string) 

HTTP Status Codes:
200 OK: The login was successful (returned for login success)
400 Bad Request: The request was malformed or missing required parameters (invalid password or username)

## POST /logout *protected*

Parameters: JSON body
Username (string, required)
Token (string, required)

Headers: Authorize with Bearer token

Return value:
None

HTTP Status Codes:
200 OK: The logout was successful (returned for logout success)
400 Bad Request: The request was malformed or missing required parameters (invalid token or username)

## GET /history/:username *protected*

Parameters: query
username (string, required)

Headers: Authorize with Bearer token

Return value: JSON body
message (string)
quotes: [{
	gallons: (float)
	address: (string)
	city: (string)
	state: (string)
	zipcode: (string)
	date: (string)
	price: (float)
	due: (float)
}]
	
HTTP Status Codes:

200 OK: The history request was successful
400 Bad Request: The authentication is incorrect
500 Internal Server Error: The backend server had an error

## GET /quote/:username/:gallons *protected*

Parameters: Query path
username: (string)
gallon: (integer)

Headers: Authorize with Bearer token

Return: JSON body
Price: (float)
Due: (float)

HTTP Status Codes:
200 OK: The quote request was successful
400 Bad Request: The authentication is incorrect, invalid username or session
500 Internal Server Error: The backend server had an error

## POST /quote *protected*

Parameters: JSON body
username (string)
gallons: (integer)
date: (string)
price: (float)
due: (float)

Headers: Authorize with Bearer token

Return value: JSON body
message (string)

HTTP Status Codes:

200 OK: The quote request was successful
400 Bad Request: The authentication is incorrect
500 Internal Server Error: The backend server had an error


## GET /profile/:username *protected*

Parameters:
username (string)

Headers: Authorize with Bearer token

Return value: JSON body
message (string),
fullname: (string),
email: (string),
address1: (string)
address2: (string, optional)
city: (string),
state: (string),
zipcode: (string),
phone: (string)

HTTP Status Codes:

200 OK: The profile request was successful
400 Bad Request: The request was missing the required token parameter
401 Unauthorized: The provided token was invalid or expired
500 Internal Server Error: An unexpected error occurred on the server

## POST /profile/edit *protected*

Parameters: JSON body
username (string)
fullname (string, optional)
email (string, optional)
address1 (string, optional)
address2 (string, optional)
city (string, optional)
state (string, optional)
phone (string, optional)
zipcode (string, optional)

Headers: Authorize with Bearer token

Return value: JSON body
message (string)

HTTP Status Codes:

200 OK: The profile modification was successful
400 Bad Request: Bad username, or missing/invalid token
500 Internal Server Error: An unexpected error occurred on the server