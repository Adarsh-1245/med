// // DeliverySignup.js
// import React from 'react';
// import BaseSignup from './BaseSignup';

// const DeliverySignup = ({ onSignupSuccess }) => {
//   const userDetails = {
//     type: 'delivery',
//     label: 'Delivery Partner',
//     title: 'a Delivery Partner',
//     quote: 'Join our network of trusted delivery partners and earn competitive rates',
//     benefits: [
//       'Flexible working hours',
//       'Competitive commission rates',
//       'Real-time delivery tracking',
//       'Weekly payments',
//       'Insurance coverage'
//     ],
//     customFields: [
//       {
//         name: 'vehicleType',
//         label: 'Vehicle Type',
//         type: 'select',
//         placeholder: 'Select your vehicle type',
//         required: true,
//         options: [
//           { value: 'bike', label: 'Bike' },
//           { value: 'scooter', label: 'Scooter' },
//           { value: 'car', label: 'Car' },
//           { value: 'bicycle', label: 'Bicycle' },
//           { value: 'walking', label: 'Walking' }
//         ]
//       },
//       {
//         name: 'vehicleNumber',
//         label: 'Vehicle Registration Number',
//         type: 'text',
//         placeholder: 'Enter vehicle registration number',
//         required: true
//       },
//       {
//         name: 'idProof',
//         label: 'ID Proof Type',
//         type: 'select',
//         placeholder: 'Select ID proof',
//         required: true,
//         options: [
//           { value: 'aadhar', label: 'Aadhar Card' },
//           { value: 'pan', label: 'PAN Card' },
//           { value: 'driving-license', label: 'Driving License' },
//           { value: 'voter-id', label: 'Voter ID' },
//           { value: 'passport', label: 'Passport' }
//         ]
//       },
//       {
//         name: 'idNumber',
//         label: 'ID Proof Number',
//         type: 'text',
//         placeholder: 'Enter ID proof number',
//         required: true
//       },
//       {
//         name: 'availability',
//         label: 'Preferred Working Hours',
//         type: 'select',
//         placeholder: 'Select availability',
//         required: true,
//         options: [
//           { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
//           { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
//           { value: 'evening', label: 'Evening (6 PM - 12 AM)' },
//           { value: 'night', label: 'Night (12 AM - 6 AM)' },
//           { value: 'full-day', label: 'Full Day (Flexible)' }
//         ]
//       }
//     ],
//     fieldValidations: {
//       vehicleType: {
//         required: true,
//         message: 'Please select vehicle type'
//       },
//       vehicleNumber: {
//         required: true,
//         message: 'Vehicle number is required'
//       },
//       idProof: {
//         required: true,
//         message: 'Please select ID proof type'
//       },
//       idNumber: {
//         required: true,
//         message: 'ID proof number is required'
//       },
//       availability: {
//         required: true,
//         message: 'Please select availability'
//       }
//     }
//   };

//   return (
//     <BaseSignup 
//       userType="delivery"
//       userDetails={userDetails}
//       onSignupSuccess={onSignupSuccess}
//     />
//   );
// };

// export default DeliverySignup;





import React, { useState } from 'react';

