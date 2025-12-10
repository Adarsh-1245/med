import React, { useState, useEffect, useRef } from 'react';
import './CartView.css';

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
  
  // Tip states
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [tipAmount, setTipAmount] = useState(0); // Store actual tip amount
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const tipOptions = [
    { amount: 10, label: '₹10' },
    { amount: 20, label: '₹20' },
    { amount: 30, label: '₹30' },
    { amount: 50, label: '₹50' },
    { amount: 100, label: '₹100' },
    { amount: 0, label: 'Custom' }
  ];

  const modalRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initialize selected items when cart changes
  useEffect(() => {
    if (cart.length > 0 && selectedItems.length === 0) {
      // Initially select all items
      setSelectedItems(cart.map(item => item.id));
      setSelectAll(true);
    }
  }, [cart, selectedItems.length]);

  // Calculate tip amount whenever selectedTip or customTip changes
  useEffect(() => {
    let calculatedTip = 0;
    
    if (selectedTip > 0) {
      calculatedTip = selectedTip;
    } else if (customTip) {
      calculatedTip = parseInt(customTip) || 0;
    }
    
    setTipAmount(calculatedTip);
  }, [selectedTip, customTip]);

  // Enhanced back button handler
  const handleBackToMedicines = () => {
    setActiveView('medicine');
  };

  // Modal handlers
  const openAddressModal = () => {
    // Check if any items are selected
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    
    // Calculate current tip amount before opening modal
    let currentTip = 0;
    if (selectedTip > 0) {
      currentTip = selectedTip;
    } else if (customTip) {
      currentTip = parseInt(customTip) || 0;
    }
    setTipAmount(currentTip);
    
    setShowAddressModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setValidationErrors({});
    document.body.style.overflow = 'auto';
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAddressModal();
    }
  };

  const BackButton = ({ onClick, text = 'Back' }) => (
    <button 
      className="back-button"
      onClick={onClick}
      type="button"
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

  // Item selection functions
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        const newSelected = prev.filter(id => id !== itemId);
        setSelectAll(newSelected.length === cart.length);
        return newSelected;
      } else {
        const newSelected = [...prev, itemId];
        setSelectAll(newSelected.length === cart.length);
        return newSelected;
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Get selected cart items
  const getSelectedCartItems = () => {
    return cart.filter(item => selectedItems.includes(item.id));
  };

  // Get total price for selected items only
  const getSelectedTotalPrice = () => {
    const selected = getSelectedCartItems();
    return selected.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total with tip for selected items only
  const getTotalWithTip = () => {
    const subtotal = getSelectedTotalPrice();
    
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
      setTipAmount(amount);
    } else {
      setTipAmount(0);
    }
  };

  // Handle custom tip change
  const handleCustomTipChange = (value) => {
    const validatedValue = validateCustomTip(value);
    setCustomTip(validatedValue);
    
    if (validatedValue) {
      setSelectedTip(0);
      setTipAmount(parseInt(validatedValue) || 0);
    } else {
      setTipAmount(0);
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
    // Check if any items are selected
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    
    // Ensure tip amount is calculated before opening modal
    let currentTip = tipAmount;
    if (selectedTip === 0 && customTip) {
      currentTip = parseInt(customTip) || 0;
    }
    setTipAmount(currentTip);
    
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

    // Prepare checkout data with tip and selected items
    const totals = getTotalWithTip();
    
    // Create cart items array with selected items only
    const selectedCartItems = getSelectedCartItems();
    
    const checkoutData = {
      address,
      tip: totals.tip,
      subtotal: totals.subtotal,
      totalAmount: totals.total,
      selectedItems: selectedItems, // Pass selected item IDs
      cartItems: selectedCartItems, // Pass selected cart items for Razorpay
      tipDetails: {
        selectedTip,
        customTip,
        tipAmount: totals.tip
      }
    };

    console.log('Checkout data:', checkoutData); // For debugging

    // Close modal first
    closeAddressModal();

    // Proceed with payment
    try {
      await handleCheckoutConfirmation(checkoutData);
    } catch (error) {
      // Handle payment cancellation or error
      console.log('Payment was cancelled or failed:', error);
    }
  };

  // Helper function to render error message
  const renderErrorMessage = (field) => {
    if (validationErrors[field]) {
      return (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {validationErrors[field]}
        </div>
      );
    }
    return null;
  };

  // Get selection stats
  const getSelectionStats = () => {
    const selectedCount = selectedItems.length;
    const totalCount = cart.length;
    const selectedTotal = getSelectedTotalPrice();
    
    return {
      selectedCount,
      totalCount,
      selectedTotal
    };
  };

  const stats = getSelectionStats();
  const totals = getTotalWithTip();

  return (
    <div className="cart-container">
      {/* Header Section - Compact */}
      <div className="cart-header">
        {/* Back Button - Left Edge */}
        <div className="back-button-container">
          <BackButton onClick={handleBackToMedicines} text="Back to Medicines" />
        </div>
        
        <div className="header-title-container">
          <h2 className="cart-title">Your Shopping Cart</h2>
        </div>
        
        {/* Cart Summary Stats - Compact */}
        {cart.length > 0 && (
          <div className="cart-stats">
            <div className="stat-box">
              <div className="stat-value">{stats.selectedCount}/{cart.length}</div>
              <div className="stat-label">✅ Selected</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">₹{formatIndianNumber(stats.selectedTotal)}</div>
              <div className="stat-label">💰 Selected Total</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content - Side by Side Layout */}
      <div className="cart-content">
        {cart.length === 0 ? (
          /* Empty Cart State - Compact */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3 className="empty-cart-title">Your cart is empty</h3>
            <p className="empty-cart-message">
              Looks like you haven't added any medicines to your cart yet.
            </p>
            <button 
              className="shop-now-btn"
              onClick={handleBackToMedicines}
              type="button"
            >
               Shop Medicines Now
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items Box - Left Side */}
            <div className="cart-items-container">
              <div className="cart-items-header">
                <div className="selection-header">
                  <h3 className="cart-items-title">🛒 Cart Items ({cart.length})</h3>
                  <div className="select-all-container">
                    <label className="select-all-label">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="select-all-checkbox"
                      />
                      <span className="select-all-text">
                        {selectAll ? 'Deselect All' : 'Select All'}
                      </span>
                    </label>
                    <span className="selection-count">
                      ({stats.selectedCount} selected)
                    </span>
                  </div>
                </div>
                <p className="cart-items-subtitle">Select items you want to checkout</p>
              </div>
              
              <div className="cart-items-list">
                {cart.map(item => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div key={item.id} className={`cart-item ${isSelected ? 'selected' : ''}`}>
                      {/* Selection Checkbox */}
                      <div className="item-selection">
                        <label className="selection-label">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="item-checkbox"
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      
                      <div className="item-info">
                        <h4 className="item-name">
                          {item.name}
                          {isSelected && <span className="selected-badge">✓ Selected</span>}
                        </h4>
                        <p className="item-vendor"> {item.vendor}</p>
                        <p className="item-price">₹{formatIndianNumber(item.price)} each</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="quantity-controls">
                        <button 
                          className={`quantity-btn ${item.quantity <= 1 ? 'disabled' : ''}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          type="button"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          className="quantity-btn increase"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="item-total">
                        ₹{formatIndianNumber(item.price * item.quantity)}
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Box - Right Side */}
            <div className="order-summary">
              <div className="summary-content">
                <h3 className="summary-title">💰 Order Summary</h3>
                
                {/* Selection Summary */}
                <div className="selection-summary">
                  <div className="selection-summary-header">
                    <span className="selection-summary-icon">📋</span>
                    <span className="selection-summary-title">Selected Items Summary</span>
                  </div>
                  <div className="selection-summary-content">
                    {getSelectedCartItems().map(item => (
                      <div key={item.id} className="selected-item-summary">
                        <span className="selected-item-name">{item.name}</span>
                        <span className="selected-item-qty">×{item.quantity}</span>
                        <span className="selected-item-price">
                          ₹{formatIndianNumber(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {stats.selectedCount === 0 && (
                      <div className="no-selection-message">
                        ⚠️ No items selected. Please select items to checkout.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tip Section - Always Visible */}
                <div className="tip-section">
                  <h4 className="tip-title">💝 Tip Your Delivery Agent (Optional)</h4>
                  
                  <p className="tip-subtitle">
                    Support your delivery agent with a small tip for their service
                  </p>
                  
                  {/* Tip Options */}
                  <div className="tip-options">
                    {tipOptions.map((tip) => (
                      <button
                        key={tip.amount}
                        className={`tip-option ${selectedTip === tip.amount ? 'selected' : ''}`}
                        onClick={() => handleTipSelect(tip.amount)}
                        type="button"
                        disabled={stats.selectedCount === 0}
                      >
                        <span className="tip-label">
                          {tip.label}
                        </span>
                        {tip.amount > 0 && (
                          <span className="tip-emoji">
                            👍
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Tip Input */}
                  {selectedTip === 0 && (
                    <div className="custom-tip">
                      <label className="custom-tip-label">
                        Enter Custom Tip Amount (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter amount"
                        value={customTip}
                        onChange={(e) => handleCustomTipChange(e.target.value)}
                        className="custom-tip-input"
                        maxLength="5"
                        disabled={stats.selectedCount === 0}
                      />
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span className="price-label">Selected Items Total:</span>
                    <span className="price-value">₹{formatIndianNumber(totals.subtotal)}</span>
                  </div>
                  
                  <div className="price-row">
                    <span className="price-label">Delivery Fee:</span>
                    <span className="price-free">🆓 Free</span>
                  </div>
                  
                  <div className="price-row">
                    <span className="price-label">Tax (GST):</span>
                    <span className="price-tax">₹0</span>
                  </div>
                  
                  {/* Tip Display */}
                  <div className="price-row">
                    <div className="tip-label-container">
                      <span className="price-label">Delivery Tip:</span>
                      <span className="tip-optional">
                        Optional
                      </span>
                    </div>
                    <span className={`tip-amount ${totals.tip > 0 ? 'has-tip' : ''}`}>
                      {totals.tip > 0 ? `₹${formatIndianNumber(totals.tip)}` : '₹0'}
                    </span>
                  </div>
                  
                  {/* Grand Total */}
                  <div className="grand-total">
                    <span className="total-label">Grand Total:</span>
                    <span className="total-value">
                      ₹{formatIndianNumber(totals.total)}
                    </span>
                  </div>
                  
                  {/* Tip Note */}
                  {totals.tip > 0 && (
                    <div className="tip-note">
                      💝 Thank you for supporting your delivery agent!
                    </div>
                  )}
                  
                  {/* Selection Note */}
                  {stats.selectedCount > 0 && stats.selectedCount < cart.length && (
                    <div className="selection-note">
                      📝 Note: {cart.length - stats.selectedCount} item(s) will remain in your cart
                    </div>
                  )}
                </div>
                
                {/* Checkout Button */}
                <button 
                  className={`checkout-btn ${paymentLoading ? 'loading' : ''} ${stats.selectedCount === 0 ? 'disabled' : ''}`}
                  onClick={handleCheckout}
                  disabled={paymentLoading || stats.selectedCount === 0}
                  type="button"
                >
                  {paymentLoading 
                    ? '⏳ Processing Payment...' 
                    : stats.selectedCount === 0
                    ? '⚠️ Select Items to Checkout'
                    : `🚀 Checkout ${stats.selectedCount} Item(s)`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Address Modal Popup */}
      {showAddressModal && (
        <div 
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <div 
            ref={modalRef}
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="modal-icon">📍</span>
                Delivery Address
              </h2>
              <button
                onClick={closeAddressModal}
                className="modal-close-btn"
                type="button"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p className="modal-instruction">
                Please enter your delivery details. All fields marked with * are required.
              </p>

              {/* Checkout Summary */}
              <div className="checkout-summary-modal">
                <h4 className="checkout-summary-title">📋 Order Summary ({stats.selectedCount} items)</h4>
                <div className="checkout-items-list">
                  {getSelectedCartItems().map(item => (
                    <div key={item.id} className="checkout-item">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-details">
                        {item.quantity} × ₹{formatIndianNumber(item.price)} = 
                        ₹{formatIndianNumber(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="checkout-total">
                  <span>Subtotal:</span>
                  <span>₹{formatIndianNumber(totals.subtotal)}</span>
                </div>
                <div className="checkout-total">
                  <span>Delivery Tip:</span>
                  <span>₹{formatIndianNumber(totals.tip)}</span>
                </div>
                <div className="checkout-total" style={{ borderTop: '2px solid #009688', fontWeight: '700' }}>
                  <span>Total to Pay:</span>
                  <span>₹{formatIndianNumber(totals.total)}</span>
                </div>
              </div>

              {/* Address Form */}
              <div className="address-form">
                {/* Full Name & Phone Number - Same Row */}
                <div className="form-row">
                  <div id="address-fullName" className="form-group">
                    <label className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className={`form-input ${validationErrors.fullName ? 'error' : ''}`}
                    />
                    {renderErrorMessage('fullName')}
                  </div>
                  <div id="address-phone" className="form-group">
                    <label className="form-label">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="6,7,8,9 numbers only"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                      maxLength="10"
                    />
                    {renderErrorMessage('phone')}
                  </div>
                </div>

                {/* Street Address - Full Width */}
                <div id="address-street" className="form-group">
                  <label className="form-label">
                    Street Address *
                  </label>
                    <input
                      type="text"
                      placeholder="Enter street address"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className={`form-input ${validationErrors.street ? 'error' : ''}`}
                    />
                    {renderErrorMessage('street')}
                </div>

                {/* Landmark - Full Width */}
                <div className="form-group">
                  <label className="form-label">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter nearby landmark"
                    value={address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* City & State - Same Row */}
                <div className="form-row">
                  <div id="address-city" className="form-group">
                    <label className="form-label">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className={`form-input ${validationErrors.city ? 'error' : ''}`}
                    />
                    {renderErrorMessage('city')}
                  </div>
                  <div id="address-state" className="form-group">
                    <label className="form-label">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className={`form-input ${validationErrors.state ? 'error' : ''}`}
                    />
                    {renderErrorMessage('state')}
                  </div>
                </div>

                {/* Pincode - Full Width */}
                <div id="address-pincode" className="form-group">
                  <label className="form-label">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit numbers only"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className={`form-input ${validationErrors.pincode ? 'error' : ''}`}
                    maxLength="6"
                  />
                  {renderErrorMessage('pincode')}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={closeAddressModal}
                className="modal-cancel-btn"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={paymentLoading}
                className={`modal-submit-btn ${paymentLoading ? 'loading' : ''}`}
                type="button"
              >
                {paymentLoading ? '⏳ Processing...' : `💳 Pay ₹${formatIndianNumber(totals.total)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;