// WifeLogin.js
import React from 'react';
import BaseLogin from './BaseLogin';

const WifeLogin = ({ onLoginSuccess }) => {
  const userDetails = {
    type: 'wife',
    label: 'Wife/Spouse',
    title: 'Spouse Portal',
    quote: 'Manage family healthcare needs with shared access to your spouse\'s account',
    emailLabel: 'Phone Number',
    emailPlaceholder: 'Enter primary user phone number',
    features: [
      'Access family medical records',
      'Book appointments for family members',
      'Order medicines for the household',
      'Manage prescriptions and refills',
      'Emergency contact capabilities'
    ]
  };

  return (
    <BaseLogin 
      userType="wife"
      userDetails={userDetails}
      onLoginSuccess={onLoginSuccess}
      isLinkedAccount={true}
    />
  );
};

export default WifeLogin;