const DeliverySignup = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Delivery specific fields
    aadharNumber: '',
    panNumber: '',
    vehicleNumber: '',
    drivingLicenseNumber: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    panNumber: '',
    vehicleNumber: '',
    drivingLicenseNumber: ''
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Delivery specific state
  const [currentStep, setCurrentStep] = useState(1);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [drivingLicenseFront, setDrivingLicenseFront] = useState(null);
  const [drivingLicenseBack, setDrivingLicenseBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [vehicleRC, setVehicleRC] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [aadharOtpSent, setAadharOtpSent] = useState(false);
  const [aadharOtp, setAadharOtp] = useState('');
  
  // Verification states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState({
    phone: false,
    email: false,
    aadhar: false
  });

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!name.trim()) return 'Full name is required';
    if (!nameRegex.test(name)) return 'Name should contain only alphabets and spaces (min 2 characters)';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    if (!aadhar.trim()) return 'Aadhar number is required';
    if (!aadharRegex.test(aadhar)) return 'Aadhar must be 12 digits';
    return '';
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!pan.trim()) return 'PAN number is required';
    if (!panRegex.test(pan)) return 'Invalid PAN format (e.g., ABCDE1234F)';
    return '';
  };

  const validateVehicleNumber = (vehicle) => {
    const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
    if (!vehicle.trim()) return 'Vehicle number is required';
    if (!vehicleRegex.test(vehicle)) return 'Invalid vehicle number format';
    return '';
  };

  const validateDrivingLicense = (license) => {
    if (!license.trim()) return 'Driving license number is required';
    if (license.length < 5) return 'Invalid driving license number';
    return '';
  };

  // Mock OTP generation
  const generateMockOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Phone verification handlers
  const sendPhoneOtp = async () => {
    if (!formData.phone || formErrors.phone) {
      setToastMessage('Please enter a valid phone number');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, phone: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockOtp = generateMockOtp();
    setPhoneOtp(mockOtp);
    setPhoneOtpSent(true);
    
    setToastMessage(`OTP ${mockOtp} sent to ${formData.phone} (Mock)`);
    setToastType('success');
    setShowToast(true);
    setVerificationLoading(prev => ({ ...prev, phone: false }));
    
    setTimeout(() => setShowToast(false), 4000);
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp) {
      setToastMessage('Please enter the OTP');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, phone: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (phoneOtp.length === 6) {
      setIsPhoneVerified(true);
      setToastMessage('Phone number verified successfully!');
      setToastType('success');
    } else {
      setToastMessage('Invalid OTP. Please try again.');
      setToastType('error');
    }
    
    setShowToast(true);
    setVerificationLoading(prev => ({ ...prev, phone: false }));
    setTimeout(() => setShowToast(false), 3000);
  };

  // Email verification handlers
  const sendEmailOtp = async () => {
    if (!formData.email || formErrors.email) {
      setToastMessage('Please enter a valid email address');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, email: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockOtp = generateMockOtp();
    setEmailOtp(mockOtp);
    setEmailOtpSent(true);
    
    setToastMessage(`OTP ${mockOtp} sent to ${formData.email} (Mock)`);
    setToastType('success');
    setShowToast(true);
    setVerificationLoading(prev => ({ ...prev, email: false }));
    
    setTimeout(() => setShowToast(false), 4000);
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) {
      setToastMessage('Please enter the OTP');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, email: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (emailOtp.length === 6) {
      setIsEmailVerified(true);
      setToastMessage('Email verified successfully!');
      setToastType('success');
    } else {
      setToastMessage('Invalid OTP. Please try again.');
      setToastType('error');
    }
    
    setShowToast(true);
    setVerificationLoading(prev => ({ ...prev, email: false }));
    setTimeout(() => setShowToast(false), 3000);
  };

  // Aadhar verification handlers
  const sendAadharOtp = async () => {
    if (!formData.aadharNumber || formErrors.aadharNumber) {
      setToastMessage('Please enter a valid Aadhar number');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, aadhar: true }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOtp = generateMockOtp();
    setAadharOtp(mockOtp);
    setAadharOtpSent(true);
    
    setToastMessage(`Aadhar OTP ${mockOtp} sent for verification (Mock)`);
    setToastType('success');
    setShowToast(true);
    setVerificationLoading(prev => ({ ...prev, aadhar: false }));
    
    setTimeout(() => setShowToast(false), 4000);
  };

  const verifyAadharOtp = async () => {
    if (!aadharOtp) {
      setToastMessage('Please enter the OTP');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setVerificationLoading(prev => ({ ...prev, aadhar: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (aadharOtp.length === 6) {
      setToastMessage('Aadhar verified successfully!');
      setToastType('success');
      setShowToast(true);
      setCurrentStep(3);
    } else {
      setToastMessage('Invalid OTP. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
    
    setVerificationLoading(prev => ({ ...prev, aadhar: false }));
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'fullName') {
      processedValue = value.replace(/[^A-Za-z\s]/g, '');
    } else if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'aadharNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (name === 'panNumber') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'vehicleNumber') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'fullName':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'password':
        if (value && !validatePassword(value)) {
          error = 'Password must be 8+ characters with uppercase, lowercase, number & special character';
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'aadharNumber':
        error = validateAadhar(value);
        break;
      case 'panNumber':
        error = validatePAN(value);
        break;
      case 'vehicleNumber':
        error = validateVehicleNumber(value);
        break;
      case 'drivingLicenseNumber':
        error = validateDrivingLicense(value);
        break;
      default:
        break;
    }

    setFormErrors({
      ...formErrors,
      [name]: error
    });
  };

  // File upload handlers
  const handleFileUpload = (fileType, file) => {
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      setToastMessage('Please upload a valid image (JPEG, JPG, PNG)');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (file.size > maxSize) {
      setToastMessage('File size should be less than 5MB');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    switch (fileType) {
      case 'aadharFront':
        setAadharFront(file);
        break;
      case 'aadharBack':
        setAadharBack(file);
        break;
      case 'drivingLicenseFront':
        setDrivingLicenseFront(file);
        break;
      case 'drivingLicenseBack':
        setDrivingLicenseBack(file);
        break;
      case 'panCard':
        setPanCard(file);
        break;
      case 'vehicleRC':
        setVehicleRC(file);
        break;
      case 'livePhoto':
        setLivePhoto(file);
        break;
      default:
        break;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const nameError = validateName(formData.fullName);
      const emailError = validateEmail(formData.email);
      const phoneError = validatePhone(formData.phone);
      const passwordError = formData.password && !validatePassword(formData.password) 
        ? 'Invalid password' : '';
      const confirmPasswordError = formData.confirmPassword && formData.password !== formData.confirmPassword 
        ? 'Passwords do not match' : '';

      const errors = {
        fullName: nameError,
        email: emailError,
        phone: phoneError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      };

      setFormErrors(errors);

      if (Object.values(errors).some(error => error !== '') || !agreeToTerms) {
        setToastMessage('Please fix all errors and agree to terms');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      if (!isPhoneVerified || !isEmailVerified) {
        setToastMessage('Please verify your phone and email before proceeding');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (currentStep === 2) {
      const aadharError = validateAadhar(formData.aadharNumber);
      const panError = validatePAN(formData.panNumber);
      
      setFormErrors(prev => ({
        ...prev,
        aadharNumber: aadharError,
        panNumber: panError
      }));

      if (aadharError || panError || !aadharFront || !aadharBack || !panCard) {
        setToastMessage('Please complete all Aadhar and PAN details');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 4) {
      setToastMessage('Please complete all verification steps');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsLoading(true);

    // Validate all fields
    const errors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: formData.password && !validatePassword(formData.password) ? 'Invalid password' : '',
      confirmPassword: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : '',
      aadharNumber: validateAadhar(formData.aadharNumber),
      panNumber: validatePAN(formData.panNumber),
      vehicleNumber: validateVehicleNumber(formData.vehicleNumber),
      drivingLicenseNumber: validateDrivingLicense(formData.drivingLicenseNumber)
    };

    setFormErrors(errors);

    if (Object.values(errors).some(error => error !== '') || !agreeToTerms) {
      setToastMessage('Please fix all errors and agree to terms');
      setToastType('error');
      setShowToast(true);
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Check if all documents are uploaded
    const requiredDocs = [aadharFront, aadharBack, drivingLicenseFront, drivingLicenseBack, panCard, vehicleRC, livePhoto];
    if (requiredDocs.some(doc => !doc)) {
      setToastMessage('Please upload all required documents');
      setToastType('error');
      setShowToast(true);
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const storedUsers = localStorage.getItem('registeredUsers');
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = existingUsers.find(user => 
      user.email === formData.email || user.phone === formData.phone
    );
    
    if (userExists) {
      setToastMessage('User already exists with this email or phone');
      setToastType('error');
      setShowToast(true);
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      userType: 'delivery', // Explicitly set user type
      createdAt: new Date().toISOString(),
      // Include delivery specific data
      aadharFront,
      aadharBack,
      drivingLicenseFront,
      drivingLicenseBack,
      panCard,
      vehicleRC,
      livePhoto,
      isPhoneVerified,
      isEmailVerified,
      verificationStatus: 'pending'
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    setToastMessage(`Account created! Welcome ${formData.fullName}`);
    setToastType('success');
    setShowToast(true);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      aadharNumber: '',
      panNumber: '',
      vehicleNumber: '',
      drivingLicenseNumber: ''
    });
    setFormErrors({});
    setAgreeToTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCurrentStep(1);
    setAadharFront(null);
    setAadharBack(null);
    setDrivingLicenseFront(null);
    setDrivingLicenseBack(null);
    setPanCard(null);
    setVehicleRC(null);
    setLivePhoto(null);
    setIsPhoneVerified(false);
    setIsEmailVerified(false);
    setAadharOtpSent(false);
    setAadharOtp('');
    setPhoneOtpSent(false);
    setPhoneOtp('');
    setEmailOtpSent(false);
    setEmailOtp('');

    setTimeout(() => {
      setShowToast(false);
      if (onSignupSuccess) {
        onSignupSuccess();
      }
    }, 2000);

    setIsLoading(false);
  };

  const passwordStrength = validatePassword(formData.password) ? 'strong' : 'weak';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // File upload component
  const FileUploadField = ({ label, file, onFileChange, required = false }) => (
    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
      <label style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: '500',
        color: '#124441',
        fontSize: '13px'
      }}>
        {label} {required && '*'}
      </label>
      <div style={{
        border: '2px dashed #4DB6AC',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: file ? '#E0F2F1' : '#FFFFFF',
        cursor: 'pointer',
        position: 'relative'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files[0])}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
        {file ? (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '12px', color: '#009688' }}>File uploaded</div>
            <div style={{ fontSize: '10px', color: '#4F6F6B' }}>{file.name}</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
            <div style={{ fontSize: '12px', color: '#4F6F6B' }}>Click to upload</div>
            <div style={{ fontSize: '10px', color: '#4DB6AC' }}>JPEG, PNG (Max 5MB)</div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter your full name"
          style={inputStyle(formErrors.fullName)}
        />
        {formErrors.fullName && <div style={errorStyle}>{formErrors.fullName}</div>}
      </div>

      {/* Email with OTP Verification */}
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Email Address</label>
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Enter your email"
            style={{
              ...inputStyle(formErrors.email),
              paddingRight: emailOtpSent ? '200px' : '120px',
              borderColor: isEmailVerified ? '#009688' : formErrors.email ? '#EF4444' : '#4DB6AC'
            }}
            disabled={isEmailVerified}
          />
          {!isEmailVerified ? (
            <button
              type="button"
              onClick={emailOtpSent ? null : sendEmailOtp}
              disabled={emailOtpSent || verificationLoading.email || !formData.email || formErrors.email}
              style={{
                position: 'absolute',
                right: emailOtpSent ? '100px' : '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: emailOtpSent ? '#4F6F6B' : '#009688',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (emailOtpSent || verificationLoading.email || !formData.email || formErrors.email) ? 'not-allowed' : 'pointer',
                opacity: (emailOtpSent || !formData.email || formErrors.email) ? 0.6 : 1
              }}
            >
              {verificationLoading.email ? 'Sending...' : emailOtpSent ? 'OTP Sent' : 'Send OTP'}
            </button>
          ) : (
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: '#009688',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}>
              Verified ✓
            </div>
          )}
        </div>
        {formErrors.email && <div style={errorStyle}>{formErrors.email}</div>}
        
        {/* Email OTP Input */}
        {emailOtpSent && !isEmailVerified && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                style={{...inputStyle(false), flex: 1}}
              />
              <button
                type="button"
                onClick={verifyEmailOtp}
                disabled={verificationLoading.email || !emailOtp || emailOtp.length !== 6}
                style={{
                  padding: '10px 16px',
                  fontSize: '12px',
                  backgroundColor: '#009688',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (verificationLoading.email || !emailOtp || emailOtp.length !== 6) ? 'not-allowed' : 'pointer',
                  opacity: (!emailOtp || emailOtp.length !== 6) ? 0.6 : 1
                }}
              >
                {verificationLoading.email ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#4F6F6B', marginTop: '4px' }}>
              Check your email for OTP (Mock: {emailOtp})
            </div>
          </div>
        )}
      </div>

      {/* Phone with OTP Verification */}
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Phone Number</label>
        <div style={{ position: 'relative' }}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Enter your 10-digit phone number"
            style={{
              ...inputStyle(formErrors.phone),
              paddingRight: phoneOtpSent ? '200px' : '120px',
              borderColor: isPhoneVerified ? '#009688' : formErrors.phone ? '#EF4444' : '#4DB6AC'
            }}
            disabled={isPhoneVerified}
          />
          {!isPhoneVerified ? (
            <button
              type="button"
              onClick={phoneOtpSent ? null : sendPhoneOtp}
              disabled={phoneOtpSent || verificationLoading.phone || !formData.phone || formErrors.phone}
              style={{
                position: 'absolute',
                right: phoneOtpSent ? '100px' : '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: phoneOtpSent ? '#4F6F6B' : '#009688',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (phoneOtpSent || verificationLoading.phone || !formData.phone || formErrors.phone) ? 'not-allowed' : 'pointer',
                opacity: (phoneOtpSent || !formData.phone || formErrors.phone) ? 0.6 : 1
              }}
            >
              {verificationLoading.phone ? 'Sending...' : phoneOtpSent ? 'OTP Sent' : 'Send OTP'}
            </button>
          ) : (
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: '#009688',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}>
              Verified ✓
            </div>
          )}
        </div>
        {formErrors.phone && <div style={errorStyle}>{formErrors.phone}</div>}
        
        {/* Phone OTP Input */}
        {phoneOtpSent && !isPhoneVerified && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                style={{...inputStyle(false), flex: 1}}
              />
              <button
                type="button"
                onClick={verifyPhoneOtp}
                disabled={verificationLoading.phone || !phoneOtp || phoneOtp.length !== 6}
                style={{
                  padding: '10px 16px',
                  fontSize: '12px',
                  backgroundColor: '#009688',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (verificationLoading.phone || !phoneOtp || phoneOtp.length !== 6) ? 'not-allowed' : 'pointer',
                  opacity: (!phoneOtp || phoneOtp.length !== 6) ? 0.6 : 1
                }}
              >
                {verificationLoading.phone ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#4F6F6B', marginTop: '4px' }}>
              Check your phone for OTP (Mock: {phoneOtp})
            </div>
          </div>
        )}
      </div>

      {/* Password Fields */}
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Create a strong password"
            style={{...inputStyle(formErrors.password), paddingRight: '45px'}}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={visibilityButtonStyle}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {formData.password && !formErrors.password && (
          <div style={passwordStrength === 'strong' ? successStyle : errorStyle}>
            {passwordStrength === 'strong' ? '✓ Strong password' : '✗ Weak password'}
          </div>
        )}
        {formErrors.password && <div style={errorStyle}>{formErrors.password}</div>}
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <label style={labelStyle}>Confirm Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Confirm your password"
            style={{...inputStyle(formErrors.confirmPassword), paddingRight: '45px'}}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            style={visibilityButtonStyle}
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {formErrors.confirmPassword && <div style={errorStyle}>{formErrors.confirmPassword}</div>}
      </div>

      {/* Verification Status */}
      {(isPhoneVerified || isEmailVerified) && (
        <div style={{
          backgroundColor: '#E0F2F1',
          border: '1px solid #009688',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#124441', marginBottom: '4px' }}>
            Verification Status:
          </div>
          <div style={{ fontSize: '11px', color: '#4F6F6B' }}>
            {isPhoneVerified && <div>✓ Phone Number Verified</div>}
            {isEmailVerified && <div>✓ Email Address Verified</div>}
            {(!isPhoneVerified || !isEmailVerified) && (
              <div>Please complete all verifications to proceed</div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Step 2: Aadhar & PAN Verification
  const renderStep2 = () => (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Aadhar Number</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Enter 12-digit Aadhar number"
            style={{
              ...inputStyle(formErrors.aadharNumber),
              paddingRight: aadharOtpSent ? '200px' : '120px'
            }}
          />
          <button
            type="button"
            onClick={aadharOtpSent ? null : sendAadharOtp}
            disabled={aadharOtpSent || verificationLoading.aadhar || !formData.aadharNumber || formErrors.aadharNumber}
            style={{
              position: 'absolute',
              right: aadharOtpSent ? '100px' : '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: aadharOtpSent ? '#4F6F6B' : '#009688',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (aadharOtpSent || verificationLoading.aadhar || !formData.aadharNumber || formErrors.aadharNumber) ? 'not-allowed' : 'pointer',
              opacity: (aadharOtpSent || !formData.aadharNumber || formErrors.aadharNumber) ? 0.6 : 1
            }}
          >
            {verificationLoading.aadhar ? 'Sending...' : aadharOtpSent ? 'OTP Sent' : 'Send OTP'}
          </button>
        </div>
        {formErrors.aadharNumber && <div style={errorStyle}>{formErrors.aadharNumber}</div>}
      </div>

      {aadharOtpSent && (
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={labelStyle}>Aadhar OTP</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={aadharOtp}
              onChange={(e) => setAadharOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              style={{...inputStyle(false), flex: 1}}
            />
            <button
              type="button"
              onClick={verifyAadharOtp}
              disabled={verificationLoading.aadhar || !aadharOtp || aadharOtp.length !== 6}
              style={{
                padding: '10px 16px',
                fontSize: '12px',
                backgroundColor: '#009688',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (verificationLoading.aadhar || !aadharOtp || aadharOtp.length !== 6) ? 'not-allowed' : 'pointer',
                opacity: (!aadharOtp || aadharOtp.length !== 6) ? 0.6 : 1
              }}
            >
              {verificationLoading.aadhar ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#4F6F6B', marginTop: '4px' }}>
            Aadhar OTP sent (Mock: {aadharOtp})
          </div>
        </div>
      )}

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>PAN Number</label>
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter PAN number (e.g., ABCDE1234F)"
          style={inputStyle(formErrors.panNumber)}
        />
        {formErrors.panNumber && <div style={errorStyle}>{formErrors.panNumber}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <FileUploadField
          label="Aadhar Front"
          file={aadharFront}
          onFileChange={(file) => handleFileUpload('aadharFront', file)}
          required
        />
        <FileUploadField
          label="Aadhar Back"
          file={aadharBack}
          onFileChange={(file) => handleFileUpload('aadharBack', file)}
          required
        />
      </div>

      <FileUploadField
        label="PAN Card"
        file={panCard}
        onFileChange={(file) => handleFileUpload('panCard', file)}
        required
      />
    </div>
  );

  // Step 3: Driving License & Vehicle Details
  const renderStep3 = () => (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Driving License Number</label>
        <input
          type="text"
          name="drivingLicenseNumber"
          value={formData.drivingLicenseNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter driving license number"
          style={inputStyle(formErrors.drivingLicenseNumber)}
        />
        {formErrors.drivingLicenseNumber && <div style={errorStyle}>{formErrors.drivingLicenseNumber}</div>}
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={labelStyle}>Vehicle Number</label>
        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Enter vehicle number (e.g., KA01AB1234)"
          style={inputStyle(formErrors.vehicleNumber)}
        />
        {formErrors.vehicleNumber && <div style={errorStyle}>{formErrors.vehicleNumber}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <FileUploadField
          label="Driving License Front"
          file={drivingLicenseFront}
          onFileChange={(file) => handleFileUpload('drivingLicenseFront', file)}
          required
        />
        <FileUploadField
          label="Driving License Back"
          file={drivingLicenseBack}
          onFileChange={(file) => handleFileUpload('drivingLicenseBack', file)}
          required
        />
      </div>

      <FileUploadField
        label="Vehicle RC"
        file={vehicleRC}
        onFileChange={(file) => handleFileUpload('vehicleRC', file)}
        required
      />
    </div>
  );

  // Step 4: Final Verification
  const renderStep4 = () => (
    <div>
      <FileUploadField
        label="Live Photo (Selfie)"
        file={livePhoto}
        onFileChange={(file) => handleFileUpload('livePhoto', file)}
        required
      />
      
      <div style={{
        backgroundColor: '#E0F2F1',
        border: '1px solid #009688',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
        <h4 style={{ margin: '0 0 8px 0', color: '#124441' }}>Verification Summary</h4>
        <div style={{ fontSize: '12px', color: '#4F6F6B', textAlign: 'left' }}>
          <div>✓ Basic Information: Completed</div>
          <div>✓ Phone & Email: Verified</div>
          <div>✓ Aadhar & PAN: Uploaded</div>
          <div>✓ Driving License: Uploaded</div>
          <div>✓ Vehicle Details: Provided</div>
          <div>{livePhoto ? '✓ Live Photo: Uploaded' : '✗ Live Photo: Pending'}</div>
        </div>
      </div>
    </div>
  );

  // Common styles
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    color: '#124441',
    fontSize: '13px'
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${hasError ? '#EF4444' : '#4DB6AC'}`,
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    color: '#124441',
    backgroundColor: '#FFFFFF'
  });

  const errorStyle = {
    marginTop: '4px',
    fontSize: '11px',
    color: '#EF4444',
    fontWeight: '500'
  };

  const successStyle = {
    marginTop: '4px',
    fontSize: '11px',
    color: '#009688',
    fontWeight: '500'
  };

  const visibilityButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4F6F6B',
    fontSize: '18px',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px'
  };

  return (
    <div style={containerStyle}>
      {showToast && (
        <div style={toastStyle(toastType)}>
          {toastType === 'success' ? '✅ ' : '❌ '}{toastMessage}
        </div>
      )}

      <div style={cardContainerStyle}>
        {/* Left Side - Updated Design */}
        <div style={leftSideStyle}>
          <div style={contentStyle}>
            <h2 style={titleStyle}>
              Join as a Delivery Partner
            </h2>
            
            <p style={quoteStyle}>
              Join our network of trusted delivery partners and earn competitive rates
            </p>
            
            {/* Progress Steps */}
            <div style={stepsContainerStyle}>
              <div style={stepStyle(currentStep >= 1)}>
                <div style={stepNumberStyle}>1</div>
                <div>
                  <div style={stepTitleStyle}>Personal Info</div>
                  <div style={stepSubtitleStyle}>Basic details & contact</div>
                </div>
              </div>
              
              <div style={stepDividerStyle}></div>
              
              <div style={stepStyle(currentStep >= 2)}>
                <div style={stepNumberStyle}>2</div>
                <div>
                  <div style={stepTitleStyle}>Security</div>
                  <div style={stepSubtitleStyle}>Aadhar & PAN verification</div>
                </div>
              </div>
              
              <div style={stepDividerStyle}></div>
              
              <div style={stepStyle(currentStep >= 3)}>
                <div style={stepNumberStyle}>3</div>
                <div>
                  <div style={stepTitleStyle}>Delivery Partner Details</div>
                  <div style={stepSubtitleStyle}>License & vehicle info</div>
                </div>
              </div>
            </div>
            
            {/* Benefits Section */}
            <div style={benefitsContainerStyle}>
              <h4 style={benefitsTitleStyle}>Benefits:</h4>
              <div style={benefitsListStyle}>
                <div style={benefitItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  <span>Flexible working hours</span>
                </div>
                <div style={benefitItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  <span>Competitive commission rates</span>
                </div>
                <div style={benefitItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  <span>Real-time delivery tracking</span>
                </div>
                <div style={benefitItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  <span>Weekly payments</span>
                </div>
                <div style={benefitItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  <span>Insurance coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div style={rightSideStyle}>
          <div style={headerStyle}>
            <h1 style={appNameStyle}>QUICKMED</h1>
            <h2 style={formTitleStyle}>
              Delivery Partner Registration (Step {currentStep}/4)
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </>

            {/* Terms and Conditions Checkbox */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={termsLabelStyle}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I agree to the{' '}
                  <a 
                    href="https://drive.google.com/file/d/1bZkQuNNdVootx27yQ0lMbIpqn83oIrYn/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a 
                    href="https://drive.google.com/file/d/1D3PHKle-WG-A9sJv2f4O2ZjBzoGaKLzo/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Navigation Buttons for Delivery */}
            <div style={navigationButtonsStyle}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={secondaryButtonStyle}
                >
                  ← Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={primaryButtonStyle}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{...primaryButtonStyle, opacity: isLoading ? 0.7 : 1}}
                >
                  {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>

          <div style={switchAuthStyle}>
            <p style={switchTextStyle}>
              Already have an account? <span 
                onClick={() => !isLoading && onSwitchToLogin()}
                style={switchLinkStyle}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  backgroundColor: '#E0F2F1',
  padding: '20px'
};

const toastStyle = (type) => ({
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: type === 'success' ? '#009688' : '#EF4444',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000,
  animation: 'slideInRight 0.3s ease-out',
  fontSize: '14px',
  fontWeight: '500'
});

const cardContainerStyle = {
  display: 'flex',
  width: '100%',
  maxWidth: '1200px',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  minHeight: '700px'
};

const leftSideStyle = {
  flex: 1,
  background: `linear-gradient(135deg, #009688 0%, #00796B 100%)`,
  color: 'white',
  padding: '50px 40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative'
};

const contentStyle = {
  textAlign: 'center'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '700',
  marginBottom: '16px',
  lineHeight: '1.3'
};

const quoteStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  opacity: 0.9,
  marginBottom: '40px',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

// Steps container
const stepsContainerStyle = {
  marginBottom: '40px',
  textAlign: 'left'
};

const stepStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
  opacity: isActive ? 1 : 0.7
});

const stepNumberStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'white',
  color: '#009688',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '16px',
  flexShrink: 0
};

const stepTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '4px'
};

const stepSubtitleStyle = {
  fontSize: '12px',
  opacity: 0.8
};

const stepDividerStyle = {
  height: '20px',
  width: '2px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  marginLeft: '18px',
  marginBottom: '8px'
};

// Benefits section
const benefitsContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'left'
};

const benefitsTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px',
  marginTop: 0
};

const benefitsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const benefitItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px'
};

const checkmarkStyle = {
  color: '#4DB6AC',
  fontWeight: 'bold',
  fontSize: '16px'
};

const rightSideStyle = {
  flex: 1,
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflowY: 'auto'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px'
};

const appNameStyle = {
  fontSize: '32px',
  fontWeight: '700',
  marginBottom: '8px',
  color: '#009688'
};

const formTitleStyle = {
  color: '#124441',
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '4px'
};

const termsLabelStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  color: '#124441'
};

const linkStyle = {
  color: '#009688',
  fontWeight: '500',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const navigationButtonsStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '20px'
};

const primaryButtonStyle = {
  flex: 1,
  padding: '14px',
  backgroundColor: '#009688',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 150, 136, 0.3)'
};

const secondaryButtonStyle = {
  flex: 1,
  padding: '14px',
  backgroundColor: 'transparent',
  color: '#009688',
  border: '2px solid #009688',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const switchAuthStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px'
};

const switchTextStyle = {
  color: '#4F6F6B',
  fontSize: '14px',
  textAlign: 'center',
  margin: 0
};

const switchLinkStyle = {
  color: '#009688',
  fontWeight: '600',
  cursor: 'pointer'
};

export default DeliverySignup;