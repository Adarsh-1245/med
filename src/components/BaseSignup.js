// BaseSignup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BaseSignup = ({ userType, userDetails, onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ...userDetails.extraFields
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Calculate total steps based on userDetails
  const totalSteps = userDetails.hasExtraStep ? 4 : 3;

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation - only alphabets and spaces
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name should contain only alphabets and spaces';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation - Indian mobile numbers starting with 6,7,8,9
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number starting with 6,7,8,9';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Custom field validations
    if (userDetails.extraFields) {
      Object.keys(userDetails.extraFields).forEach(field => {
        if (!formData[field] && userDetails.fieldValidations?.[field]?.required) {
          newErrors[field] = userDetails.fieldValidations[field].message;
        }
      });
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Full name - only allow alphabets and spaces
    if (name === 'fullName') {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } 
    // Phone number - format and validate
    else if (name === 'phone') {
      // Remove all non-digits
      let digits = value.replace(/\D/g, '');
      
      // Only allow numbers starting with 6,7,8,9
      if (digits.length > 0) {
        const firstDigit = digits[0];
        if (!['6', '7', '8', '9'].includes(firstDigit)) {
          // If first digit is not 6,7,8,9, don't update
          return;
        }
      }
      
      // Limit to 10 digits
      if (digits.length > 10) {
        digits = digits.substring(0, 10);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: digits
      }));
    }
    // For other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Navigate to next step if not on final step
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToastMessage('Please fix the errors in the form', 'error');
      return;
    }
    
    if (!acceptedTerms) {
      showToastMessage('Please accept the terms and conditions', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process extra step data if exists
      let finalUserData = { ...formData };
      if (userDetails.onExtraStepSubmit) {
        finalUserData = userDetails.onExtraStepSubmit(formData);
      }
      
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.find(user => 
        user.email.toLowerCase() === formData.email.toLowerCase() && 
        user.userType === userType
      );
      
      if (userExists) {
        showToastMessage('An account with this email already exists', 'error');
        setIsLoading(false);
        return;
      }
      
      // Create new user object
      const newUser = {
        id: Date.now(),
        ...finalUserData,
        userType: userType,
        createdAt: new Date().toISOString(),
        isVerified: false
      };
      
      // Save to localStorage
      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('recentSignupType', userType);
      
      showToastMessage(`Successfully registered as ${userDetails.label}!`, 'success');
      
      // Auto login after successful signup
      setTimeout(() => {
        const loginData = {
          email: newUser.email,
          password: newUser.password,
          userType: userType,
          fullName: newUser.fullName
        };
        
        localStorage.setItem('currentUser', JSON.stringify(loginData));
        
        if (onSignupSuccess) {
          onSignupSuccess(loginData);
        }
        
        navigate(`/${userType}/dashboard`);
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      showToastMessage('Registration failed. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBackToLogin = () => {
    navigate(`/login/${userType}`);
  };

  const handleBackToSelection = () => {
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      const step1Fields = ['fullName', 'email', 'phone'];
      const step1Errors = {};
      
      step1Fields.forEach(field => {
        if (!formData[field]) {
          step1Errors[field] = 'This field is required';
        }
      });
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        showToastMessage('Please fill in all required fields', 'error');
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Custom Eye Icon Components
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Personal Information</h3>
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name (alphabets only)"
                disabled={isLoading}
                className={errors.fullName ? 'error' : ''}
                maxLength={50}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              <div className="input-hint">
                Only alphabets and spaces allowed
              </div>
            </div>
            
            <div className="input-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                disabled={isLoading}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
              <div className="input-hint">
                We'll send a verification email to this address
              </div>
            </div>
            
            <div className="input-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                disabled={isLoading}
                className={errors.phone ? 'error' : ''}
                maxLength={10}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
              <div className="input-hint">
                10-digit Indian mobile number starting with 6,7,8,9
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Account Security</h3>
            <div className="input-group">
              <label>Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="password-hints">
                <span className={formData.password.length >= 6 ? 'valid' : ''}>
                  • At least 6 characters
                </span>
              </div>
            </div>
            
            <div className="input-group">
              <label>Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">{userDetails.label} Details</h3>
            {userDetails.customFields?.map((field, index) => (
              <div key={index} className="input-group">
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    disabled={isLoading}
                    rows={4}
                    className={errors[field.name] ? 'error' : ''}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={errors[field.name] ? 'error' : ''}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    disabled={isLoading}
                    className={errors[field.name] ? 'error' : ''}
                  />
                )}
                {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
              </div>
            ))}
            
            <div className="terms-section">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="terms-link">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>
        );
        
      case 4:
        // Extra step for specific user types (like hospital/pharmacy)
        return (
          <div className="step-content">
            <h3 className="step-title">Additional Information</h3>
            {userDetails.extraStepContent ? (
              userDetails.extraStepContent(formData, handleInputChange, errors)
            ) : (
              <p>No additional information required.</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Generate step labels based on user type
  const getStepLabels = () => {
    const labels = [
      { number: 1, label: 'Personal Info' },
      { number: 2, label: 'Security' },
      { number: 3, label: userDetails.label + ' Details' }
    ];
    
    if (userDetails.hasExtraStep) {
      labels.push({ number: 4, label: 'Additional Info' });
    }
    
    return labels;
  };

  const stepLabels = getStepLabels();

  return (
    <div className="signup-container">
      {/* Toast Message */}
      {showToast && (
        <div className={`toast-message ${toastType}`}>
          {toastType === 'success' ? '✅ ' : '❌ '}{toastMessage}
        </div>
      )}

      {/* Back Buttons */}
      <div className="back-buttons">
        <button 
          onClick={handleBackToHome}
          className="back-home-btn"
          disabled={isLoading}
        >
          ← Home
        </button>
        <button 
          onClick={handleBackToSelection}
          className="back-selection-btn"
          disabled={isLoading}
        >
          ← Change Role
        </button>
      </div>

      {/* Main Card Container */}
      <div className="main-card">
        {/* Left Side - User Info */}
        <div className="left-section">
          <div className="user-icon">
            {userDetails.icon}
          </div>
          
          <h2 className="user-title">
            Join as {userDetails.title}
          </h2>
          
          <p className="user-quote">
            {userDetails.quote}
          </p>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            {stepLabels.map((step) => (
              <div key={step.number} className="step-indicator">
                <div className={`step-circle ${currentStep === step.number ? 'active' : currentStep > step.number ? 'completed' : ''}`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className="step-label">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="benefits-list">
            <h4>Benefits:</h4>
            {userDetails.benefits?.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="right-section">
          <div className="form-header">
            <h1 className="app-title">QUICKMED</h1>
            <h2 className="signup-title">Create {userDetails.label} Account</h2>
            <p className="signup-subtitle">Step {currentStep} of {totalSteps}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isLoading}
                  className="nav-btn prev-btn"
                >
                  ← Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="nav-btn next-btn"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !acceptedTerms}
                  className="submit-btn"
                >
                  {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>

          <div className="login-section">
            <p>
              Already have an account?{' '}
              <span 
                onClick={() => !isLoading && handleBackToLogin()}
                className="login-link"
                role="button"
                tabIndex={0}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #E0F2F1 0%, #FFFFFF 50%, #E0F2F1 100%);
          padding: 65px;
          position: relative;
        }

        .back-buttons {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .back-home-btn, .back-selection-btn {
          padding: 10px 20px;
          background-color: #FFFFFF;
          color: #009688;
          border: 2px solid #009688;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .back-home-btn:hover:not(:disabled),
        .back-selection-btn:hover:not(:disabled) {
          background-color: #009688;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 150, 136, 0.3);
        }

        .back-home-btn:disabled,
        .back-selection-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .toast-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #009688;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
          font-size: 14px;
          font-weight: 500;
          max-width: 400px;
        }

        .toast-message.error {
          background-color: #F44336;
        }

        .main-card {
          display: flex;
          width: 100%;
          max-width: 1200px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-height: 650px;
        }

        /* Left Section */
        .left-section {
          flex: 1;
          background: linear-gradient(135deg, #009688 0%, #00796B 100%);
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        .user-icon {
          font-size: 60px;
          margin-bottom: 30px;
        }

        .user-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .user-quote {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 40px;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
        }

        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 5%;
          right: 5%;
          height: 2px;
          background-color: rgba(255,255,255,0.3);
          z-index: 1;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
          min-width: 80px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step-circle.active {
          background-color: #FFFFFF;
          color: #009688;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255,255,255,0.3);
        }

        .step-circle.completed {
          background-color: #4DB6AC;
          color: white;
        }

        .step-label {
          font-size: 12px;
          opacity: 0.9;
          text-align: center;
          max-width: 80px;
        }

        .benefits-list {
          text-align: left;
          background-color: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 10px;
        }

        .benefits-list h4 {
          margin: 0 0 15px 0;
          font-size: 18px;
          opacity: 0.9;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          opacity: 0.9;
        }

        .benefit-icon {
          color: #4DB6AC;
          font-weight: bold;
          font-size: 16px;
        }

        /* Right Section */
        .right-section {
          flex: 1.2;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .app-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #009688;
        }

        .signup-title {
          color: #124441;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .signup-subtitle {
          color: #4F6F6B;
          font-size: 14px;
          margin: 0;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          color: #124441;
          font-size: 18px;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #E0F2F1;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #124441;
          font-size: 14px;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #E0F2F1;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: all 0.2s ease;
          color: #124441;
          background-color: #FAFAFA;
          font-family: 'Inter', sans-serif;
        }

        /* Fix for password input to prevent eye icon overlap */
        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper input {
          padding-right: 50px !important; /* Extra padding for eye icon */
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #4F6F6B;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .password-toggle:hover:not(:disabled) {
          background-color: #E0F2F1;
          color: #009688;
          transform: translateY(-50%) scale(1.1);
        }

        .password-toggle:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: translateY(-50%);
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: #009688;
          box-shadow: 0 0 0 3px rgba(0, 150, 136, 0.1);
          background-color: #FFFFFF;
        }

        .input-group input.error,
        .input-group select.error,
        .input-group textarea.error {
          border-color: #F44336;
        }

        .input-group input:disabled,
        .input-group select:disabled,
        .input-group textarea:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background-color: #F5F5F5;
        }

        .error-message {
          color: #F44336;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .input-hint {
          color: #4F6F6B;
          font-size: 12px;
          margin-top: 4px;
          font-style: italic;
        }

        .password-hints {
          margin-top: 8px;
          font-size: 12px;
          color: #4F6F6B;
        }

        .password-hints .valid {
          color: #4DB6AC;
        }

        .terms-section {
          margin-top: 30px;
          padding: 20px;
          background-color: #F9F9F9;
          border-radius: 8px;
          border: 1px solid #E0F2F1;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          color: #124441;
          font-size: 14px;
          line-height: 1.5;
        }

        .terms-checkbox input {
          margin-top: 3px;
          accent-color: #009688;
        }

        .terms-link {
          color: #009688;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E0F2F1;
        }

        .nav-btn {
          padding: 12px 24px;
          border: 2px solid #009688;
          background-color: white;
          color: #009688;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover:not(:disabled) {
          background-color: #009688;
          color: white;
          transform: translateY(-2px);
        }

        .nav-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .next-btn {
          margin-left: auto;
        }

        .submit-btn {
          padding: 14px 30px;
          background-color: #009688;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #00796B;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 150, 136, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          animation: pulse 1.5s ease-in-out infinite;
          transform: none;
        }

        .login-section {
          margin-top: 30px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #E0F2F1;
        }

        .login-section p {
          color: #4F6F6B;
          font-size: 14px;
          margin: 0;
        }

        .login-link {
          color: #009688;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 2px 6px;
          border-radius: 4px;
          text-decoration: none;
          display: inline-block;
        }

        .login-link:hover {
          color: #00796B;
          background-color: #E0F2F1;
          transform: translateY(-1px);
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .main-card {
            max-width: 900px;
          }
          
          .progress-steps::before {
            left: 8%;
            right: 8%;
          }
        }

        @media (max-width: 768px) {
          .main-card {
            flex-direction: column;
            min-height: auto;
            margin-top: 80px;
            max-width: 500px;
          }

          .back-buttons {
            flex-direction: column;
            top: 10px;
            left: 10px;
          }

          .left-section {
            padding: 30px 20px;
            min-height: 300px;
          }

          .user-icon {
            font-size: 40px;
          }

          .user-title {
            font-size: 22px;
          }

          .user-quote {
            font-size: 14px;
          }

          .right-section {
            padding: 30px 20px;
          }

          .progress-steps {
            margin-bottom: 30px;
          }

          .step-circle {
            width: 35px;
            height: 35px;
            font-size: 14px;
          }

          .step-label {
            font-size: 10px;
          }

          .form-navigation {
            flex-direction: column;
            gap: 15px;
          }

          .nav-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .left-section {
            padding: 20px 15px;
            min-height: 250px;
          }

          .right-section {
            padding: 20px 15px;
          }

          .app-title {
            font-size: 28px;
          }

          .signup-title {
            font-size: 20px;
          }
          
          .progress-steps::before {
            left: 12%;
            right: 12%;
          }
          
          .step-label {
            font-size: 9px;
            max-width: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default BaseSignup;