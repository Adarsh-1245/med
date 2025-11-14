import React from 'react';
import UserDashboardComponents from './UserDashboardComponents';

// Pharmacy Store View with Quantity Controls
export const PharmacyStoreView = ({ 
  selectedPharmacy, 
  setShowPharmacyStore, 
  pharmacySearchQueries,
  handlePharmacySearch,
  getFilteredPharmacyMedicines,
  addToCartFromPharmacy,
  cart,
  pharmacyQuantities,
  handlePharmacyQuantityChange,
  handleAddToCartFromPharmacy
}) => {
  
  if (!selectedPharmacy) return null;

  const filteredMedicines = getFilteredPharmacyMedicines(selectedPharmacy);
  const searchQuery = pharmacySearchQueries[selectedPharmacy.id] || '';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <button
            onClick={() => setShowPharmacyStore(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0, color: '#7C2A62' }}>{selectedPharmacy.name}</h2>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {selectedPharmacy.distance} • {selectedPharmacy.deliveryTime} • ⭐ {selectedPharmacy.rating}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
        <input
          data-pharmacy-id={selectedPharmacy.id}
          type="text"
          placeholder="Search medicines in this pharmacy..."
          value={searchQuery}
          onChange={(e) => handlePharmacySearch(selectedPharmacy.id, e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Medicines List */}
      <div style={{ padding: '15px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>
          Available Medicines ({filteredMedicines.length} items)
        </h3>
        
        {filteredMedicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No medicines found matching your search.
          </div>
        ) : (
          <div>
            {filteredMedicines.map(medicine => (
              <div
                key={medicine.id}
                style={{
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {medicine.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: medicine.category === 'Prescription' ? '#e74c3c' : '#27ae60',
                      marginBottom: '5px'
                    }}>
                      {medicine.category}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#7C2A62' }}>
                      ₹{medicine.price}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      Stock: {medicine.stock} available
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #eee',
          padding: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            View Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </div>
          <button
            onClick={() => setShowPharmacyStore(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7C2A62',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Pharmacies
          </button>
        </div>
      )}
    </div>
  );
};

const UserDashboardViews = ({
  activeView,
  setActiveView,
  userProfile,
  cart,
  searchQuery,
  setSearchQuery,
  filteredMedicines,
  addToCart,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  handleCheckoutConfirmation,
  handlePrescriptionUpload,
  pharmacies,
  viewPharmacyStore,
  handlePharmacySearch,
  getFilteredPharmacyMedicines,
  addToCartFromPharmacy,
  doctorSearchQuery,
  setDoctorSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedExperience,
  setSelectedExperience,
  selectedLanguage,
  setSelectedLanguage,
  filteredDoctors,
  specialties,
  allTimeSlots,
  handleBookAppointment,
  startDoctorChat,
  appointments,
  appointmentFilter,
  setAppointmentFilter,
  filteredAppointments,
  rescheduleAppointment,
  cancelAppointment,
  viewAppointmentDetails,
  orders,
  orderFilter,
  setOrderFilter,
  filteredOrders,
  startLiveTracking,
  trackingOrder,
  deliveryPartner,
  callDeliveryPartner,
  getDeliveryStatusText,
  getDeliveryProgress,
  paymentLoading,
  updateProfile,
  triggerProfilePhotoUpload,
  removeProfilePhoto,
  styles,
  // New props for pharmacy quantities
  pharmacyQuantities,
  handlePharmacyQuantityChange,
  handleAddToCartFromPharmacy,
  // Pharmacy store props
  showPharmacyStore,
  setShowPharmacyStore,
  selectedPharmacy,
  pharmacySearchQueries
}) => {
  const {
    BackButton,
    MedicineCard,
    DoctorCard,
    NearbyPharmaciesSection,
    AppointmentsView,
    OrdersView,
    LiveTrackingView,
    ProfileView
  } = UserDashboardComponents;

  // Show Pharmacy Store View if active
  if (showPharmacyStore) {
    return (
      <PharmacyStoreView
        selectedPharmacy={selectedPharmacy}
        setShowPharmacyStore={setShowPharmacyStore}
        pharmacySearchQueries={pharmacySearchQueries}
        handlePharmacySearch={handlePharmacySearch}
        getFilteredPharmacyMedicines={getFilteredPharmacyMedicines}
        addToCartFromPharmacy={addToCartFromPharmacy}
        cart={cart}
        pharmacyQuantities={pharmacyQuantities}
        handlePharmacyQuantityChange={handlePharmacyQuantityChange}
        handleAddToCartFromPharmacy={handleAddToCartFromPharmacy}
      />
    );
  }

  if (activeView === 'dashboard') {
    return (
      <div style={styles.mainContent}>
        <section style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Welcome back, {userProfile.fullName || 'User'}! 👋
          </h2>
          <p style={styles.welcomeSubtitle}>
            How can we help you today?
          </p>
        </section>

        <section style={styles.servicesSection}>
          <div style={styles.serviceGrid}>
            <div 
              style={styles.serviceCard}
              onClick={() => setActiveView('medicine')}
            >
              <div style={styles.serviceIcon}>💊</div>
              <h3 style={styles.serviceTitle}>Medicine Delivery</h3>
              <p style={styles.serviceDescription}>
                Get your prescribed medicines delivered to your doorstep within hours
              </p>
              <button style={styles.serviceButton} type="button">
                Order Now
              </button>
            </div>

            <div 
              style={styles.serviceCard}
              onClick={() => setActiveView('consultation')}
            >
              <div style={styles.serviceIcon}>👨‍⚕️</div>
              <h3 style={styles.serviceTitle}>Doctor Consultation</h3>
              <p style={styles.serviceDescription}>
                Connect with certified doctors online for quick consultations
              </p>
              <button style={styles.serviceButton} type="button">
                Book Consultation
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (activeView === 'appointments') {
    return <AppointmentsView 
      setActiveView={setActiveView}
      appointments={appointments}
      appointmentFilter={appointmentFilter}
      setAppointmentFilter={setAppointmentFilter}
      filteredAppointments={filteredAppointments}
      rescheduleAppointment={rescheduleAppointment}
      cancelAppointment={cancelAppointment}
      viewAppointmentDetails={viewAppointmentDetails}
      styles={styles}
    />;
  }

  if (activeView === 'orders') {
    return <OrdersView 
      setActiveView={setActiveView}
      orders={orders}
      orderFilter={orderFilter}
      setOrderFilter={setOrderFilter}
      filteredOrders={filteredOrders}
      startLiveTracking={startLiveTracking}
      styles={styles}
    />;
  }

  if (activeView === 'medicine') {
    return (
      <div style={styles.medicineLayout}>
        <div style={styles.pageHeader}>
          <BackButton onClick={() => setActiveView('dashboard')} text="" styles={styles} />
          <h2 style={styles.sectionTitle}>Medicine Delivery</h2>
        </div>

        <div style={styles.fullWidthContent}>
          <section style={styles.searchSection}>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for medicines, vendors, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <label style={styles.prescriptionUploadLabel}>
                <span style={styles.uploadIcon}></span>
                Upload Prescription
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handlePrescriptionUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </section>

          <section style={styles.productsSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Available Medicines</h3>
              <p style={styles.resultsCount}>{filteredMedicines.length} products found</p>
            </div>
            <div style={styles.productsGrid}>
              {filteredMedicines.map(medicine => (
                <MedicineCard 
                  key={medicine.id} 
                  medicine={medicine}
                  cart={cart}
                  updateQuantity={updateQuantity}
                  addToCart={addToCart}
                  styles={styles}
                />
              ))}
            </div>
          </section>

          <NearbyPharmaciesSection 
            pharmacies={pharmacies}
            viewPharmacyStore={viewPharmacyStore}
            handlePharmacySearch={handlePharmacySearch}
            getFilteredPharmacyMedicines={getFilteredPharmacyMedicines}
            addToCartFromPharmacy={addToCartFromPharmacy}
            cart={cart}
            updateQuantity={updateQuantity}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'live-tracking') {
    return <LiveTrackingView 
      setActiveView={setActiveView}
      trackingOrder={trackingOrder}
      deliveryPartner={deliveryPartner}
      callDeliveryPartner={callDeliveryPartner}
      getDeliveryStatusText={getDeliveryStatusText}
      getDeliveryProgress={getDeliveryProgress}
      styles={styles}
    />;
  }

  if (activeView === 'cart') {
    return (
      <div style={styles.cartPageContainer}>
        <div style={styles.pageHeader}>
          <BackButton onClick={() => setActiveView('medicine')} text="Back to Medicines" styles={styles} />
          <h2 style={styles.sectionTitle}>Your Shopping Cart</h2>
        </div>
        
        <div style={styles.cartPageContent}>
          <div style={styles.cartItemsSection}>
            <div style={styles.cartHeader}>
              <h3 style={styles.cartTitle}>Cart Items ({cart.length})</h3>
              {cart.length > 0 && (
                <p style={styles.cartSubtitle}>Review your items before checkout</p>
              )}
            </div>
            
            <div style={styles.cartItems}>
              {cart.length === 0 ? (
                <div style={styles.emptyCart}>
                  <div style={styles.emptyCartIcon}>🛒</div>
                  <p style={styles.emptyCartText}>Your cart is empty</p>
                  <p style={styles.emptyCartSubtext}>Add some medicines to get started</p>
                  <button 
                    style={styles.shopNowButton}
                    onClick={() => setActiveView('medicine')}
                    type="button"
                  >
                    Shop Medicines
                  </button>
                </div>
              ) : (
                <div style={styles.cartItemsList}>
                  {cart.map(item => (
                    <div key={item.id} style={styles.cartItem}>
                      <div style={styles.cartItemInfo}>
                        <h4 style={styles.cartItemName}>{item.name}</h4>
                        <p style={styles.cartItemVendor}>{item.vendor}</p>
                        <p style={styles.cartItemPrice}>₹{item.price} each</p>
                      </div>
                      <div style={styles.quantityControls}>
                        <button 
                          style={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          −
                        </button>
                        <span style={styles.quantity}>{item.quantity}</span>
                        <button 
                          style={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <div style={styles.itemTotal}>
                        ₹{item.price * item.quantity}
                      </div>
                      <button 
                        style={styles.removeButton}
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {cart.length > 0 && (
            <div style={styles.cartSummarySection}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>
                <div style={styles.summaryDetails}>
                  <div style={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery Fee:</span>
                    <span style={styles.freeDelivery}>Free</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Tax:</span>
                    <span>₹0</span>
                  </div>
                  <div style={styles.grandTotal}>
                    <span>Total:</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                </div>
                <button 
                  style={styles.checkoutButtonLarge}
                  onClick={handleCheckoutConfirmation}
                  disabled={paymentLoading}
                  type="button"
                >
                  {paymentLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'profile') {
    return <ProfileView 
      setActiveView={setActiveView}
      userProfile={userProfile}
      updateProfile={updateProfile}
      triggerProfilePhotoUpload={triggerProfilePhotoUpload}
      removeProfilePhoto={removeProfilePhoto}
      styles={styles}
    />;
  }

  if (activeView === 'consultation') {
    return (
      <div style={styles.consultationContainer}>
        <div style={styles.pageHeader}>
          <BackButton onClick={() => setActiveView('appointments')} text="Back to Appointments" styles={styles} />
          <div style={styles.consultationHeader}>
            <h2 style={styles.sectionTitle}>Doctor Consultation</h2>
            <p style={styles.consultationSubtitle}>
              Connect with certified doctors for online consultations
            </p>
          </div>
        </div>

        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by specialty or doctor"
              value={doctorSearchQuery}
              onChange={(e) => setDoctorSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton} type="button">Search</button>
          </div>
        </div>

        <div style={styles.consultationLayout}>
          <div style={styles.filterPanel}>
            <h3 style={styles.filterTitle}>Filters</h3>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Specialty</label>
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Time Slot</label>
              <select 
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Time Slots</option>
                {allTimeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <button 
              style={styles.clearFiltersButton}
              onClick={() => {
                setSelectedSpecialty('');
                setSelectedTimeSlot('');
                setSelectedExperience('');
                setSelectedLanguage('');
              }}
              type="button"
            >
              Clear Filters
            </button>
          </div>

          <div style={styles.doctorsList}>
            <h3 style={styles.doctorsTitle}>Available Doctors</h3>
            
            {filteredDoctors.length === 0 ? (
              <div style={styles.noDoctors}>
                <p>No doctors found matching your criteria</p>
              </div>
            ) : (
              <div style={styles.doctorsGrid}>
                {filteredDoctors.map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor}
                    handleBookAppointment={handleBookAppointment}
                    startDoctorChat={startDoctorChat}
                    styles={styles}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <h2>Page not found</h2>
      <button onClick={() => setActiveView('dashboard')} type="button">Go to Home</button>
    </div>
  );
};

export default UserDashboardViews;