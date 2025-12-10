import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProfileContext = createContext();

// Default profile structure
const defaultProfile = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  dateOfBirth: '',
  age: '',
  gender: '',
  profilePhoto: '',
  userType: 'user',
  linkedAccounts: [],
  lastUpdated: '',
  // Enhanced health profile fields
  bloodGroup: 'Not specified',
  emergencyContact: '',
  healthMetrics: {
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: '',
    lastCheckup: ''
  },
  medicalHistory: {
    conditions: [],
    allergies: [],
    medications: [],
    surgeries: []
  },
  insurance: {
    provider: '',
    policyNumber: '',
    validity: ''
  },
  isActive: true,
  createdAt: ''
};

export const ProfileProvider = ({ children, user }) => {
  const [profile, setProfile] = useState(() => {
    try {
      // Load from localStorage first
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        console.log('Initializing profile from localStorage');
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      }
      
      // Then use user data from props (login data)
      if (user && user.email) {
        console.log('Initializing profile from user props:', user);
        const userProfile = {
          ...defaultProfile,
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          country: user.country || 'India',
          dateOfBirth: user.dateOfBirth || '',
          age: user.age || calculateAge(user.dateOfBirth) || '',
          gender: user.gender || '',
          profilePhoto: user.profilePhoto || '',
          userType: user.userType || 'user',
          linkedAccounts: user.linkedAccounts || [],
          lastUpdated: user.lastUpdated || new Date().toISOString(),
          // Enhanced health fields - SAFE ACCESS
          bloodGroup: user.bloodGroup || defaultProfile.bloodGroup,
          emergencyContact: user.emergencyContact || '',
          healthMetrics: {
            ...defaultProfile.healthMetrics,
            ...(user.healthMetrics || {})
          },
          medicalHistory: {
            ...defaultProfile.medicalHistory,
            ...(user.medicalHistory || {})
          },
          insurance: {
            ...defaultProfile.insurance,
            ...(user.insurance || {})
          },
          isActive: user.isActive !== undefined ? user.isActive : true,
          createdAt: user.createdAt || new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        // Also save a copy to user-specific storage
        if (user.phone) {
          localStorage.setItem(`userProfile_${user.phone}`, JSON.stringify(userProfile));
        }
        
        return userProfile;
      }
      
      // Fallback: default profile
      console.log('Initializing with default profile');
      return defaultProfile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return defaultProfile;
    }
  });

  // Enhanced health data management
  const [healthData, setHealthData] = useState({
    vitalHistory: [],
    medicationAdherence: {},
    labResults: [],
    appointmentHistory: []
  });

  // Sync profile to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('Saving profile to localStorage:', profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Also save a copy to user-specific storage
      if (profile?.phone) {
        localStorage.setItem(`userProfile_${profile.phone}`, JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  }, [profile]);

  // Update profile when user prop changes (login/logout) - FIXED
  useEffect(() => {
    if (user && user.email) {
      console.log('User data received in ProfileProvider - UPDATING PROFILE:', user);
      setProfile(prevProfile => {
        const updatedProfile = {
          ...prevProfile,
          ...user,
          lastUpdated: new Date().toISOString()
        };
        
        console.log('Profile updated from user data:', updatedProfile);
        return updatedProfile;
      });
    }
  }, [user]);

  // Helper function to calculate age from date of birth
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    
    try {
      const dob = new Date(birthDate);
      const today = new Date();
      
      // Set both dates to midnight to compare only dates
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dobMidnight = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      
      if (dobMidnight > todayMidnight) {
        return "0";
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age > 0 ? age.toString() : "0";
    } catch (error) {
      console.error('Error calculating age:', error);
      return '';
    }
  };

  // NEW: Function to set profile from signup data
  const setProfileFromSignup = (signupData) => {
    console.log('Setting profile from signup data:', signupData);
    
    // Parse the address from signup data
    const address = signupData.address || '';
    let city = '';
    let state = '';
    let pincode = '';
    
    // Try to extract city, state, pincode from address if possible
    if (address) {
      const addressParts = address.split(',');
      if (addressParts.length >= 3) {
        city = addressParts[addressParts.length - 3]?.trim() || '';
        state = addressParts[addressParts.length - 2]?.trim() || '';
        pincode = addressParts[addressParts.length - 1]?.trim() || '';
      }
    }
    
    const newProfile = {
      ...defaultProfile,
      fullName: signupData.fullName || '',
      email: signupData.email || '',
      phone: signupData.phone || '',
      address: address,
      city: signupData.city || city,
      state: signupData.state || state,
      pincode: signupData.pincode || pincode,
      country: signupData.country || 'India',
      dateOfBirth: signupData.dateOfBirth || '',
      age: calculateAge(signupData.dateOfBirth) || '',
      gender: signupData.gender || '',
      profilePhoto: signupData.profilePhoto || '',
      userType: signupData.userType || 'user',
      linkedAccounts: signupData.linkedAccounts || [],
      emergencyContact: signupData.emergencyContact || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      // Enhanced health fields
      bloodGroup: signupData.bloodGroup || defaultProfile.bloodGroup,
      healthMetrics: {
        ...defaultProfile.healthMetrics,
        ...(signupData.healthMetrics || {})
      },
      medicalHistory: {
        ...defaultProfile.medicalHistory,
        ...(signupData.medicalHistory || {})
      },
      insurance: {
        ...defaultProfile.insurance,
        ...(signupData.insurance || {})
      }
    };
    
    console.log('New profile created from signup:', newProfile);
    
    // Save to state
    setProfile(newProfile);
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    
    // Also save a copy to user-specific storage
    if (signupData.phone) {
      localStorage.setItem(`userProfile_${signupData.phone}`, JSON.stringify(newProfile));
    }
    
    return newProfile;
  };

  // Enhanced updateProfile function - FIXED: Merge properly with existing profile
  const updateProfile = (newProfileData) => {
    console.log('Updating profile with new data:', newProfileData);
    setProfile(prevProfile => {
      const updatedProfile = {
        ...prevProfile,
        ...newProfileData,
        lastUpdated: new Date().toISOString()
      };
      
      // Auto-calculate age if dateOfBirth is provided and changed
      if (newProfileData.dateOfBirth && newProfileData.dateOfBirth !== prevProfile.dateOfBirth) {
        const calculatedAge = calculateAge(newProfileData.dateOfBirth);
        updatedProfile.age = calculatedAge;
      }
      
      console.log('Final updated profile:', updatedProfile);
      return updatedProfile;
    });
  };

  const updateProfilePhoto = (photoUrl) => {
    console.log('Updating profile photo:', photoUrl);
    setProfile(prevProfile => ({
      ...prevProfile,
      profilePhoto: photoUrl,
      lastUpdated: new Date().toISOString()
    }));
  };

  const removeProfilePhoto = () => {
    console.log('Removing profile photo');
    setProfile(prevProfile => ({
      ...prevProfile,
      profilePhoto: '',
      lastUpdated: new Date().toISOString()
    }));
  };

  // Clear profile (for logout)
  const clearProfile = () => {
    console.log('Clearing profile data');
    localStorage.removeItem('userProfile');
    setProfile(defaultProfile);
    setHealthData({
      vitalHistory: [],
      medicationAdherence: {},
      labResults: [],
      appointmentHistory: []
    });
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode', 'dateOfBirth', 'gender'];
    return requiredFields.every(field => profile[field] && profile[field].toString().trim() !== '');
  };

  // Force immediate profile sync (useful after login)
  const forceProfileUpdate = (userData) => {
    console.log('Force updating profile:', userData);
    if (userData) {
      updateProfile(userData);
    }
  };

  // Load profile by phone number (useful for switching accounts)
  const loadProfileByPhone = (phone) => {
    try {
      const savedProfile = localStorage.getItem(`userProfile_${phone}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        localStorage.setItem('userProfile', JSON.stringify(parsedProfile));
        console.log('Profile loaded by phone:', phone);
        return parsedProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading profile by phone:', error);
      return null;
    }
  };

  const value = {
    profile,
    updateProfile,
    updateProfilePhoto,
    removeProfilePhoto,
    clearProfile,
    isProfileComplete,
    forceProfileUpdate,
    setProfileFromSignup, // NEW: Added signup function
    loadProfileByPhone,   // NEW: Added load by phone function
    // Health data functions
    healthData,
    setHealthData,
    // Additional utility functions
    getProfileCompletion: () => {
      const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode', 'dateOfBirth', 'gender'];
      const completedFields = requiredFields.filter(field => 
        profile[field] && profile[field].toString().trim() !== ''
      ).length;
      return Math.round((completedFields / requiredFields.length) * 100);
    },
    getMissingFields: () => {
      const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode', 'dateOfBirth', 'gender'];
      return requiredFields.filter(field => 
        !profile[field] || profile[field].toString().trim() === ''
      );
    },
    getAllProfiles: () => {
      // Get all saved profiles from localStorage
      const profiles = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('userProfile_')) {
          try {
            const profileData = JSON.parse(localStorage.getItem(key));
            profiles.push(profileData);
          } catch (error) {
            console.error(`Error parsing profile from key ${key}:`, error);
          }
        }
      }
      return profiles;
    }
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// PropTypes for better development experience
ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    fullName: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.string,
    country: PropTypes.string,
    dateOfBirth: PropTypes.string,
    age: PropTypes.string,
    gender: PropTypes.string,
    profilePhoto: PropTypes.string,
    userType: PropTypes.string,
    linkedAccounts: PropTypes.array,
    lastUpdated: PropTypes.string,
    bloodGroup: PropTypes.string,
    emergencyContact: PropTypes.string,
    healthMetrics: PropTypes.object,
    medicalHistory: PropTypes.object,
    insurance: PropTypes.object,
    isActive: PropTypes.bool,
    createdAt: PropTypes.string
  })
};

ProfileProvider.defaultProps = {
  user: null
};

export default ProfileContext;