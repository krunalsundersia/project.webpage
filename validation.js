/**
 * Form validation utilities
 */
const Validator = {
    /**
     * Validate an email address
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    isValidEmail: function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    /**
     * Validate a phone number
     * @param {string} phone - The phone number to validate
     * @returns {boolean} - Whether the phone number is valid
     */
    isValidPhone: function(phone) {
      // Allow various formats with optional country code
      const phoneRegex = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      return phoneRegex.test(phone);
    },
    
    /**
     * Validate a credit card number using Luhn algorithm
     * @param {string} cardNumber - The card number to validate
     * @returns {boolean} - Whether the card number is valid
     */
    isValidCardNumber: function(cardNumber) {
      // Remove spaces and dashes
      cardNumber = cardNumber.replace(/[\s-]/g, '');
      
      // Check if contains only digits and has correct length
      if (!/^\d{13,19}$/.test(cardNumber)) {
        return false;
      }
      
      // Luhn algorithm
      let sum = 0;
      let shouldDouble = false;
      
      // Loop from right to left
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return sum % 10 === 0;
    },
    
    /**
     * Validate card expiry date
     * @param {string} expiryDate - The expiry date in MM/YY format
     * @returns {boolean} - Whether the expiry date is valid and not expired
     */
    isValidExpiryDate: function(expiryDate) {
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return false;
      }
      
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const expiryMonth = parseInt(month, 10);
      const expiryYear = parseInt(year, 10);
      
      // Check if month is valid
      if (expiryMonth < 1 || expiryMonth > 12) {
        return false;
      }
      
      // Check if the card is expired
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return false;
      }
      
      return true;
    },
    
    /**
     * Validate CVV code
     * @param {string} cvv - The CVV code
     * @param {string} cardType - The type of card (optional)
     * @returns {boolean} - Whether the CVV is valid
     */
    isValidCVV: function(cvv, cardType = 'visa') {
      // For American Express, CVV is 4 digits, otherwise 3
      const cvvLength = cardType.toLowerCase() === 'amex' ? 4 : 3;
      const cvvRegex = new RegExp(`^\\d{${cvvLength}}$`);
      return cvvRegex.test(cvv);
    },
    
    /**
     * Validate a field is not empty
     * @param {string} value - The value to check
     * @returns {boolean} - Whether the value is not empty
     */
    isNotEmpty: function(value) {
      return value.trim() !== '';
    },
    
    /**
     * Validate a zip/postal code
     * @param {string} zipCode - The zip code to validate
     * @param {string} country - The country code (optional, defaults to US)
     * @returns {boolean} - Whether the zip code is valid
     */
    isValidZipCode: function(zipCode, country = 'US') {
      const zipRegexes = {
        'US': /^\d{5}(-\d{4})?$/,
        'CA': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'UK': /^[A-Za-z]{1,2}\d[A-Za-z\d]?[ ]?\d[A-Za-z]{2}$/
      };
      
      const regex = zipRegexes[country] || zipRegexes['US'];
      return regex.test(zipCode);
    },
    
    /**
     * Get the credit card type based on the number
     * @param {string} cardNumber - The card number
     * @returns {string|null} - The card type or null if not recognized
     */
    getCardType: function(cardNumber) {
      // Remove spaces and dashes
      cardNumber = cardNumber.replace(/[\s-]/g, '');
      
      // Patterns for card types
      const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
      };
      
      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) {
          return type;
        }
      }
      
      return null;
    }
  };
  
  /**
   * Form field validator and error handler
   */
  class FormValidator {
    /**
     * Create a form validator
     * @param {HTMLFormElement} form - The form to validate
     */
    constructor(form) {
      this.form = form;
      this.errors = {};
    }
    
    /**
     * Validate a single form field
     * @param {HTMLInputElement|HTMLSelectElement} field - The field to validate
     * @param {Function} validationFn - The validation function to use
     * @param {string} errorMessage - The error message to display if validation fails
     * @returns {boolean} - Whether the field is valid
     */
    validateField(field, validationFn, errorMessage) {
      const fieldName = field.name;
      const fieldValue = field.value;
      const errorElement = field.parentElement.querySelector('.error-message');
      
      // Reset error state
      field.parentElement.classList.remove('has-error');
      errorElement.textContent = '';
      this.errors[fieldName] = null;
      
      // Validate
      if (!validationFn(fieldValue)) {
        field.parentElement.classList.add('has-error');
        errorElement.textContent = errorMessage;
        this.errors[fieldName] = errorMessage;
        
        // Add shake animation
        field.parentElement.classList.add('shake');
        setTimeout(() => {
          field.parentElement.classList.remove('shake');
        }, 600);
        
        return false;
      }
      
      return true;
    }
    
    /**
     * Validate all fields in a form and return if the form is valid
     * @param {Object} fields - Map of field names to validation configs
     * @returns {boolean} - Whether the form is valid
     */
    validateForm(fields) {
      let isValid = true;
      
      for (const [fieldName, config] of Object.entries(fields)) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) continue;
        
        const fieldIsValid = this.validateField(
          field,
          config.validationFn,
          config.errorMessage
        );
        
        if (!fieldIsValid) {
          isValid = false;
        }
      }
      
      return isValid;
    }
    
    /**
     * Check if a form has any errors
     * @returns {boolean} - Whether the form has errors
     */
    hasErrors() {
      return Object.values(this.errors).some(error => error !== null);
    }
    
    /**
     * Add input listeners to validate fields as the user types
     * @param {Object} fields - Map of field names to validation configs
     */
    addFieldListeners(fields) {
      for (const [fieldName, config] of Object.entries(fields)) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) continue;
        
        // Validate on blur
        field.addEventListener('blur', () => {
          this.validateField(field, config.validationFn, config.errorMessage);
        });
        
        // Optional: Live validation as user types (with delay)
        if (config.validateLive) {
          let timeout = null;
          field.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              this.validateField(field, config.validationFn, config.errorMessage);
            }, 500);
          });
        }
      }
    }
  }