const { validateInputFields, calculateTotalPrice } = require('./FuelQuoteModule');


// TESTING VALID INPUTS
// TEST 1
describe('validateInputFields', () => {
    test('should return an empty array when all fields are valid', () => {
      // Arrange
      const validGallonsRequested = 100;
      const validDeliveryDate = '2023-03-25';
      const validDeliveryAddress = '123 Main St';
      const validDeliveryCity = 'Houston';
      const validDeliveryState = 'TX';
      const validDeliveryZipcode = '77001';
      const validSuggestedPricePerGallon = 2.5;
  
      // Act
      const errors = validateInputFields(
        validGallonsRequested,
        validDeliveryDate,
        validDeliveryAddress,
        validDeliveryCity,
        validDeliveryState,
        validDeliveryZipcode,
        validSuggestedPricePerGallon
      );
  
      // Assert
      expect(errors).toEqual([]);
    });
  
    test('should return an array with error messages when one or more fields are invalid', () => {
      // Arrange
      const invalidGallonsRequested = -100;
      const invalidDeliveryDate = '2023-03-01';
      const invalidDeliveryAddress = '';
      const invalidDeliveryCity = '';
      const invalidDeliveryState = '';
      const invalidDeliveryZipcode = '1234';
      const invalidSuggestedPricePerGallon = 'abc';
  
      // Act
      const errors = validateInputFields(
        invalidGallonsRequested,
        invalidDeliveryDate,
        invalidDeliveryAddress,
        invalidDeliveryCity,
        invalidDeliveryState,
        invalidDeliveryZipcode,
        invalidSuggestedPricePerGallon
      );
  
      // Assert
      expect(errors.length).toBeGreaterThan(0);
    });
  
    test('should return an array with error messages when gallonsRequested is at its minimum limit', () => {
      // Arrange
      const minGallonsRequested = 0;
      const validDeliveryDate = '2023-03-25';
      const validDeliveryAddress = '123 Main St';
      const validDeliveryCity = 'Houston';
      const validDeliveryState = 'TX';
      const validDeliveryZipcode = '77001';
      const validSuggestedPricePerGallon = 2.5;
  
      // Act
      const errors = validateInputFields(
        minGallonsRequested,
        validDeliveryDate,
        validDeliveryAddress,
        validDeliveryCity,
        validDeliveryState,
        validDeliveryZipcode,
        validSuggestedPricePerGallon
      );
  
      // Assert
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should return an array with error messages when deliveryDate is in the past', () => {
        // Arrange
        const validGallonsRequested = 100;
        const invalidDeliveryDate = '2022-03-25';
        const validDeliveryAddress = '123 Main St';
        const validDeliveryCity = 'Houston';
        const validDeliveryState = 'TX';
        const validDeliveryZipcode = '77001';
        const validSuggestedPricePerGallon = 2.5;
      
        // Act
        const errors = validateInputFields(
          validGallonsRequested,
          invalidDeliveryDate,
          validDeliveryAddress,
          validDeliveryCity,
          validDeliveryState,
          validDeliveryZipcode,
          validSuggestedPricePerGallon
        );
      
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });
      
      test('should return an array with error messages when deliveryZipcode is not 5 digits', () => {
        // Arrange
        const validGallonsRequested = 100;
        const validDeliveryDate = '2023-03-25';
        const validDeliveryAddress = '123 Main St';
        const validDeliveryCity = 'Houston';
        const validDeliveryState = 'TX';
        const invalidDeliveryZipcode = '123456';
        const validSuggestedPricePerGallon = 2.5;
      
        // Act
        const errors = validateInputFields(
          validGallonsRequested,
          validDeliveryDate,
          validDeliveryAddress,
          validDeliveryCity,
          validDeliveryState,
          invalidDeliveryZipcode,
          validSuggestedPricePerGallon
        );
      
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });
      
      test('should return an array with error messages when suggestedPricePerGallon is at its minimum limit', () => {
        // Arrange
        const validGallonsRequested = 100;
        const validDeliveryDate = '2023-03-25';
        const validDeliveryAddress = '123 Main St';
        const validDeliveryCity = 'Houston';
        const validDeliveryState = 'TX';
        const validDeliveryZipcode = '77001';
        const minSuggestedPricePerGallon = 0;
        
        // Act
        const errors = validateInputFields(
          validGallonsRequested,
          validDeliveryDate,
          validDeliveryAddress,
          validDeliveryCity,
          validDeliveryState,
          validDeliveryZipcode,
          minSuggestedPricePerGallon
        );
      
        // Assert
        expect(errors.length).toBeGreaterThan(0);
      });
});



// TESTING VALID CALCULATION
// TEST 2



describe('calculateTotalPrice', () => {
  test('should calculate the total price correctly', () => {
    // Arrange
    const gallonsRequested = 800;
    const suggestedPricePerGallon = 2.2;
    const locationFactor = 0.05;
    const rateHistoryFactor = 0;
    const companyProfitFactor = 0.1;

    // Act
    const totalPrice = calculateTotalPrice(
      gallonsRequested,
      suggestedPricePerGallon,
      locationFactor,
      rateHistoryFactor,
      companyProfitFactor
    );

    // Assert
    expect(totalPrice).toBe(2024);
  });
  test('should return 0 when 0 gallons are requested', () => {
    // Arrange
    const gallonsRequested = 0;
    const suggestedPricePerGallon = 2.2;
    const locationFactor = 0.05;
    const rateHistoryFactor = 0;
    const companyProfitFactor = 0.1;
  
    // Act
    const totalPrice = calculateTotalPrice(
      gallonsRequested,
      suggestedPricePerGallon,
      locationFactor,
      rateHistoryFactor,
      companyProfitFactor
    );
  
    // Assert
    expect(totalPrice).toBe(0);
  });
  test('should return 0 when suggested price per gallon is 0', () => {
    // Arrange
    const gallonsRequested = 500;
    const suggestedPricePerGallon = 0;
    const locationFactor = 0.05;
    const rateHistoryFactor = 0.01;
    const companyProfitFactor = 0.1;
  
    // Act
    const totalPrice = calculateTotalPrice(
      gallonsRequested,
      suggestedPricePerGallon,
      locationFactor,
      rateHistoryFactor,
      companyProfitFactor
    );
  
    // Assert
    expect(totalPrice).toBe(0);
  });
  test('should calculate the total price correctly with negative location factor', () => {
    // Arrange
    const gallonsRequested = 1000;
    const suggestedPricePerGallon = 2.5;
    const locationFactor = -0.05;
    const rateHistoryFactor = 0;
    const companyProfitFactor = 0.1;
  
    // Act
    const totalPrice = calculateTotalPrice(
      gallonsRequested,
      suggestedPricePerGallon,
      locationFactor,
      rateHistoryFactor,
      companyProfitFactor
    );
  
    // Assert
    expect(totalPrice).toBe(2625);
  });
  test('should calculate the total price correctly with negative rate history factor', () => {
    // Arrange
    const gallonsRequested = 1200;
    const suggestedPricePerGallon = 2.7;
    const locationFactor = 0.02;
    const rateHistoryFactor = -0.01;
    const companyProfitFactor = 0.05;
  
    // Act
    const totalPrice = calculateTotalPrice(
      gallonsRequested,
      suggestedPricePerGallon,
      locationFactor,
      rateHistoryFactor,
      companyProfitFactor
    );
  
    // Assert
    expect(totalPrice).toBe(3499.2);
  });

  
  
  
  
});
