import React, { useState, useEffect, useRef, useMemo } from 'react';

// Memoized Address Modal Component to prevent unnecessary re-renders
export const AddressModal = React.memo(({ 
  showAddressModal, 
  setShowAddressModal, 
  deliveryAddress, 
  handleAddressInputChange, 
  savedAddresses,
  selectedAddressId,
  selectSavedAddress,
  setDefaultAddress,
  deleteAddress,
  saveAddressToProfile,
  handleConfirmCheckout 
}) => {
  const [localAddress, setLocalAddress] = React.useState(deliveryAddress);
  const [isEditing, setIsEditing] = React.useState(false);

  // Use refs for input fields to maintain focus
  const inputRefs = {
    street: React.useRef(null),
    city: React.useRef(null),
    state: React.useRef(null),
    pincode: React.useRef(null),
    landmark: React.useRef(null)
  };

  // Update local address when deliveryAddress changes
  React.useEffect(() => {
    setLocalAddress(deliveryAddress);
  }, [deliveryAddress]);

  const handleLocalInputChange = (field, value) => {
    setLocalAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAddress = () => {
    // Update the parent component's state
    Object.keys(localAddress).forEach(key => {
      handleAddressInputChange(key, localAddress[key]);
    });
    
    if (!savedAddresses.find(addr => 
      addr.street === localAddress.street && 
      addr.pincode === localAddress.pincode
    )) {
      saveAddressToProfile(localAddress);
    }
    
    setIsEditing(false);
  };

  const handleProceed = () => {
    handleSaveAddress();
    handleConfirmCheckout();
  };

  const handleSelectSavedAddress = (addressId) => {
    selectSavedAddress(addressId);
    setIsEditing(false);
  };

  if (!showAddressModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#7C2A62' }}>Delivery Address</h2>
        
        {/* Saved Addresses */}
        {savedAddresses.length > 0 && !isEditing && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Select Saved Address</h3>
            {savedAddresses.map(address => (
              <div
                key={address.id}
                style={{
                  border: selectedAddressId === address.id ? '2px solid #7C2A62' : '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedAddressId === address.id ? '#f9f2f7' : 'white'
                }}
                onClick={() => handleSelectSavedAddress(address.id)}
              >
                <div style={{ fontWeight: 'bold' }}>
                  {address.street}
                  {address.isDefault && (
                    <span style={{ color: '#7C2A62', marginLeft: '10px', fontSize: '12px' }}>
                      (Default)
                    </span>
                  )}
                </div>
                <div>{address.city}, {address.state} - {address.pincode}</div>
                {address.landmark && <div>Landmark: {address.landmark}</div>}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {address.addressType}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultAddress(address.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7C2A62',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Set Default
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(address.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'none',
                border: '1px dashed #7C2A62',
                color: '#7C2A62',
                padding: '10px',
                borderRadius: '4px',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              + Add New Address
            </button>
          </div>
        )}

        {/* Address Form */}
        {(isEditing || savedAddresses.length === 0) && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Street Address *
              </label>
              <input
                ref={inputRefs.street}
                type="text"
                value={localAddress.street}
                onChange={(e) => handleLocalInputChange('street', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Enter street address"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                City *
              </label>
              <input
                ref={inputRefs.city}
                type="text"
                value={localAddress.city}
                onChange={(e) => handleLocalInputChange('city', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Enter city"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                State *
              </label>
              <input
                ref={inputRefs.state}
                type="text"
                value={localAddress.state}
                onChange={(e) => handleLocalInputChange('state', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Enter state"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Pincode *
              </label>
              <input
                ref={inputRefs.pincode}
                type="text"
                value={localAddress.pincode}
                onChange={(e) => handleLocalInputChange('pincode', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Enter pincode"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Landmark (Optional)
              </label>
              <input
                ref={inputRefs.landmark}
                type="text"
                value={localAddress.landmark}
                onChange={(e) => handleLocalInputChange('landmark', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Enter landmark"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Address Type:
              </label>
              <div>
                {['home', 'work', 'other'].map(type => (
                  <label key={type} style={{ marginRight: '15px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value={type}
                      checked={localAddress.addressType === type}
                      onChange={(e) => handleLocalInputChange('addressType', e.target.value)}
                      style={{ marginRight: '5px' }}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button
            onClick={() => {
              setShowAddressModal(false);
              setIsEditing(false);
            }}
            style={{
              padding: '10px 20px',
              border: '1px solid #7C2A62',
              backgroundColor: 'white',
              color: '#7C2A62',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={!localAddress.street || !localAddress.city || !localAddress.state || !localAddress.pincode}
            style={{
              padding: '10px 20px',
              backgroundColor: (!localAddress.street || !localAddress.city || !localAddress.state || !localAddress.pincode) ? '#ccc' : '#7C2A62',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!localAddress.street || !localAddress.city || !localAddress.state || !localAddress.pincode) ? 'not-allowed' : 'pointer',
              flex: 1
            }}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
});

const UserDashboardModals = ({
  showCheckoutConfirm,
  handleConfirmCheckout,
  handleCancelCheckout,
  getTotalPrice,
  cart,
  paymentLoading,
  showPrescriptionModal,
  setShowPrescriptionModal,
  prescriptionFile,
  prescriptionPreview,
  handlePrescriptionUpload,
  handlePrescriptionSubmit,
  setPrescriptionFile,
  setPrescriptionPreview,
  showPharmacyStore,
  setShowPharmacyStore,
  selectedPharmacy,
  handlePharmacySearch,
  getFilteredPharmacyMedicines,
  addToCartFromPharmacy,
  cart: globalCart,
  updateQuantity,
  setActiveView,
  showAppointmentDetails,
  setShowAppointmentDetails,
  selectedAppointment,
  showDoctorChat,
  setShowDoctorChat,
  activeDoctorChat,
  doctorChats,
  sendDoctorMessage,
  showLogoutConfirm,
  confirmLogout,
  cancelLogout,
  showProfilePhotoModal,
  setShowProfilePhotoModal,
  profilePhotoFile,
  profilePhotoPreview,
  handleProfilePhotoUpload,
  handleProfilePhotoSubmit,
  removeProfilePhoto,
  setProfilePhotoFile,
  setProfilePhotoPreview,
  profilePhotoInputRef,
  profile,
  updateProfile,
  userProfile,
  setUserProfile,
  styles,
  pharmacySearchQueries = {},
  // Address Management Props
  showAddressModal,
  setShowAddressModal,
  deliveryAddress,
  setDeliveryAddress,
  savedAddresses,
  selectedAddressId,
  handleAddressInputChange,
  selectSavedAddress,
  setDefaultAddress,
  deleteAddress,
  saveAddressToProfile,
  // Pharmacy Quantity Management Props
  pharmacyQuantities,
  handlePharmacyQuantityChange,
  handleAddToCartFromPharmacy
}) => {
  // Safe pharmacy search queries with fallback
  const safePharmacySearchQueries = pharmacySearchQueries || {};

  const CheckoutConfirmation = () => (
    <div style={styles?.modalOverlay || {}}>
      <div style={styles?.confirmationModal || {}}>
        <h3 style={styles?.confirmationTitle || {}}>Confirm Checkout</h3>
        <p style={styles?.confirmationText || {}}>
          You are about to proceed with your order. Total amount: <strong>₹{getTotalPrice?.() || 0}</strong>
        </p>
        
        <div style={styles?.confirmationItems || {}}>
          {(cart || []).map(item => (
            <div key={item?.id} style={styles?.confirmationItem || {}}>
              <span>{item?.name}</span>
              <span>₹{item?.price || 0} × {item?.quantity || 0}</span>
            </div>
          ))}
        </div>

        <div style={styles?.confirmationActions || {}}>
          <button 
            style={styles?.cancelButton || {}}
            onClick={handleCancelCheckout}
            disabled={paymentLoading}
            type="button"
          >
            Cancel
          </button>
          <button 
            style={styles?.confirmButton || {}}
            onClick={handleConfirmCheckout}
            disabled={paymentLoading}
            type="button"
          >
            {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );

  const PrescriptionUploadModal = () => (
    <div style={styles?.modalOverlay || {}}>
      <div style={styles?.prescriptionModal || {}}>
        <h3 style={styles?.modalTitle || {}}>Upload Prescription</h3>
        
        <div style={styles?.prescriptionPreview || {}}>
          {prescriptionPreview ? (
            <div style={styles?.prescriptionImageContainer || {}}>
              <img 
                src={prescriptionPreview} 
                alt="Prescription preview" 
                style={styles?.prescriptionImage || {}}
              />
              <div style={styles?.fileInfoOverlay || {}}>
                <span style={styles?.fileIcon || {}}>📄</span>
                <div>
                  <p style={styles?.fileName || {}}>{prescriptionFile?.name}</p>
                  <p style={styles?.fileSize || {}}>
                    {(prescriptionFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          ) : prescriptionFile ? (
            <div style={styles?.fileInfo || {}}>
              <span style={styles?.fileIcon || {}}>📄</span>
              <div>
                <p style={styles?.fileName || {}}>{prescriptionFile?.name}</p>
                <p style={styles?.fileSize || {}}>
                  {(prescriptionFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
              </div>
            </div>
          ) : (
            <div style={styles?.uploadPrompt || {}}>
              <div style={styles?.uploadIconLarge || {}}>📎</div>
              <p style={styles?.uploadText || {}}>No file selected</p>
              <p style={styles?.uploadSubtext || {}}>Supported formats: JPG, PNG, PDF (Max 5MB)</p>
            </div>
          )}
        </div>

        <div style={styles?.prescriptionRequirements || {}}>
          <h4 style={styles?.requirementsTitle || {}}>Prescription Requirements:</h4>
          <ul style={styles?.requirementsList || {}}>
            <li>Clear image of your doctor's prescription</li>
            <li>All text should be readable</li>
            <li>Doctor's signature and stamp should be visible</li>
            <li>Supported formats: JPG, PNG, PDF</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </div>

        <div style={styles?.modalActions || {}}>
          <label style={styles?.uploadButton || {}}>
            <span style={styles?.uploadIcon || {}}></span>
            {prescriptionFile ? 'Change File' : 'Choose File'}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handlePrescriptionUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            style={styles?.submitButton || {}}
            onClick={handlePrescriptionSubmit}
            disabled={!prescriptionFile}
            type="button"
          >
            Upload Prescription
          </button>
          <button 
            style={styles?.cancelButton || {}}
            onClick={() => {
              setShowPrescriptionModal?.(false);
              setPrescriptionFile?.(null);
              setPrescriptionPreview?.(null);
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const PharmacyStoreModal = () => {
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    // Safe filtered medicines with fallback - removed dependency array
    const filteredMedicines = useMemo(() => {
        if (!selectedPharmacy?.medicines) return [];
        
        const query = localSearchQuery.toLowerCase().trim();
        if (!query) return selectedPharmacy.medicines;
        
        return selectedPharmacy.medicines.filter(medicine =>
            medicine.name.toLowerCase().includes(query) ||
            medicine.category.toLowerCase().includes(query)
        );
    }, [localSearchQuery]); // Removed selectedPharmacy.medicines dependency

    // Prevent body scroll when modal is open and handle focus - removed dependency array
    useEffect(() => {
        if (showPharmacyStore) {
            document.body.style.overflow = 'hidden';
            // Auto-focus the search input when modal opens
            if (searchInputRef.current) {
                const timer = setTimeout(() => {
                    searchInputRef.current?.focus?.();
                }, 100);
                return () => clearTimeout(timer);
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); // Removed showPharmacyStore dependency

    // Initialize search query when pharmacy changes - removed dependency array
    useEffect(() => {
        if (selectedPharmacy?.id) {
            const savedQuery = safePharmacySearchQueries[selectedPharmacy.id] || '';
            setLocalSearchQuery(savedQuery);
        }
    }, []); // Removed selectedPharmacy.id dependency

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setLocalSearchQuery(query);
        // Also update the global state
        if (selectedPharmacy?.id) {
            handlePharmacySearch?.(selectedPharmacy.id, query);
        }
    };

    const clearSearch = () => {
        setLocalSearchQuery('');
        if (selectedPharmacy?.id) {
            handlePharmacySearch?.(selectedPharmacy.id, '');
        }
    };

    if (!showPharmacyStore || !selectedPharmacy) return null;

    return (
      <div style={{
          ...(styles?.modalOverlay || {}),
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
      }}>
        <div style={{
            ...(styles?.pharmacyStoreModal || {}),
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
          <div style={styles?.pharmacyStoreHeader || {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#F7D9EB',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    🏪
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ 
                        ...(styles?.modalTitle || {}),
                        margin: '0 0 0.25rem 0',
                        color: '#7C2A62',
                        fontSize: '1.5rem'
                    }}>{selectedPharmacy.name}</h3>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        fontSize: '0.9rem', 
                        color: '#666',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ⭐ {selectedPharmacy.rating}
                        </span>
                        <span>•</span>
                        <span>📍 {selectedPharmacy.distance} away</span>
                        <span>•</span>
                        <span>🚚 Delivery: {selectedPharmacy.deliveryTime}</span>
                    </div>
                </div>
            </div>
            <button 
              style={{
                  ...(styles?.closeModalButton || {}),
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#7C2A62',
                  padding: '0',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s ease'
              }}
              onClick={() => setShowPharmacyStore?.(false)}
              type="button"
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
          </div>
          
          <div style={styles?.pharmacyInfoSection || {}}>
            <div style={styles?.pharmacyDetailsSection || {}}>
              {/* Info moved to header */}
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div style={{
              ...(styles?.pharmacySearchSection || {}),
              padding: '1rem 0',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '1rem'
          }}>
            <div style={{
                ...(styles?.searchContainer || {}),
                position: 'relative',
                width: '100%'
            }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search medicines in this pharmacy..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                style={{
                    ...(styles?.pharmacySearchInput || {}),
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'text'
                }}
                data-pharmacy-id={selectedPharmacy.id}
              />
              {localSearchQuery && (
                <button
                  style={{
                      ...(styles?.clearSearchButton || {}),
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      color: '#666',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s ease'
                  }}
                  onClick={clearSearch}
                  type="button"
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {localSearchQuery && (
              <div style={styles?.searchResultsInfo || {}}>
                <p style={styles?.resultsCount || {}}>
                  Found {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} 
                  {filteredMedicines.length > 0 ? ` for "${localSearchQuery}"` : ''}
                </p>
              </div>
            )}
          </div>

          {/* Medicines Grid */}
          <div style={{
              ...(styles?.pharmacyMedicines || {}),
              flex: 1,
              overflowY: 'auto',
              paddingRight: '0.5rem'
          }}>
            <div style={styles?.medicinesHeader || {}}>
              <h4 style={styles?.medicinesTitle || {}}>
                {localSearchQuery ? 'Search Results' : 'Available Medicines'}
              </h4>
              <span style={styles?.medicinesCount || {}}>
                ({filteredMedicines.length} items)
              </span>
            </div>
            
            <div style={{
                ...(styles?.medicinesGrid || {}),
                display: 'grid',
                gap: '1rem'
            }}>
              {filteredMedicines.length === 0 ? (
                <div style={styles?.noMedicinesFound || {}}>
                  <div style={styles?.noResultsIcon || {}}>🔍</div>
                  <p style={styles?.noResultsText || {}}>
                    {localSearchQuery 
                      ? `No medicines found for "${localSearchQuery}"`
                      : 'No medicines available in this pharmacy'
                    }
                  </p>
                  {localSearchQuery && (
                    <p style={styles?.noResultsSuggestions || {}}>
                      Try searching with different keywords or check other pharmacies
                    </p>
                  )}
                </div>
              ) : (
                filteredMedicines.map(medicine => (
                  <div key={medicine.id} style={{
                      border: '1px solid #F7D9EB',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      transition: 'all 0.3s ease'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          flexWrap: 'wrap'
                      }}>
                        <h5 style={{
                            margin: 0,
                            color: '#7C2A62',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}>
                          {medicine.name}
                        </h5>
                        <span style={{
                            padding: '0.2rem 0.5rem',
                            backgroundColor: 
                              medicine.category === 'Prescription' ? '#ffebee' :
                              medicine.category === 'OTC' ? '#e8f5e8' :
                              medicine.category === 'Vitamins' ? '#fff3e0' :
                              medicine.category === 'Equipment' ? '#e3f2fd' : '#f5f5f5',
                            color: 
                              medicine.category === 'Prescription' ? '#c62828' :
                              medicine.category === 'OTC' ? '#2e7d32' :
                              medicine.category === 'Vitamins' ? '#ef6c00' :
                              medicine.category === 'Equipment' ? '#1565c0' : '#757575',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                        }}>
                          {medicine.category}
                        </span>
                      </div>
                      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap'
                      }}>
                        <span style={{
                            color: '#7C2A62',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}>
                          ₹{medicine.price}
                        </span>
                        <span style={{
                            color: medicine.stock > 5 ? '#4CAF50' : medicine.stock > 0 ? '#ff9800' : '#f44336',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                        }}>
                          {medicine.stock > 5 ? 'In Stock' : medicine.stock > 0 ? `Only ${medicine.stock} left` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handlePharmacyQuantityChange(medicine.id, -1)}
                          disabled={pharmacyQuantities[medicine.id] <= 0}
                          style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid #7C2A62',
                            backgroundColor: pharmacyQuantities[medicine.id] <= 0 ? '#f0f0f0' : 'white',
                            color: pharmacyQuantities[medicine.id] <= 0 ? '#999' : '#7C2A62',
                            borderRadius: '4px',
                            cursor: pharmacyQuantities[medicine.id] <= 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          –
                        </button>
                        
                        <span style={{ 
                          minWidth: '30px', 
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {pharmacyQuantities[medicine.id] || 0}
                        </span>
                        
                        <button
                          onClick={() => handlePharmacyQuantityChange(medicine.id, 1)}
                          disabled={(pharmacyQuantities[medicine.id] || 0) >= medicine.stock}
                          style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid #7C2A62',
                            backgroundColor: (pharmacyQuantities[medicine.id] || 0) >= medicine.stock ? '#f0f0f0' : 'white',
                            color: (pharmacyQuantities[medicine.id] || 0) >= medicine.stock ? '#999' : '#7C2A62',
                            borderRadius: '4px',
                            cursor: (pharmacyQuantities[medicine.id] || 0) >= medicine.stock ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCartFromPharmacy(medicine)}
                        disabled={(pharmacyQuantities[medicine.id] || 0) === 0}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: (pharmacyQuantities[medicine.id] || 0) === 0 ? '#f0f0f0' : '#7C2A62',
                          color: (pharmacyQuantities[medicine.id] || 0) === 0 ? '#999' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: (pharmacyQuantities[medicine.id] || 0) === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          minWidth: '100px'
                        }}
                      >
                        {pharmacyQuantities[medicine.id] > 0 ? `Add ${pharmacyQuantities[medicine.id]}` : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
              ...(styles?.pharmacyActions || {}),
              paddingTop: '1rem',
              borderTop: '1px solid #f0f0f0',
              marginTop: '1rem'
          }}>
            <div style={styles?.actionButtons || {}}>
              <button 
                style={{
                    ...(styles?.viewCartButton || {}),
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#7C2A62',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (!globalCart || globalCart.length === 0) ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    opacity: (!globalCart || globalCart.length === 0) ? 0.6 : 1
                }}
                onClick={() => {
                  setShowPharmacyStore?.(false);
                  setActiveView?.('cart');
                }}
                disabled={!globalCart || globalCart.length === 0}
                type="button"
                onMouseEnter={(e) => {
                    if (globalCart && globalCart.length > 0) {
                        e.target.style.backgroundColor = '#6a2352';
                    }
                }}
                onMouseLeave={(e) => {
                    if (globalCart && globalCart.length > 0) {
                        e.target.style.backgroundColor = '#7C2A62';
                    }
                }}
              >
                🛒 View Cart ({globalCart?.length || 0})
              </button>
              <button 
                style={{
                    ...(styles?.continueShoppingButton || {}),
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'transparent',
                    color: '#7C2A62',
                    border: '2px solid #7C2A62',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                }}
                onClick={() => setShowPharmacyStore?.(false)}
                type="button"
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#7C2A62';
                    e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#7C2A62';
                }}
              >
                ← Back to Pharmacies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AppointmentDetailsModal = () => (
    <div style={styles?.modalOverlay || {}}>
      <div style={styles?.appointmentDetailsModal || {}}>
        <div style={styles?.appointmentDetailsHeader || {}}>
          <h3 style={styles?.modalTitle || {}}>Appointment Details</h3>
          <button 
            style={styles?.closeModalButton || {}}
            onClick={() => setShowAppointmentDetails?.(false)}
            type="button"
          >
            ×
          </button>
        </div>

        <div style={styles?.appointmentDetailsContent || {}}>
          <div style={styles?.detailSection || {}}>
            <h4 style={styles?.detailSectionTitle || {}}>Basic Information</h4>
            <div style={styles?.detailGrid || {}}>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Appointment ID:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.id}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Doctor:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.doctorName}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Specialty:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.specialty}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Date & Time:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.date} at {selectedAppointment?.time}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Type:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.type}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Fee:</span>
                <span style={styles?.detailValue || {}}>₹{selectedAppointment?.fee}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Status:</span>
                <span style={{
                  ...(styles?.statusBadge || {}),
                  backgroundColor: 
                    selectedAppointment?.status === 'Scheduled' ? '#4CAF50' :
                    selectedAppointment?.status === 'Completed' ? '#2196F3' :
                    selectedAppointment?.status === 'Cancelled' ? '#FF6B6B' :
                    selectedAppointment?.status === 'Rescheduled' ? '#FF9800' :
                    selectedAppointment?.status === 'Pending' ? '#FFC107' : '#9E9E9E'
                }}>
                  {selectedAppointment?.status}
                </span>
              </div>
            </div>
          </div>

          <div style={styles?.detailSection || {}}>
            <h4 style={styles?.detailSectionTitle || {}}>Patient Details</h4>
            <div style={styles?.detailGrid || {}}>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Patient Name:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.details?.patientName}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Symptoms:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.details?.symptoms}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Notes:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.details?.notes}</span>
              </div>
              <div style={styles?.detailItem || {}}>
                <span style={styles?.detailLabel || {}}>Prescription:</span>
                <span style={styles?.detailValue || {}}>{selectedAppointment?.details?.prescription}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles?.appointmentDetailsActions || {}}>
          <button 
            style={styles?.closeDetailsButton || {}}
            onClick={() => setShowAppointmentDetails?.(false)}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const DoctorChatModal = () => {
    const [message, setMessage] = useState('');
    const chatEndRef = useRef(null);

    const activeDoctorId = activeDoctorChat?.id;
    
    // Memoize the current chat to prevent unnecessary recalculations - removed dependency array
    const currentChat = useMemo(() => {
      if (!activeDoctorId) return [];
      return doctorChats?.[activeDoctorId] || [];
    }, [activeDoctorId]); // Removed doctorChats dependency

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [currentChat]);

    const handleSendMessage = () => {
      if (!message.trim() || !activeDoctorChat?.id) return;
      sendDoctorMessage?.(activeDoctorChat.id, message);
      setMessage('');
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    if (!activeDoctorChat) return null;

    return (
      <div style={styles?.modalOverlay || {}}>
        <div style={styles?.doctorChatModal || {}}>
          <div style={styles?.doctorChatHeader || {}}>
            <div style={styles?.doctorChatInfo || {}}>
              <div style={styles?.doctorImageSmall || {}}>
                {activeDoctorChat?.image}
              </div>
              <div>
                <h3 style={styles?.doctorChatName || {}}>{activeDoctorChat?.name}</h3>
                <p style={styles?.doctorChatSpecialty || {}}>{activeDoctorChat?.specialty}</p>
              </div>
            </div>
            <div style={styles?.doctorChatActions || {}}>
              <button 
                style={styles?.closeModalButton || {}}
                onClick={() => setShowDoctorChat?.(false)}
                type="button"
              >
                ×
              </button>
            </div>
          </div>

          <div style={styles?.doctorChatMessages || {}}>
            {currentChat.map(chatMessage => (
              <div
                key={chatMessage.id}
                style={{
                  ...(styles?.chatMessage || {}),
                  ...(styles?.[`${chatMessage.sender}Message`] || {})
                }}
              >
                <div style={{
                  ...(styles?.messageBubble || {}),
                  ...(styles?.[`${chatMessage.sender}MessageBubble`] || {})
                }}>
                  {chatMessage.text}
                </div>
                <span style={styles?.messageTime || {}}>
                  {chatMessage.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={styles?.doctorChatInputContainer || {}}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to the doctor..."
              style={styles?.doctorChatInput || {}}
              autoFocus
            />
            <button 
              style={styles?.sendButton || {}}
              onClick={handleSendMessage}
              type="button"
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LogoutConfirmation = () => (
    <div style={styles?.modalOverlay || {}}>
      <div style={styles?.logoutConfirmationModal || {}}>
        <div style={styles?.logoutConfirmationIcon || {}}></div>
        <h3 style={styles?.logoutConfirmationTitle || {}}>Confirm Logout</h3>
        <p style={styles?.logoutConfirmationText || {}}>
          Are you sure you want to logout from your QuickMed account?
        </p>
        <div style={styles?.logoutConfirmationActions || {}}>
          <button 
            style={styles?.logoutCancelButton || {}}
            onClick={cancelLogout}
            type="button"
          >
            Cancel
          </button>
          <button 
            style={styles?.logoutConfirmButton || {}}
            onClick={confirmLogout}
            type="button"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );

  const ProfilePhotoModal = () => {
    // Safe access to profile data with fallbacks
    const currentProfilePhoto = profile?.profilePhoto || userProfile?.profilePhoto || null;
    const hasExistingPhoto = !!currentProfilePhoto;

    return (
      <div style={styles?.modalOverlay || {}}>
        <div style={styles?.profilePhotoModal || {}}>
          <div style={styles?.profilePhotoHeader || {}}>
            <h3 style={styles?.modalTitle || {}}>Update Profile Photo</h3>
            <button 
              style={styles?.closeModalButton || {}}
              onClick={() => {
                setShowProfilePhotoModal?.(false);
                setProfilePhotoFile?.(null);
                setProfilePhotoPreview?.(currentProfilePhoto);
              }}
              type="button"
            >
              ×
            </button>
          </div>
          
          <div style={styles?.profilePhotoPreviewSection || {}}>
            {profilePhotoPreview ? (
              <div style={styles?.profilePhotoImageContainer || {}}>
                <img 
                  src={profilePhotoPreview} 
                  alt="Profile preview" 
                  style={styles?.profilePhotoImage || {}}
                />
              </div>
            ) : currentProfilePhoto ? (
              <div style={styles?.profilePhotoImageContainer || {}}>
                <img 
                  src={currentProfilePhoto} 
                  alt="Current profile" 
                  style={styles?.profilePhotoImage || {}}
                />
                <div style={styles?.currentPhotoOverlay || {}}>
                  <p style={styles?.currentPhotoText || {}}>Current Photo</p>
                </div>
              </div>
            ) : (
              <div style={styles?.uploadPrompt || {}}>
                <div style={styles?.uploadIconLarge || {}}>👤</div>
                <p style={styles?.uploadText || {}}>No photo selected</p>
                <p style={styles?.uploadSubtext || {}}>Supported formats: JPG, PNG (Max 5MB)</p>
              </div>
            )}
          </div>

          <div style={styles?.profilePhotoRequirements || {}}>
            <h4 style={styles?.requirementsTitle || {}}>Photo Requirements:</h4>
            <ul style={styles?.requirementsList || {}}>
              <li>Clear, recent photo of yourself</li>
              <li>Face should be clearly visible</li>
              <li>Supported formats: JPG, PNG</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>

          <div style={styles?.modalActions || {}}>
            <label style={styles?.uploadButton || {}}>
              <span style={styles?.uploadIcon || {}}>📷</span>
              {profilePhotoFile ? 'Change Photo' : 'Choose Photo'}
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
            {hasExistingPhoto && (
              <button 
                style={styles?.removePhotoButton || {}}
                onClick={removeProfilePhoto}
                type="button"
              >
                Remove Current Photo
              </button>
            )}
            <button 
              style={styles?.submitButton || {}}
              onClick={handleProfilePhotoSubmit}
              disabled={!profilePhotoFile}
              type="button"
              >
              Update Profile Photo
            </button>
            <button 
              style={styles?.cancelButton || {}}
              onClick={() => {
                setShowProfilePhotoModal?.(false);
                setProfilePhotoFile?.(null);
                setProfilePhotoPreview?.(currentProfilePhoto);
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showAddressModal && (
        <AddressModal
          showAddressModal={showAddressModal}
          setShowAddressModal={setShowAddressModal}
          deliveryAddress={deliveryAddress}
          handleAddressInputChange={handleAddressInputChange}
          savedAddresses={savedAddresses}
          selectedAddressId={selectedAddressId}
          selectSavedAddress={selectSavedAddress}
          setDefaultAddress={setDefaultAddress}
          deleteAddress={deleteAddress}
          saveAddressToProfile={saveAddressToProfile}
          handleConfirmCheckout={handleConfirmCheckout}
        />
      )}
      {showCheckoutConfirm && <CheckoutConfirmation />}
      {showPrescriptionModal && <PrescriptionUploadModal />}
      {showPharmacyStore && <PharmacyStoreModal />}
      {showAppointmentDetails && <AppointmentDetailsModal />}
      {showDoctorChat && <DoctorChatModal />}
      {showLogoutConfirm && <LogoutConfirmation />}
      {showProfilePhotoModal && <ProfilePhotoModal />}
    </>
  );
};

export default UserDashboardModals;