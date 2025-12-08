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
  pincode: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  profilePhoto: null,
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
  }
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
          pincode: user.pincode || '',
          dateOfBirth: user.dateOfBirth || '',
          age: user.age || '',
          gender: user.gender || '',
          profilePhoto: user.profilePhoto || null,
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
          }
        };
        
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
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
        updatedProfile.age = calculatedAge.toString();
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
      profilePhoto: null,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (birthDate) => {
    try {
      const dob = new Date(birthDate);
      const today = new Date();
      
      if (dob > today) {
        return 0;
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age > 0 ? age : 0;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
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

  const value = {
    profile,
    updateProfile,
    updateProfilePhoto,
    removeProfilePhoto,
    clearProfile,
    isProfileComplete,
    forceProfileUpdate,
    // Health data functions
    healthData,
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
    pincode: PropTypes.string,
    dateOfBirth: PropTypes.string,
    age: PropTypes.string,
    gender: PropTypes.string,
    profilePhoto: PropTypes.string,
    lastUpdated: PropTypes.string,
    bloodGroup: PropTypes.string,
    emergencyContact: PropTypes.string,
    healthMetrics: PropTypes.object,
    medicalHistory: PropTypes.object,
    insurance: PropTypes.object
  })
};

ProfileProvider.defaultProps = {
  user: null
};

export default ProfileContext;