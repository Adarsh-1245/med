// BloodBankView.js
import React, { useState } from 'react';

const BloodBankView = ({ setActiveView, addNotification }) => {
  const [activeTab, setActiveTab] = useState('find');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [location, setLocation] = useState('Bangalore');
  const [donationHistory] = useState([
    {
      id: 'DON001',
      date: '2023-12-15',
      venue: 'City Blood Bank',
      units: 1,
      type: 'Whole Blood',
      status: 'Completed'
    },
    {
      id: 'DON002',
      date: '2023-06-20',
      venue: 'Red Cross Camp',
      units: 1,
      type: 'Whole Blood',
      status: 'Completed'
    }
  ]);

  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      patientName: 'Rahul Kumar',
      bloodGroup: 'B+',
      units: 2,
      hospital: 'City General Hospital',
      location: 'Bangalore',
      urgency: 'Critical',
      date: '2024-01-20',
      status: 'Active'
    },
    {
      id: 'REQ002',
      patientName: 'Priya Singh',
      bloodGroup: 'O-',
      units: 1,
      hospital: 'Medicare Center',
      location: 'Bangalore',
      urgency: 'High',
      date: '2024-01-19',
      status: 'Active'
    }
  ]);

  const bloodBanks = [
    {
      id: 1,
      name: 'City Blood Bank',
      address: '123 MG Road, Bangalore',
      distance: '1.5 km',
      rating: 4.5,
      availableGroups: ['A+', 'B+', 'O+', 'AB+', 'O-'],
      contact: '+91 80 23456789',
      timing: '24/7',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=120&fit=crop'
    },
    {
      id: 2,
      name: 'Red Cross Blood Center',
      address: '456 Brigade Road, Bangalore',
      distance: '2.3 km',
      rating: 4.7,
      availableGroups: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'],
      contact: '+91 80 23456790',
      timing: '8:00 AM - 8:00 PM',
      image: 'https://images.unsplash.com/photo-1516549655669-df6654e447e9?w=200&h=120&fit=crop'
    },
    {
      id: 3,
      name: 'Government Blood Bank',
      address: '789 Koramangala, Bangalore',
      distance: '3.1 km',
      rating: 4.2,
      availableGroups: ['A+', 'B+', 'O+', 'AB+'],
      contact: '+91 80 23456791',
      timing: '9:00 AM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=120&fit=crop'
    }
  ];

  const bloodCompatibility = {
    'O-': ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };

  const userProfile = {
    bloodGroup: 'O+',
    lastDonation: '2023-12-15',
    eligible: true,
    nextEligibleDate: '2024-03-15'
  };

  // BackButton Component
  const BackButton = ({ onClick, text = 'Back' }) => (
    <button 
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: '#009688',
        border: '1px solid #009688',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginRight: '1rem'
      }}
      onClick={onClick}
      type="button"
    >
      ← {text}
    </button>
  );

  const findDonors = () => {
    // Simulate API call to find donors
    addNotification('Searching', `Finding ${bloodGroup} blood donors near ${location}`, 'blood');
  };

  const requestBlood = () => {
    const newRequest = {
      id: `REQ${Date.now()}`,
      patientName: 'User',
      bloodGroup: bloodGroup,
      units: 1,
      hospital: 'Local Hospital',
      location: location,
      urgency: 'High',
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setRequests(prev => [newRequest, ...prev]);
    addNotification('Blood Requested', `Request for ${bloodGroup} blood submitted`, 'blood');
  };

  const scheduleDonation = (bloodBankId) => {
    const bloodBank = bloodBanks.find(bb => bb.id === bloodBankId);
    addNotification('Donation Scheduled', `Blood donation scheduled at ${bloodBank.name}`, 'blood');
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '130px',
      minHeight: 'calc(100vh - 120px)',
      width: '100%',
      boxSizing: 'border-box'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    titleSection: {
      textAlign: 'center',
      flex: 1
    },
    title: {
      color: '#009688',
      fontSize: '2rem',
      margin: '0 0 0.5rem 0',
      fontWeight: '700'
    },
    subtitle: {
      color: '#4F6F6B',
      margin: 0,
      fontSize: '1rem'
    },
    header: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      marginTop: '20px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    tab: {
      padding: '12px 24px',
      borderRadius: '25px',
      border: 'none',
      backgroundColor: '#E0F2F1',
      color: '#4F6F6B',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      backgroundColor: '#009688',
      color: '#FFFFFF'
    },
    contentSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    searchSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    select: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #E0F2F1',
      fontSize: '1rem',
      backgroundColor: '#FFFFFF'
    },
    button: {
      backgroundColor: '#009688',
      color: '#FFFFFF',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500'
    },
    bloodBankCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      border: '1px solid #E0F2F1',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-start'
    },
    bloodBankImage: {
      width: '100px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    bloodBankInfo: {
      flex: 1
    },
    bloodBankName: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#124441',
      marginBottom: '5px'
    },
    bloodBankAddress: {
      fontSize: '0.9rem',
      color: '#4F6F6B',
      marginBottom: '5px'
    },
    bloodBankDetails: {
      display: 'flex',
      gap: '15px',
      fontSize: '0.8rem',
      color: '#4F6F6B',
      marginBottom: '10px'
    },
    availableGroups: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
      marginBottom: '10px'
    },
    bloodGroupBadge: {
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      backgroundColor: '#E0F2F1',
      color: '#009688'
    },
    requestCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      borderLeft: '4px solid #ff6b6b'
    },
    urgencyCritical: {
      borderLeftColor: '#d32f2f'
    },
    urgencyHigh: {
      borderLeftColor: '#ff9800'
    },
    donorCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      border: '1px solid #E0F2F1',
      textAlign: 'center'
    },
    userProfile: {
      backgroundColor: '#E0F2F1',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    profileValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#009688',
      marginBottom: '5px'
    },
    profileLabel: {
      fontSize: '0.9rem',
      color: '#4F6F6B'
    }
  };

  const FindBloodTab = () => (
    <div style={styles.contentSection}>
      <h3 style={{ marginBottom: '20px', color: '#124441' }}>🔍 Find Blood</h3>
      <div style={styles.searchSection}>
        <select 
          style={styles.select}
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        
        <input
          type="text"
          placeholder="Enter location"
          style={styles.select}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        <button style={styles.button} onClick={findDonors}>
          Find Blood
        </button>
        
        <button style={{...styles.button, backgroundColor: '#ff6b6b'}} onClick={requestBlood}>
          Request Blood
        </button>
      </div>

      <div>
        <h4 style={{ marginBottom: '15px', color: '#124441' }}>Active Blood Requests</h4>
        {requests.filter(req => req.status === 'Active').map(request => (
          <div 
            key={request.id} 
            style={{
              ...styles.requestCard,
              ...(request.urgency === 'Critical' ? styles.urgencyCritical : styles.urgencyHigh)
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#124441' }}>{request.patientName}</div>
                <div style={{ fontSize: '0.9rem', color: '#4F6F6B' }}>
                  Needs {request.units} unit(s) of {request.bloodGroup}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4F6F6B' }}>
                  {request.hospital}, {request.location}
                </div>
              </div>
              <div style={{
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                backgroundColor: request.urgency === 'Critical' ? '#ffebee' : '#fff3e0',
                color: request.urgency === 'Critical' ? '#d32f2f' : '#f57c00'
              }}>
                {request.urgency}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              Posted: {request.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DonateTab = () => (
    <div style={styles.contentSection}>
      <div style={styles.userProfile}>
        <div style={styles.profileValue}>{userProfile.bloodGroup}</div>
        <div style={styles.profileLabel}>Your Blood Group</div>
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: userProfile.eligible ? '#4caf50' : '#ff9800' }}>
          {userProfile.eligible ? '✓ Eligible to donate' : `Next eligible from ${userProfile.nextEligibleDate}`}
        </div>
      </div>

      <h3 style={{ marginBottom: '20px', color: '#124441' }}>🏥 Nearby Blood Banks</h3>
      {bloodBanks.map(bank => (
        <div key={bank.id} style={styles.bloodBankCard}>
          <img src={bank.image} alt={bank.name} style={styles.bloodBankImage} />
          <div style={styles.bloodBankInfo}>
            <div style={styles.bloodBankName}>{bank.name}</div>
            <div style={styles.bloodBankAddress}>{bank.address}</div>
            <div style={styles.bloodBankDetails}>
              <span>⭐ {bank.rating}</span>
              <span>📍 {bank.distance}</span>
              <span>🕒 {bank.timing}</span>
            </div>
            <div style={styles.availableGroups}>
              {bank.availableGroups.map(group => (
                <span 
                  key={group} 
                  style={{
                    ...styles.bloodGroupBadge,
                    backgroundColor: group === userProfile.bloodGroup ? '#4DB6AC' : '#E0F2F1',
                    color: group === userProfile.bloodGroup ? '#FFFFFF' : '#009688'
                  }}
                >
                  {group}
                </span>
              ))}
            </div>
            <button 
              style={{...styles.button, fontSize: '0.8rem', padding: '8px 15px'}}
              onClick={() => scheduleDonation(bank.id)}
              disabled={!userProfile.eligible}
            >
              Schedule Donation
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const HistoryTab = () => (
    <div style={styles.contentSection}>
      <h3 style={{ marginBottom: '20px', color: '#124441' }}>📋 Donation History</h3>
      {donationHistory.map(donation => (
        <div key={donation.id} style={styles.donorCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#124441' }}>Donation #{donation.id}</div>
              <div style={{ fontSize: '0.9rem', color: '#4F6F6B' }}>{donation.venue}</div>
              <div style={{ fontSize: '0.8rem', color: '#4F6F6B' }}>{donation.date}</div>
            </div>
            <div style={{
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              backgroundColor: '#E0F2F1',
              color: '#009688'
            }}>
              {donation.status}
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#4F6F6B' }}>
            {donation.units} unit(s) of {donation.type}
          </div>
        </div>
      ))}
    </div>
  );

  const CompatibilityTab = () => (
    <div style={styles.contentSection}>
      <h3 style={{ marginBottom: '20px', color: '#124441' }}>🩸 Blood Group Compatibility</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {Object.entries(bloodCompatibility).map(([group, compatible]) => (
          <div key={group} style={styles.donorCard}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: group === userProfile.bloodGroup ? '#009688' : '#124441',
              marginBottom: '10px'
            }}>
              {group}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#4F6F6B', marginBottom: '10px' }}>
              Can donate to:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
              {compatible.map(bg => (
                <span 
                  key={bg}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    backgroundColor: bg === userProfile.bloodGroup ? '#4DB6AC' : '#E0F2F1',
                    color: bg === userProfile.bloodGroup ? '#FFFFFF' : '#009688'
                  }}
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header Row with Back Button */}
      <div style={styles.headerRow}>
        <BackButton onClick={() => setActiveView('dashboard')} text="Dashboard" />
        
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Blood Bank 🩸</h1>
          <p style={styles.subtitle}>Find blood donors, donate blood, save lives</p>
        </div>

        <div style={{ width: '140px' }}></div> {/* Empty div for spacing */}
      </div>

      <div style={styles.header}>
        <div style={styles.userProfile}>
          <div style={styles.profileValue}>{userProfile.bloodGroup}</div>
          <div style={styles.profileLabel}>Your Blood Group</div>
          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: userProfile.eligible ? '#4caf50' : '#ff9800' }}>
            {userProfile.eligible ? '✓ Eligible to donate' : `Next eligible from ${userProfile.nextEligibleDate}`}
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        {['find', 'donate', 'history', 'compatibility'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'find' && <FindBloodTab />}
      {activeTab === 'donate' && <DonateTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'compatibility' && <CompatibilityTab />}
    </div>
  );
};

export default BloodBankView;