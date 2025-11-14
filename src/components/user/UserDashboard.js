import React, { useState, useEffect, useRef } from 'react';
import { ProfileProvider, useProfile } from './UserDashboardHooks';
import UserDashboardHeader from './UserDashboardHeader';
import UserDashboardViews from './UserDashboardViews';
import UserDashboardModals from './UserDashboardModals';
import { styles } from './UserDashboardStyles';

const UserDashboardContent = ({ user, onLogout }) => {
  const { profile, updateProfile } = useProfile();
  
  const [activeView, setActiveView] = useState('dashboard');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  
  const [userProfile, setUserProfile] = useState(profile);

  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const [paymentLoading, setPaymentLoading] = useState(false);

  // Address Management State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home'
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Quantity state for pharmacy medicines
  const [pharmacyQuantities, setPharmacyQuantities] = useState({});

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your QuickMed assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const chatInputRef = useRef(null);
  const chatMessagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const [doctorChats, setDoctorChats] = useState({});
  const [activeDoctorChat, setActiveDoctorChat] = useState(null);
  const [showDoctorChat, setShowDoctorChat] = useState(false);

  const [pharmacySearchQueries, setPharmacySearchQueries] = useState({});

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(profile?.profilePhoto || null);

  const [appointments, setAppointments] = useState([
    {
      id: 'APT001',
      doctorName: 'Dr. Brahma Gadikoto',
      specialty: 'General Physician',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'Scheduled',
      type: 'Video Consultation',
      fee: 730,
      details: {
        patientName: 'User',
        symptoms: 'Fever and cold',
        notes: 'Regular checkup scheduled',
        prescription: 'To be provided after consultation'
      }
    },
    {
      id: 'APT002',
      doctorName: 'Dr. Charitha Kasturi',
      specialty: 'Pediatrician',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'Completed',
      type: 'In-Person',
      fee: 505,
      details: {
        patientName: 'User',
        symptoms: 'Child vaccination',
        notes: 'Vaccination completed successfully',
        prescription: 'Next vaccination due in 2 months'
      }
    },
    {
      id: 'APT003',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      date: '2024-01-22',
      time: '11:30 AM',
      status: 'Cancelled',
      type: 'Video Consultation',
      fee: 1200,
      details: {
        patientName: 'User',
        symptoms: 'Chest pain',
        notes: 'Appointment cancelled by patient',
        prescription: 'None'
      }
    },
    {
      id: 'APT004',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Dermatologist',
      date: '2024-01-25',
      time: '3:00 PM',
      status: 'Pending',
      type: 'Video Consultation',
      fee: 800,
      details: {
        patientName: 'User',
        symptoms: 'Skin allergy',
        notes: 'Awaiting confirmation',
        prescription: 'To be provided after consultation'
      }
    },
    {
      id: 'APT005',
      doctorName: 'Dr. Anil Kumar',
      specialty: 'Orthopedic',
      date: '2024-01-19',
      time: '4:30 PM',
      status: 'Rescheduled',
      type: 'In-Person',
      fee: 950,
      details: {
        patientName: 'User',
        symptoms: 'Knee pain',
        notes: 'Rescheduled from original date',
        prescription: 'To be provided after consultation'
      }
    }
  ]);

  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Confirmed',
      message: 'Your order ORD001 has been confirmed',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Delivery Update',
      message: 'Your order is out for delivery',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      type: 'delivery'
    },
    {
      id: 3,
      title: 'Prescription Approved',
      message: 'Your uploaded prescription has been verified',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      type: 'prescription'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [deliveryPartner] = useState({
    id: 'DP001',
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    vehicle: 'Bike',
    vehicleNumber: 'KA01AB1234',
    rating: 4.7,
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    userLocation: { lat: 12.9352, lng: 77.6245 },
    destination: { lat: 12.9352, lng: 77.6245 },
    status: 'picked_up',
    estimatedTime: '25 min'
  });

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showPharmacyStore, setShowPharmacyStore] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  const medicines = [
    { id: 1, name: 'Aspirin 75mg', price: 25, vendor: 'WellCare Store', category: 'OTC' },
    { id: 2, name: 'Paracetamol 500mg', price: 30, vendor: 'City Pharmacy', category: 'OTC' },
    { id: 3, name: 'Ibuprofen 400mg', price: 35, vendor: 'HealthPlus Medicines', category: 'OTC' },
    { id: 4, name: 'Vitamin C 1000mg', price: 40, vendor: 'WellCare Store', category: 'Vitamins' },
    { id: 5, name: 'Amoxicillin 500mg', price: 120, vendor: 'City Pharmacy', category: 'Prescription' },
    { id: 6, name: 'Blood Pressure Monitor', price: 899, vendor: 'HealthPlus Medicines', category: 'Equipment' }
  ];

  const pharmacies = [
    { 
      id: 1, 
      name: 'City Pharmacy', 
      distance: '1.1 km', 
      deliveryTime: '20 min', 
      rating: 4.5,
      medicines: [
        { id: 2, name: 'Paracetamol 500mg', price: 30, category: 'OTC', stock: 15 },
        { id: 5, name: 'Amoxicillin 500mg', price: 120, category: 'Prescription', stock: 8 },
        { id: 7, name: 'Cetirizine 10mg', price: 25, category: 'OTC', stock: 20 },
        { id: 8, name: 'Omeprazole 20mg', price: 45, category: 'Prescription', stock: 12 }
      ]
    },
    { 
      id: 2, 
      name: 'WellCare Store', 
      distance: '1.6 km', 
      deliveryTime: '25 min', 
      rating: 4.8,
      medicines: [
        { id: 1, name: 'Aspirin 75mg', price: 25, category: 'OTC', stock: 25 },
        { id: 4, name: 'Vitamin C 1000mg', price: 40, category: 'Vitamins', stock: 30 },
        { id: 9, name: 'Multivitamin Tablets', price: 150, category: 'Vitamins', stock: 18 },
        { id: 10, name: 'Calcium Supplements', price: 200, category: 'Vitamins', stock: 22 }
      ]
    },
    { 
      id: 3, 
      name: 'HealthPlus Medicines', 
      distance: '1.9 km', 
      deliveryTime: '30 min', 
      rating: 4.3,
      medicines: [
        { id: 3, name: 'Ibuprofen 400mg', price: 35, category: 'OTC', stock: 10 },
        { id: 6, name: 'Blood Pressure Monitor', price: 899, category: 'Equipment', stock: 5 },
        { id: 11, name: 'Diabetes Test Strips', price: 350, category: 'Equipment', stock: 15 },
        { id: 12, name: 'Thermometer', price: 150, category: 'Equipment', stock: 8 }
      ]
    }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Brahma Gadikoto',
      specialty: 'General Physician',
      rating: 5,
      experience: '15 years',
      languages: ['English', 'Telugu'],
      consultationFee: 730,
      availableSlots: generateTimeSlots(),
      image: '👨‍⚕️',
      bio: 'Specialized in general medicine with 15 years of experience. Available for online consultations.',
      qualifications: 'MBBS, MD (General Medicine)'
    },
    {
      id: 2,
      name: 'Dr. Charitha Kasturi',
      specialty: 'Pediatrician',
      rating: 5,
      experience: '12 years',
      languages: ['English', 'Telugu'],
      consultationFee: 505,
      availableSlots: generateTimeSlots(),
      image: '👩‍⚕️',
      bio: 'Pediatric specialist with expertise in child healthcare and development.',
      qualifications: 'MBBS, DCH (Diploma in Child Health)'
    },
    {
      id: 3,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      rating: 4,
      experience: '10 years',
      languages: ['English', 'Hindi'],
      consultationFee: 1200,
      availableSlots: generateTimeSlots(),
      image: '👨‍⚕️',
      bio: 'Cardiology expert with extensive experience in heart-related conditions.',
      qualifications: 'MBBS, DM (Cardiology)'
    }
  ];

  const chatbotResponses = {
    'hello': "Hello! I'm your QuickMed assistant. How can I help you with medicines or doctor consultations today?",
    'hi': "Hi there! Welcome to QuickMed. How can I assist you with healthcare services?",
    'medicine': "We offer a wide range of medicines. You can search for specific medicines, upload prescriptions, or browse categories. Would you like me to help you find something specific?",
    'doctor': "We have certified doctors available for online consultations. You can book appointments by specialty, check availability, and consult via video. Would you like to book a consultation?",
    'delivery': "We offer fast delivery within 2 hours for medicines and 24/7 doctor consultations. Delivery is free for orders above ₹499.",
    'payment': "We accept all major payment methods including UPI, credit/debit cards, net banking, and wallet payments. All payments are secure and encrypted.",
    'prescription': "You can upload your prescription in the Medicine section. We'll verify it and deliver your medicines. Supported formats: JPG, PNG, PDF.",
    'emergency': "For medical emergencies, please contact your nearest hospital immediately or call emergency services at 108.",
    'default': "I understand you're asking about healthcare services. I can help with medicine orders, doctor appointments, delivery tracking, and general health queries. Could you please provide more details?"
  };

  function generateTimeSlots() {
    const slots = [];
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const currentIST = new Date(now.getTime() + istOffset);
    
    let currentHour = currentIST.getHours();
    const currentMinute = currentIST.getMinutes();
    
    if (currentMinute > 30) {
      currentHour += 1;
    }
    
    for (let i = 0; i < 6; i++) {
      const hour = (currentHour + i) % 24;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const timeString = `${displayHour}:00 ${period}`;
      slots.push(timeString);
    }
    
    return slots;
  }

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesTimeSlot = !selectedTimeSlot || doctor.availableSlots.includes(selectedTimeSlot);
    const matchesExperience = !selectedExperience || doctor.experience.includes(selectedExperience);
    const matchesLanguage = !selectedLanguage || doctor.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesTimeSlot && matchesExperience && matchesLanguage;
  });

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
  const allTimeSlots = [...new Set(doctors.flatMap(doctor => doctor.availableSlots))].sort();

  const filteredAppointments = appointments.filter(appointment => {
    if (appointmentFilter === 'all') return true;
    return appointment.status.toLowerCase() === appointmentFilter.toLowerCase();
  });

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    
    switch (orderFilter) {
      case 'delivered':
        return order.status === 'Delivered';
      case 'in-transit':
        return order.status === 'In Transit' || order.status === 'On the Way';
      case 'pending':
        return order.status === 'Pending';
      default:
        return true;
    }
  });

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    addNotification('Medicine Added', `${medicine.name} added to cart`, 'order');
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map(item => 
        item.id === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date(),
      read: false,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const scheduleAppointment = (doctor, date, time) => {
    const newAppointment = {
      id: `APT${Date.now()}`,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: date,
      time: time,
      status: 'Scheduled',
      type: 'Video Consultation',
      fee: doctor.consultationFee,
      details: {
        patientName: userProfile.fullName,
        symptoms: 'General consultation',
        notes: 'New appointment scheduled',
        prescription: 'To be provided after consultation'
      }
    };
    setAppointments(prev => [newAppointment, ...prev]);
    addNotification('Appointment Scheduled', `Appointment with ${doctor.name} scheduled for ${date} at ${time}`, 'appointment');
    setActiveView('appointments');
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId 
        ? { ...apt, date: newDate, time: newTime, status: 'Rescheduled' }
        : apt
    ));
    addNotification('Appointment Rescheduled', 'Your appointment has been rescheduled successfully', 'appointment');
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId 
        ? { ...apt, status: 'Cancelled' }
        : apt
    ));
    addNotification('Appointment Cancelled', 'Your appointment has been cancelled', 'appointment');
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  // Enhanced pharmacy store view function
  const viewPharmacyStore = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowPharmacyStore(true);
    
    // Initialize search query for this pharmacy if not exists
    if (!pharmacySearchQueries[pharmacy.id]) {
      setPharmacySearchQueries(prev => ({
        ...prev,
        [pharmacy.id]: ''
      }));
    }
  };

  // Enhanced add to cart from pharmacy with better feedback
  const addToCartFromPharmacy = (medicine) => {
    return new Promise((resolve) => {
      const existingItem = cart.find(item => item.id === medicine.id);
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...medicine, quantity: 1, addedFrom: 'pharmacy' }]);
      }
      
      addNotification('Medicine Added', `${medicine.name} added to cart from pharmacy`, 'order');
      
      // Simulate API call delay for better UX
      setTimeout(() => {
        resolve();
      }, 300);
    });
  };

  // Enhanced quantity management for pharmacy medicines
  const handlePharmacyQuantityChange = (medicineId, change) => {
    setPharmacyQuantities(prev => {
      const currentQuantity = prev[medicineId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      return {
        ...prev,
        [medicineId]: newQuantity
      };
    });
  };

  const handleAddToCartFromPharmacy = async (medicine) => {
    const quantity = pharmacyQuantities[medicine.id] || 1;
    
    if (quantity === 0) {
      // If quantity is 0, add 1 by default
      setPharmacyQuantities(prev => ({
        ...prev,
        [medicine.id]: 1
      }));
      await addToCartFromPharmacy(medicine);
    } else {
      // Add the specified quantity
      for (let i = 0; i < quantity; i++) {
        await addToCartFromPharmacy(medicine);
      }
      
      // Reset quantity after adding to cart
      setPharmacyQuantities(prev => ({
        ...prev,
        [medicine.id]: 0
      }));
    }
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid prescription file (JPG, PNG, or PDF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setPrescriptionFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPrescriptionPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPrescriptionPreview(null);
      }
      
      setShowPrescriptionModal(true);
      addNotification('Prescription Uploaded', 'Your prescription has been uploaded successfully', 'prescription');
    }
  };

  const handlePrescriptionSubmit = () => {
    if (!prescriptionFile) {
      alert('Please select a prescription file first');
      return;
    }
    
    alert(`Prescription "${prescriptionFile.name}" uploaded successfully! Our team will verify it shortly.`);
    setShowPrescriptionModal(false);
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
  };

  const startLiveTracking = (order) => {
    setTrackingOrder(order);
    setActiveView('live-tracking');
    addNotification('Live Tracking Started', `You can now track your order ${order.id} in real-time`, 'tracking');
  };

  const callDeliveryPartner = () => {
    alert(`Calling delivery partner: ${deliveryPartner.name}\nPhone: ${deliveryPartner.phone}`);
  };

  const getDeliveryStatusText = (status) => {
    const statusMap = {
      'ordered': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'preparing': 'Preparing Your Order',
      'picked_up': 'Picked Up',
      'on_the_way': 'On the Way',
      'delivered': 'Delivered'
    };
    return statusMap[status] || status;
  };

  const getDeliveryProgress = (status) => {
    const progressMap = {
      'ordered': 20,
      'confirmed': 40,
      'preparing': 60,
      'picked_up': 80,
      'on_the_way': 90,
      'delivered': 100
    };
    return progressMap[status] || 0;
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Address Management Functions
  const saveAddressToProfile = (address) => {
    const newAddress = {
      id: `ADDR${Date.now()}`,
      ...address,
      isDefault: savedAddresses.length === 0
    };
    
    setSavedAddresses(prev => [...prev, newAddress]);
    
    // Update user profile with address
    const updatedProfile = {
      ...userProfile,
      address: address
    };
    setUserProfile(updatedProfile);
    updateProfile(updatedProfile);
  };

  const handleAddressInputChange = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectSavedAddress = (addressId) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setDeliveryAddress(address);
      setSelectedAddressId(addressId);
    }
  };

  const setDefaultAddress = (addressId) => {
    setSavedAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  const deleteAddress = (addressId) => {
    if (savedAddresses.length <= 1) {
      alert('You must have at least one saved address');
      return;
    }
    
    setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
    if (selectedAddressId === addressId) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      setDeliveryAddress(defaultAddress);
      setSelectedAddressId(defaultAddress.id);
    }
  };

  // Updated Checkout Flow
  const handleCheckoutConfirmation = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Check if user has saved addresses
    if (savedAddresses.length > 0) {
      setShowAddressModal(true);
    } else {
      // If no saved addresses, prompt to add one
      setShowAddressModal(true);
    }
  };

  const handleConfirmCheckout = () => {
    // Validate address
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      alert('Please complete the delivery address before proceeding to payment.');
      return;
    }

    setShowAddressModal(false);
    setShowCheckoutConfirm(false);
    
    // Save address to profile if it's new
    if (!savedAddresses.find(addr => 
      addr.street === deliveryAddress.street && 
      addr.pincode === deliveryAddress.pincode
    )) {
      saveAddressToProfile(deliveryAddress);
    }
    
    initiatePayment();
  };

  const handleCancelCheckout = () => {
    setShowCheckoutConfirm(false);
  };

  const initiatePayment = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system is loading, please try again in a moment.');
      return;
    }

    setPaymentLoading(true);

    try {
      const totalAmount = getTotalPrice() * 100;

      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag',
        amount: totalAmount,
        currency: 'INR',
        name: 'QuickMed Pharmacy',
        description: 'Medicine Purchase',
        image: 'https://cdn.razorpay.com/logos/FFATTsJeURNMxx_medium.png',
        handler: function(response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: userProfile.fullName,
          email: userProfile.email,
          contact: userProfile.phone
        },
        notes: {
          address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
          landmark: deliveryAddress.landmark || 'Not specified',
          address_type: deliveryAddress.addressType
        },
        theme: {
          color: '#7C2A62'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            alert('Payment was cancelled. You can try again.');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('Error initializing payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const verificationResponse = await verifyPayment(paymentResponse);
      
      if (verificationResponse.success) {
        const orderId = `ORD${Date.now()}`;
        const newOrder = {
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          items: [...cart],
          total: getTotalPrice(),
          status: 'Confirmed',
          deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
          addressDetails: deliveryAddress,
          paymentId: paymentResponse.razorpay_payment_id,
          trackingAvailable: true,
          deliveryPartner: {
            name: 'Rahul Kumar',
            phone: '+91 9876543210',
            estimatedTime: '30 min'
          }
        };
        
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setCart([]);
        setActiveView('orders');
        
        addNotification('Order Confirmed', `Your order ${orderId} has been placed successfully`, 'order');
        alert(`Payment successful! Order ID: ${orderId}\nYour order will be delivered to: ${deliveryAddress.street}, ${deliveryAddress.city}`);
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleBookAppointment = (doctor, timeSlot) => {
    const selectedDate = prompt('Enter appointment date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    
    if (selectedDate && timeSlot) {
      scheduleAppointment(doctor, selectedDate, timeSlot);
      alert(`Appointment booked with ${doctor.name} on ${selectedDate} at ${timeSlot}`);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    
    setTimeout(() => {
      const response = generateBotResponse(userMessage.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 50);
  };

  const generateBotResponse = (message) => {
    if (message.includes('hello') || message.includes('hi')) {
      return chatbotResponses.hello;
    } else if (message.includes('medicine') || message.includes('drug') || message.includes('pill')) {
      return chatbotResponses.medicine;
    } else if (message.includes('doctor') || message.includes('consult') || message.includes('appointment')) {
      return chatbotResponses.doctor;
    } else if (message.includes('delivery') || message.includes('shipping') || message.includes('time')) {
      return chatbotResponses.delivery;
    } else if (message.includes('payment') || message.includes('pay') || message.includes('money')) {
      return chatbotResponses.payment;
    } else if (message.includes('prescription') || message.includes('upload')) {
      return chatbotResponses.prescription;
    } else if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return chatbotResponses.emergency;
    } else {
      return chatbotResponses.default;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startDoctorChat = (doctor) => {
    setActiveDoctorChat(doctor);
    setShowDoctorChat(true);
    
    if (!doctorChats[doctor.id]) {
      setDoctorChats(prev => ({
        ...prev,
        [doctor.id]: [
          {
            id: 1,
            text: `Hello! I'm ${doctor.name}. How can I help you today?`,
            sender: 'doctor',
            timestamp: new Date()
          }
        ]
      }));
    }
  };

  const sendDoctorMessage = (doctorId, message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setDoctorChats(prev => ({
      ...prev,
      [doctorId]: [...(prev[doctorId] || []), newMessage]
    }));

    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message. I'll review your concerns and get back to you shortly. For urgent matters, please book an appointment.",
        sender: 'doctor',
        timestamp: new Date()
      };

      setDoctorChats(prev => ({
        ...prev,
        [doctorId]: [...(prev[doctorId] || []), doctorResponse]
      }));
    }, 2000);
  };

  // Enhanced pharmacy search function with real-time filtering
  const handlePharmacySearch = (pharmacyId, query) => {
    setPharmacySearchQueries(prev => ({
      ...prev,
      [pharmacyId]: query
    }));
    
    // Add search analytics in real app
    console.log(`Search in pharmacy ${pharmacyId}: ${query}`);
  };

  // Enhanced pharmacy medicine filtering
  const getFilteredPharmacyMedicines = (pharmacy) => {
    if (!pharmacy) return [];
    const query = pharmacySearchQueries[pharmacy.id] || '';
    if (!query.trim()) return pharmacy.medicines || [];
    
    return (pharmacy.medicines || []).filter(medicine =>
      medicine.name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setProfilePhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setShowProfilePhotoModal(true);
    }
  };

  const handleProfilePhotoSubmit = async () => {
    if (!profilePhotoFile) {
      alert('Please select a profile photo first');
      return;
    }

    try {
      const result = await updateProfilePhotoAPI({
        profilePhoto: profilePhotoFile
      });

      if (result.success) {
        const updatedProfile = {
          ...profile,
          profilePhoto: profilePhotoPreview
        };
        updateProfile(updatedProfile);
        setUserProfile(updatedProfile);

        setProfilePhotoFile(null);
        if (profilePhotoInputRef.current) {
          profilePhotoInputRef.current.value = '';
        }

        alert('Profile photo updated successfully!');
        addNotification('Profile Photo Updated', 'Your profile photo has been updated successfully', 'info');
        
        setShowProfilePhotoModal(false);
      }
    } catch (error) {
      console.error('Error updating profile photo:', error);
      alert('Error updating profile photo. Please try again.');
    }
  };

  const updateProfilePhotoAPI = async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Profile photo updated:', profileData);
        resolve({ success: true, data: profileData });
      }, 1000);
    });
  };

  const removeProfilePhoto = () => {
    const updatedProfile = {
      ...profile,
      profilePhoto: null
    };
    updateProfile(updatedProfile);
    setUserProfile(updatedProfile);
    setProfilePhotoPreview(null);
    setProfilePhotoFile(null);
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = '';
    }
    alert('Profile photo removed successfully!');
    addNotification('Profile Photo Removed', 'Your profile photo has been removed', 'info');
  };

  const triggerProfilePhotoUpload = () => {
    profilePhotoInputRef.current?.click();
  };

  // Auto-focus search input when pharmacy store modal opens
  useEffect(() => {
    if (showPharmacyStore && selectedPharmacy) {
      setTimeout(() => {
        const searchInput = document.querySelector(`[data-pharmacy-id="${selectedPharmacy.id}"]`);
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }, [showPharmacyStore, selectedPharmacy]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    // Move initialOrders inside useEffect to fix the warning
    const initialOrders = [
      {
        id: 'ORD001',
        date: '2024-01-15',
        items: [
          { name: 'Paracetamol 500mg', quantity: 2, price: 30 },
          { name: 'Vitamin C 1000mg', quantity: 1, price: 40 }
        ],
        total: 100,
        status: 'Delivered',
        deliveryAddress: '123 Main St, City, 560001',
        trackingAvailable: false
      },
      {
        id: 'ORD002',
        date: '2024-01-10',
        items: [
          { name: 'Aspirin 75mg', quantity: 1, price: 25 }
        ],
        total: 25,
        status: 'In Transit',
        deliveryAddress: '123 Main St, City, 560001',
        trackingAvailable: true,
        deliveryPartner: {
          name: 'Rahul Kumar',
          phone: '+91 9876543210',
          estimatedTime: '25 min'
        }
      },
      {
        id: 'ORD003',
        date: new Date().toISOString().split('T')[0],
        items: [
          { name: 'Amoxicillin 500mg', quantity: 1, price: 120 },
          { name: 'Vitamin C 1000mg', quantity: 2, price: 40 }
        ],
        total: 200,
        status: 'On the Way',
        deliveryAddress: '456 Park Avenue, City, 560001',
        trackingAvailable: true,
        deliveryPartner: {
          name: 'Rahul Kumar',
          phone: '+91 9876543210',
          estimatedTime: '15 min'
        }
      },
      {
        id: 'ORD004',
        date: '2024-01-12',
        items: [
          { name: 'Ibuprofen 400mg', quantity: 1, price: 35 },
          { name: 'Cetirizine 10mg', quantity: 2, price: 25 }
        ],
        total: 85,
        status: 'Pending',
        deliveryAddress: '789 Oak Street, City, 560001',
        trackingAvailable: false
      },
      {
        id: 'ORD005',
        date: '2024-01-08',
        items: [
          { name: 'Blood Pressure Monitor', quantity: 1, price: 899 }
        ],
        total: 899,
        status: 'Delivered',
        deliveryAddress: '321 Pine Road, City, 560001',
        trackingAvailable: false
      }
    ];

    setOrders(initialOrders);
    
    const trackableOrder = initialOrders.find(order => 
      order.trackingAvailable && (order.status === 'In Transit' || order.status === 'On the Way')
    );
    if (trackableOrder) {
      setTrackingOrder(trackableOrder);
    }
  }, []); // Empty dependency array since initialOrders is now inside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChatbot(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showChatbot) {
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
    }
  }, [showChatbot]);

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const dashboardProps = {
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
    showCheckoutConfirm,
    handleConfirmCheckout,
    handleCancelCheckout,
    showPrescriptionModal,
    setShowPrescriptionModal,
    prescriptionFile,
    prescriptionPreview,
    handlePrescriptionSubmit,
    setPrescriptionFile,
    setPrescriptionPreview,
    showPharmacyStore,
    setShowPharmacyStore,
    selectedPharmacy,
    showAppointmentDetails,
    setShowAppointmentDetails,
    selectedAppointment,
    showDoctorChat,
    setShowDoctorChat,
    activeDoctorChat,
    doctorChats,
    sendDoctorMessage,
    showLogoutConfirm,
    handleLogoutClick,
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
    triggerProfilePhotoUpload,
    profilePhotoInputRef,
    updateProfile,
    showChatbot,
    toggleChatbot,
    chatMessages,
    userMessage,
    handleUserMessage,
    sendMessage,
    handleKeyPress,
    chatInputRef,
    chatMessagesEndRef,
    chatRef,
    showNotifications,
    toggleNotifications,
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    showProfileDropdown,
    toggleProfileDropdown,
    setShowProfileDropdown,
    profileRef,
    notificationRef,
    styles,
    pharmacySearchQueries,
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
    // Pharmacy Quantity Management
    pharmacyQuantities,
    handlePharmacyQuantityChange,
    handleAddToCartFromPharmacy
  };

  return (
    <div style={styles.container}>
      <UserDashboardHeader {...dashboardProps} />
      <UserDashboardViews {...dashboardProps} />
      <UserDashboardModals {...dashboardProps} />
    </div>
  );
};

const UserDashboard = ({ user, onLogout }) => {
  return (
    <ProfileProvider user={user}>
      <UserDashboardContent user={user} onLogout={onLogout} />
    </ProfileProvider>
  );
};

export default UserDashboard;