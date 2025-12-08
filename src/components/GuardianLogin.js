// GuardianLogin.js
import React from 'react';
import BaseLogin from './BaseLogin';

const GuardianLogin = ({ onLoginSuccess }) => {
  const userDetails = {
    type: 'guardian',
    label: 'Guardian',
    title: 'Guardian Portal',
    quote: 'Monitor and manage healthcare for your dependents with secure linked access',
    emailLabel: 'Phone Number',
    emailPlaceholder: 'Enter primary user phone number',
    features: [
      'Monitor dependent health records',
      'Book appointments for dependents',
      'Track medicine deliveries',
      'Emergency access to medical data',
      'Receive health updates and alerts'
    ]
  };

  return (
    <BaseLogin 
      userType="guardian"
      userDetails={userDetails}
      onLoginSuccess={onLoginSuccess}
      isLinkedAccount={true}
    />
  );
};

export default GuardianLogin;