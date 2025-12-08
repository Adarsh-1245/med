// DeliverySignup.js
import React from 'react';
import BaseSignup from './BaseSignup';

const DeliverySignup = ({ onSignupSuccess }) => {
  const userDetails = {
    type: 'delivery',
    label: 'Delivery Partner',
    title: 'a Delivery Partner',
    quote: 'Join our network of trusted delivery partners and earn competitive rates',
    benefits: [
      'Flexible working hours',
      'Competitive commission rates',
      'Real-time delivery tracking',
      'Weekly payments',
      'Insurance coverage'
    ],
    customFields: [
      {
        name: 'vehicleType',
        label: 'Vehicle Type',
        type: 'select',
        placeholder: 'Select your vehicle type',
        required: true,
        options: [
          { value: 'bike', label: 'Bike' },
          { value: 'scooter', label: 'Scooter' },
          { value: 'car', label: 'Car' },
          { value: 'bicycle', label: 'Bicycle' },
          { value: 'walking', label: 'Walking' }
        ]
      },
      {
        name: 'vehicleNumber',
        label: 'Vehicle Registration Number',
        type: 'text',
        placeholder: 'Enter vehicle registration number',
        required: true
      },
      {
        name: 'idProof',
        label: 'ID Proof Type',
        type: 'select',
        placeholder: 'Select ID proof',
        required: true,
        options: [
          { value: 'aadhar', label: 'Aadhar Card' },
          { value: 'pan', label: 'PAN Card' },
          { value: 'driving-license', label: 'Driving License' },
          { value: 'voter-id', label: 'Voter ID' },
          { value: 'passport', label: 'Passport' }
        ]
      },
      {
        name: 'idNumber',
        label: 'ID Proof Number',
        type: 'text',
        placeholder: 'Enter ID proof number',
        required: true
      },
      {
        name: 'availability',
        label: 'Preferred Working Hours',
        type: 'select',
        placeholder: 'Select availability',
        required: true,
        options: [
          { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
          { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
          { value: 'evening', label: 'Evening (6 PM - 12 AM)' },
          { value: 'night', label: 'Night (12 AM - 6 AM)' },
          { value: 'full-day', label: 'Full Day (Flexible)' }
        ]
      }
    ],
    fieldValidations: {
      vehicleType: {
        required: true,
        message: 'Please select vehicle type'
      },
      vehicleNumber: {
        required: true,
        message: 'Vehicle number is required'
      },
      idProof: {
        required: true,
        message: 'Please select ID proof type'
      },
      idNumber: {
        required: true,
        message: 'ID proof number is required'
      },
      availability: {
        required: true,
        message: 'Please select availability'
      }
    }
  };

  return (
    <BaseSignup 
      userType="delivery"
      userDetails={userDetails}
      onSignupSuccess={onSignupSuccess}
    />
  );
};

export default DeliverySignup;