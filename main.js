document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const personalDetailsForm = document.getElementById('personalDetailsForm');
    const paymentForm = document.getElementById('paymentForm');
    const confirmationSection = document.getElementById('confirmationSection');
    
    const continueToPaymentBtn = document.getElementById('continueToPayment');
    const backToDetailsBtn = document.getElementById('backToDetails');
    const completePaymentBtn = document.getElementById('completePayment');
    const returnHomeBtn = document.getElementById('returnHome');
    
    const steps = document.querySelectorAll('.step');
    const orderDateElement = document.getElementById('orderDate');
    const paymentMethodElement = document.getElementById('paymentMethod');
    
    // Set current date in the order confirmation
    orderDateElement.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create form validators
    const personalDetailsValidator = new FormValidator(personalDetailsForm);
    const paymentValidator = new FormValidator(paymentForm);
    
    // Input Formatters
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cardIcons = document.querySelectorAll('.card-icon');
    
    cardNumberInput.addEventListener('input', function(e) {
      const formattedValue = CardFormatter.formatCardNumber(e.target.value);
      e.target.value = formattedValue;
      
      // Update card icon
      CardFormatter.updateCardIcon(formattedValue, cardIcons);
      
      // Update payment method in confirmation
      const cardType = Validator.getCardType(formattedValue);
      const lastFour = formattedValue.replace(/\D/g, '').slice(-4);
      if (cardType && lastFour) {
        const cardName = cardType.charAt(0).toUpperCase() + cardType.slice(1);
        paymentMethodElement.textContent = `${cardName} ending in ${lastFour}`;
      }
    });
    
    expiryDateInput.addEventListener('input', function(e) {
      e.target.value = CardFormatter.formatExpiryDate(e.target.value);
    });
    
    // Personal Details Form Validation Rules
    const personalDetailsFields = {
      firstName: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'First name is required',
        validateLive: false
      },
      lastName: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'Last name is required',
        validateLive: false
      },
      email: {
        validationFn: Validator.isValidEmail,
        errorMessage: 'Please enter a valid email address',
        validateLive: true
      },
      phone: {
        validationFn: Validator.isValidPhone,
        errorMessage: 'Please enter a valid phone number',
        validateLive: true
      },
      address: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'Address is required',
        validateLive: false
      },
      city: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'City is required',
        validateLive: false
      },
      zipCode: {
        validationFn: (value) => Validator.isValidZipCode(value),
        errorMessage: 'Please enter a valid zip code',
        validateLive: true
      },
      country: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'Please select a country',
        validateLive: false
      }
    };
    
    // Payment Form Validation Rules
    const paymentFields = {
      cardNumber: {
        validationFn: Validator.isValidCardNumber,
        errorMessage: 'Please enter a valid card number',
        validateLive: true
      },
      cardName: {
        validationFn: Validator.isNotEmpty,
        errorMessage: 'Name on card is required',
        validateLive: false
      },
      expiryDate: {
        validationFn: Validator.isValidExpiryDate,
        errorMessage: 'Please enter a valid expiry date (MM/YY)',
        validateLive: true
      },
      cvv: {
        validationFn: (value) => Validator.isValidCVV(value),
        errorMessage: 'Please enter a valid CVV code',
        validateLive: true
      }
    };
    
    // Add field listeners for all inputs
    personalDetailsValidator.addFieldListeners(personalDetailsFields);
    paymentValidator.addFieldListeners(paymentFields);
    
    // Form Submission Handlers
    continueToPaymentBtn.addEventListener('click', function() {
      if (personalDetailsValidator.validateForm(personalDetailsFields)) {
        // Update progress steps
        steps[0].classList.add('completed');
        steps[1].classList.add('active');
        steps[0].classList.remove('active');
        
        // Hide personal details form and show payment form
        personalDetailsForm.classList.remove('active');
        paymentForm.classList.add('active');
        
        // Apply animation
        paymentForm.style.animation = 'slideInRight 0.5s forwards';
      }
    });
    
    backToDetailsBtn.addEventListener('click', function() {
      // Update progress steps
      steps[0].classList.add('active');
      steps[0].classList.remove('completed');
      steps[1].classList.remove('active');
      
      // Hide payment form and show personal details form
      paymentForm.classList.remove('active');
      personalDetailsForm.classList.add('active');
      
      // Apply animation
      personalDetailsForm.style.animation = 'slideInLeft 0.5s forwards';
    });
    
    completePaymentBtn.addEventListener('click', function() {
      if (paymentValidator.validateForm(paymentFields)) {
        // Show loading state
        completePaymentBtn.disabled = true;
        completePaymentBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        
        // Simulate payment processing
        PaymentProcessor.processPayment({
          cardNumber: cardNumberInput.value,
          expiryDate: expiryDateInput.value,
          cvv: document.getElementById('cvv').value,
          name: document.getElementById('cardName').value
        })
        .then(result => {
          // Reset button state
          completePaymentBtn.disabled = false;
          completePaymentBtn.innerHTML = 'Complete Payment';
          
          // Update progress steps
          steps[1].classList.add('completed');
          steps[2].classList.add('active');
          steps[1].classList.remove('active');
          
          // Hide payment form and show confirmation
          paymentForm.classList.remove('active');
          confirmationSection.classList.add('active');
          
          // Apply animation
          confirmationSection.style.animation = 'fadeIn 0.5s forwards';
        })
        .catch(error => {
          // Reset button state
          completePaymentBtn.disabled = false;
          completePaymentBtn.innerHTML = 'Complete Payment';
          
          // Show error message
          alert(`Payment failed: ${error.message}`);
        });
      }
    });
    
    returnHomeBtn.addEventListener('click', function() {
      // In a real application, this would navigate to the homepage
      // For this example, we'll just reload the page
      window.location.reload();
    });
    
    // Handle "Enter" key press to advance to the next step
    personalDetailsForm.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        continueToPaymentBtn.click();
      }
    });
    
    paymentForm.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        completePaymentBtn.click();
      }
    });
  });