import React from 'react';

const VendorProfile = ({
  userProfile,
  stock,
  orders,
  prescriptions,
  setShowNotificationsBellModal,
  setShowProfileModal,
  notifications
}) => {
  const mainContentStyle = {
    padding: '24px',
    minHeight: '100vh',
    '@media (max-width: 768px)': {
      padding: '16px'
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '15px'
    }
  };

  const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
      width: '100%',
      justifyContent: 'space-between'
    }
  };

  const notificationBellStyle = {
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const notificationBadgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#EF4444',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  };

  const greetingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0',
    '@media (max-width: 768px)': {
      fontSize: '24px'
    }
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: '14px'
    }
  };

  const primaryButtonStyle = {
    backgroundColor: '#7C2A62',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const profileContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const profileCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  };

  const profileHeaderStyle = {
    padding: '30px',
    backgroundColor: '#7C2A62',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      padding: '20px',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '20px'
    }
  };

  const profileAvatarSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  };

  const profileAvatarStyle = {
    fontSize: '60px',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    border: '3px solid rgba(255,255,255,0.3)'
  };

  const profileBasicInfoStyle = {
    flex: 1
  };

  const profileNameStyle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'white'
  };

  const profileStatusStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const statusOnlineStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)'
  };

  const profileContentStyle = {
    padding: '30px',
    '@media (max-width: 768px)': {
      padding: '20px'
    }
  };

  const profileSectionStyle = {
    marginBottom: '30px',
    paddingBottom: '25px',
    borderBottom: '1px solid #f3f4f6',
    '&:last-child': {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottom: 'none'
    }
  };

  const profileSectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 20px 0',
    paddingBottom: '10px',
    borderBottom: '2px solid #f3f4f6'
  };

  const profileInfoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  };

  const profileInfoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  };

  const profileInfoLabelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const profileInfoValueStyle = {
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: '1.4'
  };

  const statsGridSmallStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  };

  const miniStatCardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      borderColor: '#7C2A62'
    }
  };

  const miniStatIconStyle = {
    fontSize: '24px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7D9EB',
    borderRadius: '10px',
    flexShrink: 0
  };

  const miniStatContentStyle = {
    flex: 1
  };

  const miniStatNumberStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 4px 0'
  };

  const miniStatLabelStyle = {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px'
  };

  return (
    <div style={mainContentStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={greetingStyle}>Pharmacy Profile</h1>
          <p style={subtitleStyle}>Your pharmacy details and business information</p>
        </div>
        <div style={headerActionsStyle}>
          <button 
            style={notificationBellStyle}
            onClick={() => setShowNotificationsBellModal(true)}
          >
            🔔
            {notifications.length > 0 && (
              <span style={notificationBadgeStyle}>
                {notifications.length}
              </span>
            )}
          </button>
          <button 
            style={primaryButtonStyle}
            onClick={() => setShowProfileModal(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div style={profileContainerStyle}>
        <div style={profileCardStyle}>
          {/* Profile Header with Avatar */}
          <div style={profileHeaderStyle}>
            <div style={profileAvatarSectionStyle}>
              <div style={profileAvatarStyle}>👤</div>
              <div style={profileBasicInfoStyle}>
                <h2 style={profileNameStyle}>{userProfile.pharmacyName}</h2>
                <div style={profileStatusStyle}>
                  <span style={statusOnlineStyle}>🟢 Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div style={profileContentStyle}>
            {/* Business Information Section */}
            <div style={profileSectionStyle}>
              <h3 style={profileSectionTitleStyle}>Business Information</h3>
              <div style={profileInfoGridStyle}>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Owner Name</span>
                  <span style={profileInfoValueStyle}>{userProfile.fullName}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Email</span>
                  <span style={profileInfoValueStyle}>{userProfile.email}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Phone</span>
                  <span style={profileInfoValueStyle}>{userProfile.phone}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Business Hours</span>
                  <span style={profileInfoValueStyle}>{userProfile.openingTime} - {userProfile.closingTime}</span>
                </div>
              </div>
            </div>

            {/* Legal & Address Details Section */}
            <div style={profileSectionStyle}>
              <h3 style={profileSectionTitleStyle}>Legal & Address Details</h3>
              <div style={profileInfoGridStyle}>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>License Number</span>
                  <span style={profileInfoValueStyle}>{userProfile.licenseNumber}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>GST Number</span>
                  <span style={profileInfoValueStyle}>{userProfile.gstNumber}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Address</span>
                  <span style={profileInfoValueStyle}>{userProfile.address}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>City</span>
                  <span style={profileInfoValueStyle}>{userProfile.city}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>State</span>
                  <span style={profileInfoValueStyle}>{userProfile.state}</span>
                </div>
                <div style={profileInfoItemStyle}>
                  <span style={profileInfoLabelStyle}>Pincode</span>
                  <span style={profileInfoValueStyle}>{userProfile.pincode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;