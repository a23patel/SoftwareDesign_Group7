const validateInputFields = function(gallonsRequested, deliveryDate, deliveryAddress, deliveryCity, deliveryState, deliveryZipcode, suggestedPricePerGallon) {
    let errors = [];
  
    // Validate gallonsRequested
    if (!gallonsRequested || isNaN(gallonsRequested) || gallonsRequested < 0) {
      errors.push("Please enter a valid number of gallons requested.");
    }
  
    // Validate deliveryDate
    if (!deliveryDate || new Date(deliveryDate) <= new Date()) {
      errors.push("Please enter a valid delivery date.");
    }
  
    // Validate deliveryAddress
    if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 1) {
      errors.push("Please enter a valid delivery address.");
    }
  
    // Validate deliveryCity
    if (typeof deliveryCity !== 'string' || deliveryCity.trim().length < 1) {
      errors.push("Please enter a valid delivery city.");
    }
  
    // Validate deliveryState
    if (typeof deliveryState !== 'string' || deliveryState.trim().length < 1) {
      errors.push("Please enter a valid delivery state.");
    }
  
    // Validate deliveryZipcode
    if (!deliveryZipcode || isNaN(deliveryZipcode) || deliveryZipcode.toString().length !== 5) {
      errors.push("Please enter a valid 5-digit delivery zipcode.");
    }
  
    // Validate suggestedPricePerGallon
    if (!suggestedPricePerGallon || isNaN(suggestedPricePerGallon) || suggestedPricePerGallon < 0) {
      errors.push("Please enter a valid suggested price per gallon.");
    }
  
    return errors;
  }

  const calculateTotalPrice = function(gallonsRequested, suggestedPricePerGallon, locationFactor, rateHistoryFactor, companyProfitFactor) {
    const margin = (locationFactor - rateHistoryFactor + companyProfitFactor) * suggestedPricePerGallon;
    const totalPrice = gallonsRequested * (suggestedPricePerGallon + margin);
    return Math.round(totalPrice * 100) / 100; // round to 2 decimal places
  };
  

  
  module.exports = {
    validateInputFields,calculateTotalPrice
  };
  