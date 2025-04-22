/**
 * Card formatter and utilities
 */
const CardFormatter = {
    /**
     * Format a credit card number with spaces
     * @param {string} cardNumber - The card number to format
     * @returns {string} - The formatted card number
     */
    formatCardNumber: function(cardNumber) {
      // Remove non-digit characters
      const digits = cardNumber.replace(/\D/g, '');
      
      // Get card type
      const cardType = Validator.getCardType(digits);
      
      // Format based on card type
      if (cardType === 'amex') {
        // Format as: XXXX XXXXXX XXXXX
        return digits.replace(/^(\d{4})(\d{6})(\d{0,5})/, (match, p1, p2, p3) => {
          let result = p1;
          if (p2) result += ' ' + p2;
          if (p3) result += ' ' + p3;
          return result;
        });
      } else {
        // Format as: XXXX XXXX XXXX XXXX
        return digits.replace(/^(\d{4})(\d{4})?(\d{4})?(\d{0,4})?/, (match, p1, p2, p3, p4) => {
          let result = p1;
          if (p2) result += ' ' + p2;
          if (p3) result += ' ' + p3;
          if (p4) result += ' ' + p4;
          return result;
        });
      }
    },
    
    /**
     * Format an expiry date
     * @param {string} expiryDate - The expiry date to format
     * @returns {string} - The formatted expiry date
     */
    formatExpiryDate: function(expiryDate) {
      // Remove non-digit characters
      const digits = expiryDate.replace(/\D/g, '');
      
      // Format as MM/YY
      return digits.replace(/^(\d{2})(\d{0,2})/, (match, p1, p2) => {
        let result = p1;
        if (p1.length === 2) result += '/';
        if (p2) result += p2;
        return result;
      });
    },
    
    /**
     * Update the active card icon based on card number
     * @param {string} cardNumber - The card number
     * @param {NodeList} cardIcons - The card icon elements
     */
    updateCardIcon: function(cardNumber, cardIcons) {
      const cardType = Validator.getCardType(cardNumber);
      
      // Reset active state
      cardIcons.forEach(icon => {
        icon.classList.remove('active');
      });
      
      // Set active card icon
      if (cardType) {
        const activeIcon = Array.from(cardIcons).find(icon => icon.classList.contains(cardType));
        if (activeIcon) {
          activeIcon.classList.add('active');
        }
      } else if (cardNumber.length > 0) {
        // Default to first icon if card type not recognized but there are digits
        cardIcons[0].classList.add('active');
      }
    }
  };
  
  /**
   * Simulated payment processing
   */
  const PaymentProcessor = {
    /**
     * Process a payment (simulation)
     * @param {Object} paymentData - The payment data
     * @returns {Promise} - A promise that resolves with payment result
     */
    processPayment: function(paymentData) {
      return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
          // 90% success rate for simulation
          const isSuccessful = Math.random() < 0.9;
          
          if (isSuccessful) {
            resolve({
              success: true,
              transactionId: this.generateTransactionId(),
              message: 'Payment processed successfully'
            });
          } else {
            reject({
              success: false,
              error: 'Transaction declined',
              message: 'Your card was declined. Please try a different payment method.'
            });
          }
        }, 1500);
      });
    },
    
    /**
     * Generate a random transaction ID
     * @returns {string} - A transaction ID
     */
    generateTransactionId: function() {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      return `TRANS-${timestamp}-${randomStr}`.toUpperCase();
    }
  };