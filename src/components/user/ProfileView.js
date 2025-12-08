import React, { useState, useEffect, useCallback } from 'react';
import { useProfile } from './ProfileContext';

const ProfileView = ({ setActiveView }) => {
  // Get profile and functions from ProfileContext
  const { profile, updateProfile, updateProfilePhoto, removeProfilePhoto } = useProfile();

  const [localProfile, setLocalProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    dateOfBirth: "",
    age: "",
    gender: "",
    profilePhoto: ""
  });

  const [localFormErrors, setLocalFormErrors] = useState({});
  const [localIsFormValid, setLocalIsFormValid] = useState(false);
  const [localIsFormTouched, setLocalIsFormTouched] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Enhanced navigation handler
  const handleBackToDashboard = () => {
    setActiveView("dashboard");
  };

  // Modal Styles with new color scheme
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 68, 65, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    },
    modal: {
      backgroundColor: '#FFFFFF',
      padding: '2rem',
      borderRadius: '12px',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(18, 68, 65, 0.2)',
      animation: 'slideUp 0.3s ease-out',
      border: '1px solid #E0F2F1'
    },
    modalIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    modalTitle: {
      color: '#009688',
      fontSize: '1.5rem',
      margin: '0 0 0.5rem 0',
      fontWeight: '700'
    },
    modalMessage: {
      color: '#4F6F6B',
      fontSize: '1rem',
      marginBottom: '1.5rem',
      lineHeight: '1.5'
    },
    modalButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '1rem'
    },
    primaryButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#009688',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)',
      minWidth: '120px'
    },
    secondaryButton: {
      padding: '0.75rem 2rem',
      backgroundColor: 'transparent',
      color: '#009688',
      border: '2px solid #009688',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      minWidth: '120px'
    },
    warningButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
      minWidth: '120px'
    }
  };

  // Add CSS animation for success message and modal
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
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
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Modal Functions
  const showModalPopup = (type, title, message, action = null) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => action);
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
    setModalType('');
    setModalTitle('');
    setModalMessage('');
    setModalAction(null);
  };

  // Get modal icon based on type
  const getModalIcon = () => {
    switch (modalType) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  // Get modal button style based on type
  const getModalButtonStyle = (isPrimary = true) => {
    switch (modalType) {
      case 'warning':
        return isPrimary ? modalStyles.warningButton : modalStyles.secondaryButton;
      default:
        return isPrimary ? modalStyles.primaryButton : modalStyles.secondaryButton;
    }
  };

  // Real-time profile sync from context - FIXED: Only update local state when profile changes
  useEffect(() => {
    if (!profile) return;
    
    console.log('Profile sync from context to ProfileView:', profile);
    
    // Parse fullName into firstName and lastName
    const fullName = profile.fullName || "";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    // Parse address into components
    const address = profile.address || "";
    let streetAddress = "";
    let apartment = "";
    
    if (address.includes(',')) {
      const addressParts = address.split(',');
      streetAddress = addressParts[0] || "";
      apartment = addressParts.length > 1 ? addressParts[1].trim() : "";
    } else {
      streetAddress = address;
    }
    
    setLocalProfile(prev => ({
      ...prev,
      firstName,
      lastName,
      email: profile.email || "",
      phone: profile.phone || "",
      streetAddress,
      apartment,
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
      country: profile.country || "India",
      dateOfBirth: profile.dateOfBirth || "",
      age: profile.age || "",
      gender: profile.gender || "",
      profilePhoto: profile.profilePhoto || ""
    }));
  }, [profile]);

  // Real-time age calculation
  useEffect(() => {
    if (!localProfile.dateOfBirth) return;

    const calculateAge = (birthDate) => {
      const dob = new Date(birthDate);
      const today = new Date();
      
      if (dob > today) {
        return "0";
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age > 0 ? age.toString() : "0";
    };

    const calculatedAge = calculateAge(localProfile.dateOfBirth);
    if (calculatedAge !== localProfile.age) {
      setLocalProfile(prev => ({ ...prev, age: calculatedAge }));
    }
  }, [localProfile.dateOfBirth, localProfile.age]);

  // Real-time validation
  const validateLocalForm = useCallback(() => {
    const errors = {};

    // First Name validation
    if (!localProfile.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (localProfile.firstName.trim().length < 2) {
      errors.firstName = "First name should be at least 2 characters long";
    } else if (!/^[A-Za-z]{2,}$/.test(localProfile.firstName)) {
      errors.firstName = "First name should contain only letters";
    }

    // Last Name validation (optional)
    if (localProfile.lastName && !/^[A-Za-z\s]{0,}$/.test(localProfile.lastName)) {
      errors.lastName = "Last name should contain only letters";
    }

    // Email validation
    if (!localProfile.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localProfile.email)) {
      errors.email = "Enter a valid email address";
    }

    // Phone validation
    if (!localProfile.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(localProfile.phone)) {
      errors.phone = "Enter a valid 10-digit number starting with 6-9";
    }

    // Street Address validation
    if (!localProfile.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    } else if (localProfile.streetAddress.trim().length < 5) {
      errors.streetAddress = "Street address should be at least 5 characters long";
    }

    // City validation
    if (!localProfile.city.trim()) {
      errors.city = "City is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(localProfile.city)) {
      errors.city = "City should contain only letters and be at least 2 characters";
    }

    // State validation
    if (!localProfile.state.trim()) {
      errors.state = "State is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(localProfile.state)) {
      errors.state = "State should contain only letters and be at least 2 characters";
    }

    // Pincode validation
    if (!localProfile.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(localProfile.pincode)) {
      errors.pincode = "Pincode must be exactly 6 digits";
    }

    // Date of Birth validation
    if (!localProfile.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(localProfile.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    // Age validation
    if (!localProfile.age || parseInt(localProfile.age) <= 0) {
      errors.age = "Age must be a positive number";
    } else if (parseInt(localProfile.age) > 120) {
      errors.age = "Please enter a valid age";
    }

    // Gender validation
    if (!localProfile.gender) {
      errors.gender = "Please select your gender";
    }

    setLocalFormErrors(errors);
    setLocalIsFormValid(Object.keys(errors).length === 0);
  }, [localProfile]);

  // Real-time validation on every change
  useEffect(() => {
    validateLocalForm();
  }, [validateLocalForm]);

  // Real-time input handlers
  const handleLocalProfileChange = (e) => {
    if (!isEditMode) return;
    
    const { name, value } = e.target;
    let updatedValue = value;

    // Real-time input formatting and validation
    switch (name) {
      case "firstName":
      case "lastName":
        updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        break;
      case "city":
      case "state":
        updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        break;
      case "pincode":
        updatedValue = value.replace(/\D/g, "").slice(0, 6);
        break;
      case "phone":
        updatedValue = value.replace(/\D/g, "").slice(0, 10);
        break;
      default:
        break;
    }

    setLocalProfile(prev => ({ ...prev, [name]: updatedValue }));
    setLocalIsFormTouched(true);
    
    // Clear save status when user starts typing
    if (saveStatus) {
      setSaveStatus('');
    }
  };

  const handleLocalProfileBlur = (e) => {
    if (!isEditMode) return;
    
    const { name, value } = e.target;
    
    // Auto-trim on blur
    if (value && typeof value === 'string') {
      setLocalProfile(prev => ({ ...prev, [name]: value.trim() }));
    }
  };

  // Real-time profile photo handling
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Real-time file validation
    if (!file.type.startsWith('image/')) {
      showModalPopup('error', 'Invalid File', 'Please select a valid image file (JPG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showModalPopup('error', 'File Too Large', 'Image size should be less than 5MB');
      return;
    }

    try {
      setSaveStatus('🔄 Uploading photo...');
      
      const imgURL = URL.createObjectURL(file);
      
      // Update profile photo using context function
      await updateProfilePhoto(imgURL);
      
      // Update local state
      setLocalProfile(prev => ({ ...prev, profilePhoto: imgURL }));
      
      showModalPopup('success', 'Photo Updated', 'Your profile photo has been updated successfully!');
      setSaveStatus('');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showModalPopup('error', 'Upload Failed', 'Error uploading photo. Please try again.');
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setSaveStatus('🔄 Removing photo...');
      
      // Remove profile photo using context function
      await removeProfilePhoto();
      
      // Update local state
      setLocalProfile(prev => ({ ...prev, profilePhoto: "" }));
      
      showModalPopup('success', 'Photo Removed', 'Your profile photo has been removed successfully!');
      setSaveStatus('');
    } catch (error) {
      console.error('Error removing photo:', error);
      showModalPopup('error', 'Remove Failed', 'Error removing photo. Please try again.');
    }
  };

  // Enhanced edit mode handler
  const handleEditModeToggle = () => {
    setIsEditMode(true);
  };

  // Cancel Edit with modal confirmation
  const handleCancelEditWithModal = () => {
    if (localIsFormTouched) {
      showModalPopup(
        'warning',
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to cancel?',
        () => {
          handleCancelEdit();
          hideModal();
        }
      );
    } else {
      handleCancelEdit();
    }
  };

  // Cancel Edit implementation
  const handleCancelEdit = () => {
    if (!profile) return;
    
    // Parse fullName into firstName and lastName
    const fullName = profile.fullName || "";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    // Parse address into components
    const address = profile.address || "";
    let streetAddress = "";
    let apartment = "";
    
    if (address.includes(',')) {
      const addressParts = address.split(',');
      streetAddress = addressParts[0] || "";
      apartment = addressParts.length > 1 ? addressParts[1].trim() : "";
    } else {
      streetAddress = address;
    }

    setLocalProfile({
      firstName,
      lastName,
      email: profile.email || "",
      phone: profile.phone || "",
      streetAddress,
      apartment,
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
      country: profile.country || "India",
      dateOfBirth: profile.dateOfBirth || "",
      age: profile.age || "",
      gender: profile.gender || "",
      profilePhoto: profile.profilePhoto || ""
    });
    
    setLocalFormErrors({});
    setLocalIsFormTouched(false);
    setIsEditMode(false);
    setSaveStatus('');
  };

  // Real-time form submission - FIXED: Update context properly
  const handleLocalProfileUpdate = async (e) => {
    e.preventDefault();

    if (!isEditMode) {
      handleEditModeToggle();
      return;
    }

    // Final validation check
    validateLocalForm();
    if (!localIsFormValid) {
      showModalPopup(
        'error',
        'Validation Error',
        'Please fix all validation errors before submitting.',
        () => hideModal()
      );
      return;
    }

    setIsSubmitting(true);
    setSaveStatus('🔄 Saving profile changes...');

    try {
      // Combine name fields
      const fullName = `${localProfile.firstName} ${localProfile.lastName}`.trim();
      
      // Combine address fields
      const address = localProfile.apartment 
        ? `${localProfile.streetAddress}, ${localProfile.apartment}`
        : localProfile.streetAddress;

      // Create the updated profile data
      const updatedProfileData = {
        fullName: fullName,
        email: localProfile.email,
        phone: localProfile.phone,
        address: address,
        city: localProfile.city,
        state: localProfile.state,
        pincode: localProfile.pincode,
        country: localProfile.country,
        dateOfBirth: localProfile.dateOfBirth,
        age: localProfile.age,
        gender: localProfile.gender,
        lastUpdated: new Date().toISOString()
      };

      console.log('Updating profile with data:', updatedProfileData);
      
      // Call updateProfile from context - this will update both context and localStorage
      await updateProfile(updatedProfileData);
      
      // Show success modal
      showModalPopup(
        'success',
        'Profile Updated Successfully!',
        'Your profile information has been saved successfully.',
        () => {
          setLocalIsFormTouched(false);
          setIsEditMode(false);
          hideModal();
        }
      );
      
    } catch (error) {
      console.error('Profile update error:', error);
      showModalPopup(
        'error',
        'Update Failed',
        'Error updating profile. Please try again.',
        () => hideModal()
      );
    } finally {
      setIsSubmitting(false);
      setSaveStatus('');
    }
  };

  // Helper function to get input styles
  const getInputStyle = (fieldName) => {
    const baseStyle = {
      padding: '0.75rem',
      border: '2px solid #E0F2F1',
      borderRadius: '8px',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      cursor: 'text',
      fontFamily: 'inherit',
      backgroundColor: '#FFFFFF',
      color: '#124441'
    };
    const errorStyle = localIsFormTouched && localFormErrors[fieldName] ? {
      borderColor: '#FF6B6B !important',
      backgroundColor: '#FFF5F5',
    } : {};
    const disabledStyle = !isEditMode ? {
      backgroundColor: '#E0F2F1',
      color: '#4F6F6B',
      cursor: 'not-allowed',
      borderColor: '#4DB6AC',
    } : {};
    const focusStyle = isEditMode ? {
      borderColor: '#009688',
      boxShadow: '0 0 0 2px rgba(0, 150, 136, 0.1)',
      outline: 'none'
    } : {};
    
    return {
      ...baseStyle,
      ...errorStyle,
      ...disabledStyle,
      ...focusStyle,
      cursor: !isEditMode ? 'not-allowed' : 'text'
    };
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    const requiredFields = ['firstName', 'email', 'phone', 'streetAddress', 'city', 'state', 'pincode', 'dateOfBirth', 'gender'];
    return requiredFields.every(field => localProfile[field] && localProfile[field].trim());
  };

  // Get save status style
  const getSaveStatusStyle = () => {
    const baseStyle = {
      textAlign: 'center',
      padding: '0.75rem',
      marginTop: '0.75rem',
      borderRadius: '6px',
      fontWeight: '500',
      fontSize: '0.85rem',
    };
    
    if (saveStatus.includes('✅')) return { ...baseStyle, backgroundColor: '#E0F2F1', color: '#009688', border: '2px solid #4DB6AC' };
    if (saveStatus.includes('❌')) return { ...baseStyle, backgroundColor: '#FFE5E5', color: '#FF6B6B', border: '2px solid #FF6B6B' };
    if (saveStatus.includes('🔄')) return { ...baseStyle, backgroundColor: '#E0F2F1', color: '#009688', border: '2px solid #4DB6AC' };
    return baseStyle;
  };

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div style={modalStyles.overlay} onClick={hideModal}>
        <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={modalStyles.modalIcon}>{getModalIcon()}</div>
          <h3 style={modalStyles.modalTitle}>{modalTitle}</h3>
          <p style={modalStyles.modalMessage}>{modalMessage}</p>
          <div style={modalStyles.modalButtons}>
            {modalType === 'warning' ? (
              <>
                <button
                  style={getModalButtonStyle(true)}
                  onClick={() => {
                    if (modalAction) modalAction();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#cc0000';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FF6B6B';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Discard Changes
                </button>
                <button
                  style={getModalButtonStyle(false)}
                  onClick={hideModal}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#009688';
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#009688';
                  }}
                >
                  Continue Editing
                </button>
              </>
            ) : (
              <button
                style={getModalButtonStyle(true)}
                onClick={() => {
                  if (modalAction) {
                    modalAction();
                  } else {
                    hideModal();
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00796B';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#009688';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {modalType === 'success' ? 'Continue' : 'OK'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Profile-specific styles with new color scheme
  const styles = {
    profileContainer: {
      marginTop: '100px',
      padding: '2rem 1rem 1rem 1rem',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: '#E0F2F1',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      zIndex: 1,
    },
    pageHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      textAlign: 'center',
      position: 'relative',
    },
    backButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'transparent',
      marginTop: '1.5rem',
      color: '#009688',
      border: '2px solid #009688',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      alignSelf: 'flex-start',
      position: 'relative',
      zIndex: 2,
      marginBottom: '0.5rem',
      minWidth: '180px',
    },
    headerContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
    },
    sectionTitle: {
      color: '#124441',
      fontSize: '2rem',
      margin: 0,
      fontWeight: '800',
      background: 'linear-gradient(135deg, #009688, #4DB6AC)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    profileStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    statusComplete: {
      color: '#009688',
      fontWeight: '700',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#E0F2F1',
      borderRadius: '20px',
      border: '2px solid #4DB6AC',
    },
    statusIncomplete: {
      color: '#FF9800',
      fontWeight: '700',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#FFF3E0',
      borderRadius: '20px',
      border: '2px solid #FF9800',
    },
    profilePhotoSection: {
      backgroundColor: '#FFFFFF',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(18, 68, 65, 0.1)',
      marginBottom: '1.5rem',
      textAlign: 'center',
      border: '2px solid #E0F2F1',
    },
    profilePhotoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    profilePhotoPreview: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#E0F2F1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '3px solid #009688',
      boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)',
      position: 'relative',
    },
    profilePhotoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    profilePhotoPlaceholder: {
      fontSize: '3rem',
      color: '#009688',
      fontWeight: 'bold',
    },
    profilePhotoActions: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadPhotoButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4DB6AC',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 8px rgba(77, 182, 172, 0.3)',
    },
    removePhotoButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
    },
    editProfileButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#009688',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)',
      minWidth: '160px',
    },
    profileForm: {
      backgroundColor: '#FFFFFF',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(18, 68, 65, 0.1)',
      border: '2px solid #E0F2F1',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    formLabel: {
      marginBottom: '0.5rem',
      color: '#124441',
      fontWeight: '600',
      fontSize: '0.9rem',
    },
    formError: {
      color: '#FF6B6B',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
      fontWeight: '500',
    },
    formTextarea: {
      padding: '0.75rem',
      border: '2px solid #E0F2F1',
      borderRadius: '8px',
      fontSize: '0.9rem',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
      cursor: 'text',
      backgroundColor: '#FFFFFF',
      color: '#124441',
    },
    fieldNote: {
      color: '#4F6F6B',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
      fontStyle: 'italic',
    },
    phoneInputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%',
    },
    phonePrefix: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#E0F2F1',
      borderRadius: '8px',
      fontWeight: '600',
      color: '#009688',
      fontSize: '0.9rem',
      border: '2px solid #4DB6AC',
      minWidth: '100px',
      justifyContent: 'center',
      flexShrink: 0,
    },
    actionButtons: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #E0F2F1',
    },
    updateButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#009688',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)',
      minWidth: '160px',
    },
    updateButtonDisabled: {
      backgroundColor: '#B2DFDB',
      cursor: 'not-allowed',
      boxShadow: 'none',
      color: '#4F6F6B',
    },
    cancelButton: {
      padding: '0.75rem 2rem',
      backgroundColor: 'transparent',
      color: '#009688',
      border: '2px solid #009688',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      minWidth: '120px',
    },
  };

  return (
    <>
      <Modal />
      
      <div style={styles.profileContainer}>
        {/* Compact Header */}
        <div style={styles.pageHeader}>
          <button 
            style={styles.backButton} 
            onClick={handleBackToDashboard}
            aria-label="Back to dashboard"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#009688';
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#009688';
            }}
          >
            ← Back to Dashboard
          </button>
          <div style={styles.headerContent}>
            <h2 style={styles.sectionTitle}>My Profile</h2>
            {!isEditMode && (
              <div style={styles.profileStatus}>
                <span style={isProfileComplete() ? styles.statusComplete : styles.statusIncomplete}>
                  {isProfileComplete() ? '✅ Profile Complete' : '⚠ Profile Incomplete'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Photo Section - Compact */}
        <div style={styles.profilePhotoSection}>
          <div style={styles.profilePhotoContainer}>
            <div style={styles.profilePhotoPreview}>
              {localProfile.profilePhoto ? (
                <img
                  src={localProfile.profilePhoto}
                  alt="Profile"
                  style={styles.profilePhotoImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    handleRemovePhoto();
                  }}
                />
              ) : (
                <div style={styles.profilePhotoPlaceholder}>
                  {localProfile.firstName?.charAt(0).toUpperCase() || "👤"}
                </div>
              )}
            </div>

            <div style={styles.profilePhotoActions}>
              {!isEditMode ? (
                <button
                  style={styles.editProfileButton}
                  onClick={handleEditModeToggle}
                  type="button"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#00796B';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#009688';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <label style={styles.uploadPhotoButton}>
                     Update Photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {localProfile.profilePhoto && (
                    <button
                      style={styles.removePhotoButton}
                      type="button"
                      onClick={handleRemovePhoto}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#cc0000';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#FF6B6B';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Remove
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Status Display */}
        {saveStatus && (
          <div style={getSaveStatusStyle()}>
            {saveStatus}
          </div>
        )}

        {/* Profile Form - Compact */}
        <form onSubmit={handleLocalProfileUpdate} style={styles.profileForm}>
          <div style={styles.formGrid}>
            {/* Name Section */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={localProfile.firstName}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Enter your first name"
                style={getInputStyle("firstName")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.firstName && (
                <span style={styles.formError}>{localFormErrors.firstName}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={localProfile.lastName}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Enter your last name"
                style={getInputStyle("lastName")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.lastName && (
                <span style={styles.formError}>{localFormErrors.lastName}</span>
              )}
            </div>

            {/* Contact Information */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email *</label>
              <input
                type="email"
                name="email"
                value={localProfile.email}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Enter your email address"
                style={getInputStyle("email")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.email && (
                <span style={styles.formError}>{localFormErrors.email}</span>
              )}
            </div>

            {/* Phone Field - Extended container */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Phone *</label>
              <div style={styles.phoneInputContainer}>
                <div style={styles.phonePrefix}>🇮🇳 +91</div>
                <input
                  type="tel"
                  name="phone"
                  value={localProfile.phone}
                  onChange={handleLocalProfileChange}
                  onBlur={handleLocalProfileBlur}
                  style={getInputStyle("phone")}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  disabled={!isEditMode}
                  onFocus={(e) => e.target.style.borderColor = '#009688'}
                />
              </div>
              {localIsFormTouched && localFormErrors.phone && (
                <span style={styles.formError}>{localFormErrors.phone}</span>
              )}
            </div>

            {/* Personal Information */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={localProfile.dateOfBirth}
                onChange={handleLocalProfileChange}
                style={getInputStyle("dateOfBirth")}
                disabled={!isEditMode}
                max={new Date().toISOString().split('T')[0]}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.dateOfBirth && (
                <span style={styles.formError}>{localFormErrors.dateOfBirth}</span>
              )}
            </div>

            {/* Age Field (Read-only) */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Age *</label>
              <input
                type="text"
                name="age"
                value={localProfile.age ? `${localProfile.age} years` : ""}
                readOnly
                style={getInputStyle("age")}
              />
              <p style={styles.fieldNote}>Automatically calculated from date of birth</p>
            </div>

            {/* Gender Field */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Gender *</label>
              <select
                name="gender"
                value={localProfile.gender}
                onChange={handleLocalProfileChange}
                style={getInputStyle("gender")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {localIsFormTouched && localFormErrors.gender && (
                <span style={styles.formError}>{localFormErrors.gender}</span>
              )}
            </div>

            {/* Address Section */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Street Address *</label>
              <textarea
                name="streetAddress"
                rows="2"
                value={localProfile.streetAddress}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                style={getInputStyle("streetAddress")}
                disabled={!isEditMode}
                placeholder="House number, street name"
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.streetAddress && (
                <span style={styles.formError}>{localFormErrors.streetAddress}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Apartment/Building (Optional)</label>
              <input
                type="text"
                name="apartment"
                value={localProfile.apartment}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Apartment, suite, building"
                style={getInputStyle("apartment")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>City *</label>
              <input
                type="text"
                name="city"
                value={localProfile.city}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Enter your city"
                style={getInputStyle("city")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.city && (
                <span style={styles.formError}>{localFormErrors.city}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>State *</label>
              <input
                type="text"
                name="state"
                value={localProfile.state}
                onChange={handleLocalProfileChange}
                onBlur={handleLocalProfileBlur}
                placeholder="Enter your state"
                style={getInputStyle("state")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.state && (
                <span style={styles.formError}>{localFormErrors.state}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={localProfile.pincode}
                onChange={handleLocalProfileChange}
                placeholder="6-digit pincode"
                maxLength="6"
                style={getInputStyle("pincode")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
              {localIsFormTouched && localFormErrors.pincode && (
                <span style={styles.formError}>{localFormErrors.pincode}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Country</label>
              <input
                type="text"
                name="country"
                value={localProfile.country}
                onChange={handleLocalProfileChange}
                style={getInputStyle("country")}
                disabled={!isEditMode}
                onFocus={(e) => e.target.style.borderColor = '#009688'}
              />
            </div>
          </div>

          {/* Action Buttons - Compact */}
          {isEditMode && (
            <div style={styles.actionButtons}>
              <button
                type="submit"
                style={{
                  ...styles.updateButton,
                  ...(!localIsFormValid && styles.updateButtonDisabled),
                  ...(isSubmitting && styles.updateButtonDisabled)
                }}
                disabled={!localIsFormValid || isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting && localIsFormValid) {
                    e.target.style.backgroundColor = '#00796B';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && localIsFormValid) {
                    e.target.style.backgroundColor = '#009688';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? "🔄 Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancelEditWithModal}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#009688';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#009688';
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProfileView;