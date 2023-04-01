const FuelDelivery = require("./pricing");
const { knexClient } = require("./knexClient");

const generateFuelQuote = async (username, gallons) => {
  // validate username
  if (!username) {
    throw new Error("Unable to generate fuel quote: Profile does not exist");
  }

  if (typeof username !== "string") {
    throw new Error("Unable to generate fuel quote: Invalid Username");
  }

  const profile = await knexClient("profile")
    .select()
    .where("client_username", "=", username)
    .first();

  if (!profile) {
    throw new Error("Unable to generate fuel quote: Profile does not exist");
  }

  const address = profile.address1 + profile.address2;
  const city = profile.city;
  const state = profile.state;
  const zipcode = profile.zipcode;

  if (!address || !city || !state || !zipcode) {
    throw new Error("Unable to generate fuel quote: Incomplete profile");
  }

  if (typeof gallons !== "number" || gallons < 0) {
    throw new Error("Unable to generate fuel quote: Invalid gallons requested");
  }

  const price = 1.5;
  const fuelDelivery = new FuelDelivery(
    gallons,
    address,
    city,
    state,
    zipcode,
    price
  );

  const newQuote = {
    gallons_requested: gallons,
    delivery_address: address,
    delivery_city: city,
    delivery_state: state,
    delivery_zipcode: zipcode,
    suggested_price: price,
    amount_due: fuelDelivery.getTotalAmountDue(),
  };

  return newQuote;
};

const submitFuelQuote = async (username, gallons, date) => {
  // validate username
  if (!username || typeof username !== "string") {
    throw new Error("Unable to submit fuel quote: Invalid Username");
  }

  if (!date || isNaN(Date.parse(date))) {
    throw new Error("Unable to submit fuel quote: Invalid date");
  }

  const quote = await generateFuelQuote(username, gallons);
  quote.date = date;

  // insert quote object into the quotes table
  await knexClient("quotes").insert({ client_username: username, ...quote });

  return { success: true, message: "Fuel quote submitted successfully!" };
};

const getQuoteHistory = async (username) => {
  const quotes = await knexClient("quotes")
    .select(
      "gallons_requested",
      "delivery_address",
      "delivery_city",
      "delivery_state",
      "delivery_zipcode",
      "suggested_price",
      "amount_due",
      "date"
    )
    .where("client_username", "=", username);

  if (quotes.length === 0) {
    throw new Error(
      "Unable to get quote history: No quotes found for this user"
    );
  }

  return quotes;
};

module.exports = {
  generateFuelQuote,
  submitFuelQuote,
  getQuoteHistory,
};
