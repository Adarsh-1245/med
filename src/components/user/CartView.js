import React, { useState, useEffect, useRef } from 'react';

const CartView = ({
  cart,
  setActiveView,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  handleCheckoutConfirmation,
  paymentLoading
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});
  
  // Tip options
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const tipOptions = [
    { amount: 10, label: '₹10' },
    { amount: 20, label: '₹20' },
    { amount: 30, label: '₹30' },
    { amount: 50, label: '₹50' },
    { amount: 100, label: '₹100' },
    { amount: 0, label: 'Custom' }
  ];

  // Ref for modal overlay
  const modalRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Enhanced back button handler
  const handleBackToMedicines = () => {
    setActiveView('medicine');
  };

  // Modal handlers
  const openAddressModal = () => {
    setShowAddressModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setValidationErrors({}); // Clear validation errors when closing modal
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAddressModal();
    }
  };

  const BackButton = ({ onClick, text = 'Back' }) => (
    <button 
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: '#009688',
        border: '2px solid #009688',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
      type="button"
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#009688';
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#009688';
      }}
    >
      ← {text}
    </button>
  );

  // Format numbers with commas for Indian numbering system
  const formatIndianNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  // Input validation functions
  const validateFullName = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const validatePhone = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    const validNumbers = numbersOnly.split('').filter((char, index) => {
      if (index === 0) {
        return ['6','7','8','9'].includes(char);
      }
      return true;
    }).join('');
    
    return validNumbers.slice(0, 10);
  };

  const validateCity = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const validateState = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const validatePincode = (value) => {
    return value.replace(/[^0-9]/g, '').slice(0, 6);
  };

  // Validate custom tip input
  const validateCustomTip = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    return numbersOnly;
  };

  // Calculate total with tip
  const getTotalWithTip = () => {
    const subtotal = getTotalPrice();
    let tipAmount = selectedTip;
    
    if (selectedTip === 0 && customTip) {
      tipAmount = parseInt(customTip) || 0;
    }
    
    return {
      subtotal,
      tip: tipAmount,
      total: subtotal + tipAmount
    };
  };

  // Handle tip selection
  const handleTipSelect = (amount) => {
    setSelectedTip(amount);
    if (amount !== 0) {
      setCustomTip('');
    }
  };

  // Handle custom tip change
  const handleCustomTipChange = (value) => {
    const validatedValue = validateCustomTip(value);
    setCustomTip(validatedValue);
    if (validatedValue) {
      setSelectedTip(0);
    }
  };

  // Handle address form input changes with validation
  const handleAddressChange = (field, value) => {
    let validatedValue = value;

    switch (field) {
      case 'fullName':
        validatedValue = validateFullName(value);
        break;
      case 'phone':
        validatedValue = validatePhone(value);
        break;
      case 'city':
        validatedValue = validateCity(value);
        break;
      case 'state':
        validatedValue = validateState(value);
        break;
      case 'pincode':
        validatedValue = validatePincode(value);
        break;
      default:
        validatedValue = value;
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    setAddress(prev => ({
      ...prev,
      [field]: validatedValue
    }));
  };

  // Field-specific validation
  const validateField = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Full name must be at least 3 characters';
        return '';
        
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (value.length !== 10) return 'Phone number must be 10 digits';
        if (!['6','7','8','9'].includes(value[0])) return 'Phone number must start with 6,7,8 or 9';
        return '';
        
      case 'street':
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Please enter a valid street address';
        return '';
        
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'Please enter a valid city name';
        return '';
        
      case 'state':
        if (!value.trim()) return 'State is required';
        if (value.trim().length < 2) return 'Please enter a valid state name';
        return '';
        
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (value.length !== 6) return 'Pincode must be 6 digits';
        return '';
        
      default:
        return '';
    }
  };

  // Validate entire address form
  const validateAddress = () => {
    const errors = {};
    let isValid = true;

    const fieldsToValidate = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, address[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Handle checkout process
  const handleCheckout = async () => {
    // First step: Open address modal
    openAddressModal();
  };

  // Handle final payment submission
  const handlePaymentSubmit = async () => {
    // Validate address
    if (!validateAddress()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(`address-${firstErrorField}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    // Prepare checkout data with tip
    const totals = getTotalWithTip();
    const checkoutData = {
      address,
      tip: totals.tip,
      totalAmount: totals.total
    };

    // Close modal first
    closeAddressModal();

    // Proceed with payment (wrap in try-catch to handle payment cancellation)
    try {
      await handleCheckoutConfirmation(checkoutData);
    } catch (error) {
      // Handle payment cancellation or error
      console.log('Payment was cancelled or failed:', error);
      // No alert or localhost message shown
    }
  };

  // Helper function to render error message
  const renderErrorMessage = (field) => {
    if (validationErrors[field]) {
      return (
        <div style={{
          color: '#ff4444',
          fontSize: '0.75rem',
          marginTop: '0.25rem',
          marginLeft: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span style={{ fontSize: '0.9rem' }}>⚠️</span>
          {validationErrors[field]}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      marginTop: '120px',
      padding: '1.5rem',
      maxWidth: '1400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#E0F2F1', // softbg
    }}>
      {/* Header Section - Compact */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        textAlign: 'center',
        width: '100%',
        position: 'relative',
      }}>
        {/* Back Button - Left Edge */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          marginTop: '1.5rem',
          transform: 'translateY(-50%)',
        }}>
          <BackButton onClick={handleBackToMedicines} text="Back to Medicines" />
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center',
          width: '100%',
        }}>
          <h2 style={{
            color: '#124441', // darktext
            fontSize: '2rem',
            margin: 0,
            marginTop: '1.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #009688, #4DB6AC)', // primary to mint
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Your Shopping Cart</h2>
        </div>
        
        {/* Cart Summary Stats - Compact */}
        {cart.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '0.5rem',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #4DB6AC', // mint
              textAlign: 'center',
            }}>
              <div style={{
                color: '#009688', // primary
                fontSize: '1.4rem',
                fontWeight: '800',
                marginBottom: '0.25rem',
              }}>
                {cart.length}
              </div>
              <div style={{
                color: '#4F6F6B', // softtext
                fontSize: '0.8rem',
                fontWeight: '600',
              }}>
                📦 Items
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #4DB6AC', // mint
              textAlign: 'center',
            }}>
              <div style={{
                color: '#009688', // primary
                fontSize: '1.4rem',
                fontWeight: '800',
                marginBottom: '0.25rem',
              }}>
                ₹{formatIndianNumber(getTotalPrice())}
              </div>
              <div style={{
                color: '#4F6F6B', // softtext
                fontSize: '0.8rem',
                fontWeight: '600',
              }}>
                💰 Total
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content - Side by Side Layout */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '1300px',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {cart.length === 0 ? (
          /* Empty Cart State - Compact */
          <div style={{
            backgroundColor: 'white',
            padding: '3rem 2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: '1px solid #4DB6AC', // mint
            textAlign: 'center',
            width: '100%',
            maxWidth: '500px',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              opacity: 0.7,
              animation: 'pulse 2s infinite',
              color: '#009688' // primary
            }}>🛒</div>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#124441' // darktext
            }}>Your cart is empty</h3>
            <p style={{
              margin: '0 0 2rem 0',
              fontSize: '1rem',
              color: '#4F6F6B', // softtext
              lineHeight: '1.5'
            }}>Looks like you haven't added any medicines to your cart yet.</p>
            <button 
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: '#009688', // primary
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)',
              }}
              onClick={handleBackToMedicines}
              type="button"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#00796B';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 150, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#009688';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 150, 136, 0.3)';
              }}
            >
               Shop Medicines Now
            </button>
          </div>
        ) : (
          /* Cart with Items - Side by Side Layout */
          <>
            {/* Cart Items Box - Left Side */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '1px solid #4DB6AC', // mint
              flex: '1 1 600px',
              minWidth: '300px',
              maxWidth: '800px',
            }}>
              <div style={{
                borderBottom: '2px solid #E0F2F1', // softbg
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                <h3 style={{
                  margin: '0 0 0.25rem 0',
                  color: '#124441', // darktext
                  fontSize: '1.5rem',
                  fontWeight: '800',
                }}>🛒 Cart Items ({cart.length})</h3>
                <p style={{
                  margin: 0,
                  color: '#4F6F6B', // softtext
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}>Review your items before checkout</p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '0.5rem',
              }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr auto',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: '1px solid #E0F2F1', // softbg
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#009688'; // primary
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#E0F2F1'; // softbg
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <h4 style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '1rem',
                        color: '#124441', // darktext
                        fontWeight: '700'
                      }}> {item.name}</h4>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.8rem',
                        color: '#4F6F6B', // softtext
                        fontWeight: '500'
                      }}> {item.vendor}</p>
                      <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#009688', // primary
                        fontWeight: '600'
                      }}>₹{formatIndianNumber(item.price)} each</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      justifyContent: 'center',
                    }}>
                      <button 
                        style={{
                          width: '35px',
                          height: '35px',
                          border: '2px solid #009688', // primary
                          backgroundColor: item.quantity <= 1 ? '#E0F2F1' : 'transparent', // softbg
                          borderRadius: '6px',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          color: item.quantity <= 1 ? '#ccc' : '#009688', // primary
                        }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        type="button"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span style={{
                          padding: '0.4rem 0.8rem',
                          fontWeight: '700',
                          minWidth: '35px',
                          textAlign: 'center',
                          backgroundColor: '#009688', // primary
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                        }}>{item.quantity}</span>
                      <button 
                        style={{
                          width: '35px',
                          height: '35px',
                          border: '2px solid #009688', // primary
                          backgroundColor: 'transparent',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          color: '#009688', // primary
                        }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        type="button"
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#009688'; // primary
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#009688'; // primary
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div style={{
                      fontWeight: '800',
                      color: '#009688', // primary
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      backgroundColor: '#E0F2F1', // softbg
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #4DB6AC', // mint
                    }}>
                      ₹{formatIndianNumber(item.price * item.quantity)}
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      style={{
                        width: '40px',
                        height: '40px',
                        border: 'none',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 1px 4px rgba(255, 68, 68, 0.3)',
                      }}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      type="button"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#cc0000';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ff4444';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Box - Right Side */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '1px solid #4DB6AC', // mint
              flex: '0 1 400px',
              minWidth: '350px',
              position: 'sticky',
              top: '140px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <h3 style={{
                  color: '#124441', // darktext
                  fontSize: '1.5rem',
                  margin: 0,
                  textAlign: 'center',
                  fontWeight: '800',
                  borderBottom: '2px solid #E0F2F1', // softbg
                  paddingBottom: '0.75rem',
                }}>💰 Order Summary</h3>
                
                {/* Tip Section - Always Visible */}
                <div style={{
                  marginBottom: '1rem',
                  padding: '1.25rem',
                  backgroundColor: '#E0F2F1', // softbg
                  borderRadius: '12px',
                  border: '1px solid #4DB6AC', // mint
                }}>
                  <h4 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#124441', // darktext
                    textAlign: 'center',
                  }}>💝 Tip Your Delivery Agent (Optional)</h4>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#4F6F6B', // softtext
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}>
                    Support your delivery agent with a small tip for their service
                  </p>
                  
                  {/* Tip Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {tipOptions.map((tip) => (
                      <button
                        key={tip.amount}
                        style={{
                          padding: '0.75rem 0.5rem',
                          border: `2px solid ${selectedTip === tip.amount ? '#009688' : '#4DB6AC'}`, // primary : mint
                          backgroundColor: selectedTip === tip.amount ? '#E0F2F1' : 'white', // softbg
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: selectedTip === tip.amount ? '700' : '600',
                          color: selectedTip === tip.amount ? '#009688' : '#124441', // primary : darktext
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => handleTipSelect(tip.amount)}
                        type="button"
                      >
                        {tip.label}
                        {tip.amount > 0 && (
                          <span style={{
                            fontSize: '0.7rem',
                            color: selectedTip === tip.amount ? '#009688' : '#4F6F6B', // primary : softtext
                            marginTop: '0.2rem'
                          }}>
                            👍
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Tip Input */}
                  {selectedTip === 0 && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#124441', // darktext
                        marginBottom: '0.25rem',
                        marginLeft: '0.25rem'
                      }}>
                        Enter Custom Tip Amount (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter amount"
                        value={customTip}
                        onChange={(e) => handleCustomTipChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #4DB6AC', // mint
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          backgroundColor: 'white',
                          boxSizing: 'border-box',
                          textAlign: 'center'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                        onBlur={(e) => e.target.style.borderColor = '#4DB6AC'} // mint
                      />
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#124441' }}>Subtotal:</span>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#124441' }}>₹{formatIndianNumber(getTotalPrice())}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4F6F6B' }}>Delivery Fee:</span>
                    <span style={{
                      color: '#009688', // primary
                      fontWeight: '700',
                      fontSize: '1rem'
                    }}>🆓 Free</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4F6F6B' }}>Tax (GST):</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4F6F6B' }}>₹0</span>
                  </div>
                  
                  {/* Tip Display */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4F6F6B' }}>Delivery Tip:</span>
                      <span style={{
                        fontSize: '0.7rem',
                        color: '#009688', // primary
                        marginLeft: '0.5rem',
                        backgroundColor: '#E0F2F1', // softbg
                        padding: '0.1rem 0.3rem',
                        borderRadius: '4px'
                      }}>
                        Optional
                      </span>
                    </div>
                    <span style={{
                      color: getTotalWithTip().tip > 0 ? '#009688' : '#4F6F6B', // primary : softtext
                      fontWeight: getTotalWithTip().tip > 0 ? '700' : '500',
                      fontSize: getTotalWithTip().tip > 0 ? '1rem' : '0.9rem'
                    }}>
                      {getTotalWithTip().tip > 0 ? `₹${formatIndianNumber(getTotalWithTip().tip)}` : '₹0'}
                    </span>
                  </div>
                  
                  {/* Grand Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '2px solid #009688', // primary
                    fontWeight: '800',
                    fontSize: '1.2rem',
                    color: '#124441', // darktext
                    backgroundColor: '#E0F2F1', // softbg
                    padding: '1.25rem',
                    borderRadius: '10px',
                  }}>
                    <span>Grand Total:</span>
                    <span>₹{formatIndianNumber(getTotalWithTip().total)}</span>
                  </div>
                  
                  {/* Tip Note */}
                  {getTotalWithTip().tip > 0 && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#009688', // primary
                      textAlign: 'center',
                      fontStyle: 'italic',
                      backgroundColor: '#E0F2F1', // softbg
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #4DB6AC' // mint
                    }}>
                      💝 Thank you for supporting your delivery agent!
                    </div>
                  )}
                </div>
                
                {/* Checkout Button */}
                <button 
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    backgroundColor: paymentLoading ? '#cccccc' : '#009688', // primary
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: paymentLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: paymentLoading ? 'none' : '0 2px 8px rgba(0, 150, 136, 0.3)',
                  }}
                  onClick={handleCheckout}
                  disabled={paymentLoading}
                  type="button"
                  onMouseEnter={(e) => {
                    if (!paymentLoading) {
                      e.target.style.backgroundColor = '#00796B';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 150, 136, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!paymentLoading) {
                      e.target.style.backgroundColor = '#009688';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 150, 136, 0.3)';
                    }
                  }}
                >
                  {paymentLoading ? '⏳ Processing Payment...' : '🚀 Proceed to Checkout'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Address Modal Popup */}
      {showAddressModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={handleOverlayClick}
        >
          <div 
            ref={modalRef}
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              animation: 'slideUp 0.3s ease',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '2px solid #E0F2F1', // softbg
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#E0F2F1', // softbg
              borderTopLeftRadius: '15px',
              borderTopRightRadius: '15px',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}>
              <h2 style={{
                margin: 0,
                color: '#124441', // darktext
                fontSize: '1.5rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📍 Delivery Address
              </h2>
              <button
                onClick={closeAddressModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#124441', // darktext
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4DB6AC'; // mint
                  e.target.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'rotate(0deg)';
                }}
                type="button"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{
              padding: '2rem'
            }}>
              <p style={{
                margin: '0 0 1.5rem 0',
                color: '#4F6F6B', // softtext
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Please enter your delivery details. All fields marked with * are required.
              </p>

              {/* Address Form */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {/* Full Name & Phone Number - Same Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div id="address-fullName">
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#124441', // darktext
                      marginBottom: '0.5rem'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${validationErrors.fullName ? '#ff4444' : '#4DB6AC'}`, // mint
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                      onBlur={(e) => {
                        if (!validationErrors.fullName) {
                          e.target.style.borderColor = '#4DB6AC'; // mint
                        }
                      }}
                    />
                    {renderErrorMessage('fullName')}
                  </div>
                  <div id="address-phone">
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#124441', // darktext
                      marginBottom: '0.5rem'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="6,7,8,9 numbers only"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${validationErrors.phone ? '#ff4444' : '#4DB6AC'}`, // mint
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                      }}
                      maxLength="10"
                      onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                      onBlur={(e) => {
                        if (!validationErrors.phone) {
                          e.target.style.borderColor = '#4DB6AC'; // mint
                        }
                      }}
                    />
                    {renderErrorMessage('phone')}
                  </div>
                </div>

                {/* Street Address - Full Width */}
                <div id="address-street">
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#124441', // darktext
                    marginBottom: '0.5rem'
                  }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${validationErrors.street ? '#ff4444' : '#4DB6AC'}`, // mint
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                    onBlur={(e) => {
                      if (!validationErrors.street) {
                        e.target.style.borderColor = '#4DB6AC'; // mint
                      }
                    }}
                  />
                  {renderErrorMessage('street')}
                </div>

                {/* Landmark - Full Width */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#124441', // darktext
                    marginBottom: '0.5rem'
                  }}>
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter nearby landmark"
                    value={address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #4DB6AC', // mint
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                    onBlur={(e) => e.target.style.borderColor = '#4DB6AC'} // mint
                  />
                </div>

                {/* City & State - Same Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div id="address-city">
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#124441', // darktext
                      marginBottom: '0.5rem'
                    }}>
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${validationErrors.city ? '#ff4444' : '#4DB6AC'}`, // mint
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                      onBlur={(e) => {
                        if (!validationErrors.city) {
                          e.target.style.borderColor = '#4DB6AC'; // mint
                        }
                      }}
                    />
                    {renderErrorMessage('city')}
                  </div>
                  <div id="address-state">
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#124441', // darktext
                      marginBottom: '0.5rem'
                    }}>
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${validationErrors.state ? '#ff4444' : '#4DB6AC'}`, // mint
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                      onBlur={(e) => {
                        if (!validationErrors.state) {
                          e.target.style.borderColor = '#4DB6AC'; // mint
                        }
                      }}
                    />
                    {renderErrorMessage('state')}
                  </div>
                </div>

                {/* Pincode - Full Width */}
                <div id="address-pincode">
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#124441', // darktext
                    marginBottom: '0.5rem'
                  }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit numbers only"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${validationErrors.pincode ? '#ff4444' : '#4DB6AC'}`, // mint
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                    }}
                    maxLength="6"
                    onFocus={(e) => e.target.style.borderColor = '#009688'} // primary
                    onBlur={(e) => {
                      if (!validationErrors.pincode) {
                        e.target.style.borderColor = '#4DB6AC'; // mint
                      }
                    }}
                  />
                  {renderErrorMessage('pincode')}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '2px solid #E0F2F1', // softbg
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              backgroundColor: '#fafafa',
              borderBottomLeftRadius: '15px',
              borderBottomRightRadius: '15px'
            }}>
              <button
                onClick={closeAddressModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#009688', // primary
                  border: '2px solid #009688', // primary
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#009688'; // primary
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#009688'; // primary
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={paymentLoading}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: paymentLoading ? '#cccccc' : '#009688', // primary
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: paymentLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  boxShadow: paymentLoading ? 'none' : '0 2px 8px rgba(0, 150, 136, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!paymentLoading) {
                    e.target.style.backgroundColor = '#00796B';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 150, 136, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!paymentLoading) {
                    e.target.style.backgroundColor = '#009688';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 150, 136, 0.3)';
                  }
                }}
                type="button"
              >
                {paymentLoading ? '⏳ Processing...' : '💳 Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CartView;