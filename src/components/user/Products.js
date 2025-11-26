import React, { useState } from 'react';

const Products = ({ 
  searchQuery, 
  setSearchQuery, 
  medicines, 
  filteredMedicines, 
  cart, 
  addToCart, 
  updateQuantity, 
  setActiveView 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Color constants
  const colors = {
    primary: '#7C2A62',
    accent: '#F7D9EB',
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    gray: '#666666',
    darkGray: '#333333',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545'
  };

  // Styles object with the new color scheme - SIGNIFICANTLY INCREASED GAP
  const styles = {
    mainContent: {
      padding: '20px',
      backgroundColor: colors.lightGray,
      minHeight: '100vh',
      marginTop: '50px', // Account for fixed header
      paddingTop: '80px' // SIGNIFICANTLY INCREASED from 50px to 80px
    },
    // NEW: Back button styles
    backButton: {
      position: 'fixed',
      top: '80px',
      left: '20px',
      padding: '12px 20px',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    welcomeSection: {
      textAlign: 'center',
      marginBottom: '30px', // Increased from 30px to 40px
      padding: '20px 10px', // SIGNIFICANTLY INCREASED padding
      backgroundColor: colors.white,
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      marginTop: '20px' // DOUBLED from 10px to 20px
    },
    welcomeTitle: {
      color: colors.primary,
      fontSize: '2.5rem', // Larger font size
      marginBottom: '20px', // More space below title
      fontWeight: 'bold'
    },
    welcomeSubtitle: {
      color: colors.gray,
      fontSize: '1.3rem', // Larger subtitle
      lineHeight: '1.6'
    },
    searchSection: {
      marginBottom: '40px', // Increased spacing
      backgroundColor: colors.white,
      padding: '30px', // Increased padding
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '25px', // More space
      gap: '20px' // More gap between elements
    },
    searchInput: {
      flex: 0.5,
      padding: '15px 20px', // Larger padding for better touch
      border: `2px solid ${colors.accent}`,
      borderRadius: '5px', // Slightly larger border radius
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      backgroundColor: colors.white
    },
    // NEW: Health message styles
    healthMessage: {
      flex: 0.7,
      padding: '15px 20px',
      backgroundColor: colors.accent,
      color: colors.primary,
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '500',
      textAlign: 'center',
      border: `1px solid ${colors.primary}20`
    },
    categoryFilter: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px' // More gap between category buttons
    },
    categoryButton: {
      padding: '12px 24px', // Larger buttons
      border: `2px solid ${colors.accent}`,
      backgroundColor: colors.white,
      color: colors.primary,
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '15px', // Slightly larger font
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    activeCategoryButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      borderColor: colors.primary
    },
    productsSection: {
      marginBottom: '40px' // More space at bottom
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px' // More gap between product cards
    },
    productCard: {
      backgroundColor: colors.white,
      borderRadius: '12px',
      padding: '25px', // More padding in cards
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: `1px solid ${colors.accent}`,
      display: 'flex',
      flexDirection: 'column',
      height: '90%'
    },
    productImage: {
      fontSize: '3.5rem', // Larger icons
      textAlign: 'center',
      marginBottom: '20px' // More space below image
    },
    productInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    productName: {
      color: colors.primary,
      fontSize: '1.3rem', // Slightly larger
      fontWeight: 'bold',
      marginBottom: '8px' // More space
    },
    productBrand: {
      color: colors.gray,
      fontSize: '1.1rem', // Slightly larger
      marginBottom: '12px', // More space
      fontWeight: '500'
    },
    productDescription: {
      color: colors.darkGray,
      fontSize: '0.95rem', // Slightly larger
      marginBottom: '18px', // More space
      lineHeight: '1.5' // Better readability
    },
    productMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px' // More space
    },
    productCategory: {
      backgroundColor: colors.accent,
      color: colors.primary,
      padding: '6px 14px', // Larger badge
      borderRadius: '15px',
      fontSize: '0.85rem', // Slightly larger
      fontWeight: '500'
    },
    prescriptionBadge: {
      backgroundColor: colors.warning,
      color: colors.darkGray,
      padding: '6px 10px', // Larger badge
      borderRadius: '10px',
      fontSize: '0.75rem', // Slightly larger
      fontWeight: 'bold'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px', // More gap
      marginBottom: '15px' // More space
    },
    ratingStars: {
      fontSize: '1rem' // Larger stars
    },
    ratingText: {
      color: colors.gray,
      fontSize: '0.85rem' // Slightly larger
    },
    productStock: {
      marginBottom: '18px' // More space
    },
    inStock: {
      color: colors.success,
      fontSize: '0.95rem', // Slightly larger
      fontWeight: '500'
    },
    outOfStock: {
      color: colors.danger,
      fontSize: '0.95rem', // Slightly larger
      fontWeight: '500'
    },
    productPriceSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '18px' // More space
    },
    productPrice: {
      color: colors.primary,
      fontSize: '1.6rem', // Larger price
      fontWeight: 'bold'
    },
    // UPDATED: Smaller Add to Cart button
    addToCartButton: {
      padding: '10px 0px', // SMALLER: Reduced from 14px to 10px
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '6px', // Slightly smaller
      cursor: 'pointer',
      fontSize: '0.9rem', // SMALLER: Reduced from 1.1rem to 0.9rem
      fontWeight: '600',
      transition: 'all 0.3s ease',
      marginTop: 'auto'
    },
    // UPDATED: Smaller disabled button
    disabledButton: {
      padding: '10px 16px', // SMALLER: Reduced from 14px to 10px
      backgroundColor: colors.gray,
      color: colors.white,
      border: 'none',
      borderRadius: '6px', // Slightly smaller
      cursor: 'not-allowed',
      fontSize: '0.9rem', // SMALLER: Reduced from 1.1rem to 0.9rem
      fontWeight: '600',
      opacity: 0.6,
      marginTop: 'auto'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      marginTop: 'auto',
      padding: '10px',
      backgroundColor: colors.lightGray,
      borderRadius: '8px'
    },
    // UPDATED: Smaller quantity buttons
    quantityButton: {
      width: '35px', // SMALLER: Reduced from 40px to 35px
      height: '35px', // SMALLER: Reduced from 40px to 35px
      border: `2px solid ${colors.primary}`,
      backgroundColor: colors.white,
      color: colors.primary,
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '1rem', // SMALLER: Reduced from 1.2rem to 1rem
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    // UPDATED: Smaller quantity display
    quantityDisplay: {
      fontSize: '1.1rem', // SMALLER: Reduced from 1.3rem to 1.1rem
      fontWeight: 'bold',
      color: colors.primary,
      minWidth: '35px', // SMALLER: Reduced from 40px to 35px
      textAlign: 'center'
    }
  };

  // Enhanced medicine data with detailed information
  const enhancedMedicines = [
    {
      id: 1,
      name: 'Aspirin 75mg',
      brand: 'Bayer',
      price: 25,
      vendor: 'WellCare Store',
      category: 'Pain Relief',
      description: 'Low-dose aspirin for heart health and pain relief',
      detailedDescription: 'Aspirin is a salicylate drug that works by reducing substances in the body that cause pain, fever, and inflammation. Low-dose aspirin (75mg) is commonly used for cardiovascular protection.',
      uses: [
        'Prevention of heart attacks and strokes',
        'Mild to moderate pain relief',
        'Reduction of fever and inflammation'
      ],
      dosage: 'Take one tablet daily with food as directed by your doctor',
      sideEffects: [
        'Stomach upset',
        'Heartburn',
        'Mild headache'
      ],
      precautions: [
        'Do not take if allergic to aspirin',
        'Consult doctor before surgery',
        'Avoid alcohol consumption'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 50,
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: 'Paracetamol 500mg',
      brand: 'Crocin',
      price: 30,
      vendor: 'City Pharmacy',
      category: 'Fever & Pain',
      description: 'Effective relief from fever and mild pain',
      detailedDescription: 'Paracetamol (acetaminophen) is a common pain reliever and fever reducer. It works by affecting the areas of the brain that receive pain signals and regulate body temperature.',
      uses: [
        'Fever reduction',
        'Headache relief',
        'Muscle aches and pains',
        'Arthritis pain'
      ],
      dosage: '1-2 tablets every 4-6 hours as needed, maximum 8 tablets in 24 hours',
      sideEffects: [
        'Rare when taken as directed',
        'Allergic reactions in sensitive individuals',
        'Liver damage with overdose'
      ],
      precautions: [
        'Do not exceed recommended dosage',
        'Consult doctor for liver conditions',
        'Avoid with alcohol'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 100,
      rating: 4.7,
      reviews: 256
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      brand: 'Brufen',
      price: 35,
      vendor: 'HealthPlus Medicines',
      category: 'Pain Relief',
      description: 'Anti-inflammatory pain reliever for various conditions',
      detailedDescription: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that works by reducing hormones that cause inflammation and pain in the body. Effective for various inflammatory conditions.',
      uses: [
        'Arthritis pain and inflammation',
        'Muscle aches',
        'Menstrual cramps',
        'Dental pain'
      ],
      dosage: 'One tablet every 6-8 hours with food, maximum 1200mg per day',
      sideEffects: [
        'Stomach upset',
        'Heartburn',
        'Dizziness',
        'Increased blood pressure'
      ],
      precautions: [
        'Take with food or milk',
        'Avoid in third trimester of pregnancy',
        'Consult for kidney problems'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 75,
      rating: 4.4,
      reviews: 189
    },
    {
      id: 4,
      name: 'Vitamin C 1000mg',
      brand: 'NatureMade',
      price: 40,
      vendor: 'WellCare Store',
      category: 'Vitamins & Supplements',
      description: 'High-potency Vitamin C for immune support',
      detailedDescription: 'Vitamin C (ascorbic acid) is a water-soluble vitamin essential for growth and development. It helps the body form collagen, absorb iron, and maintain healthy bones, teeth, and immune system.',
      uses: [
        'Immune system support',
        'Collagen production',
        'Antioxidant protection',
        'Iron absorption'
      ],
      dosage: 'One tablet daily with a meal',
      sideEffects: [
        'Mild diarrhea in high doses',
        'Stomach cramps',
        'Nausea'
      ],
      precautions: [
        'Consult for kidney stones history',
        'May interact with chemotherapy',
        'Store in cool dry place'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 200,
      rating: 4.8,
      reviews: 342
    },
    {
      id: 5,
      name: 'Amoxicillin 500mg',
      brand: 'Amoxil',
      price: 120,
      vendor: 'City Pharmacy',
      category: 'Antibiotics',
      description: 'Broad-spectrum antibiotic for bacterial infections',
      detailedDescription: 'Amoxicillin is a penicillin-type antibiotic that fights bacteria in the body. It is used to treat many different types of infections caused by bacteria, such as ear infections, bladder infections, pneumonia, and more.',
      uses: [
        'Bacterial infections',
        'Respiratory tract infections',
        'Urinary tract infections',
        'Skin infections'
      ],
      dosage: 'As prescribed by doctor, typically one capsule three times daily',
      sideEffects: [
        'Nausea',
        'Diarrhea',
        'Skin rash',
        'Yeast infection'
      ],
      precautions: [
        'PRESCRIPTION REQUIRED',
        'Complete full course',
        'Inform about penicillin allergy',
        'Take with plenty of water'
      ],
      image: '',
      prescriptionRequired: true,
      stock: 30,
      rating: 4.3,
      reviews: 95
    },
    {
      id: 6,
      name: 'Blood Pressure Monitor',
      brand: 'Omron',
      price: 899,
      vendor: 'HealthPlus Medicines',
      category: 'Medical Equipment',
      description: 'Digital automatic blood pressure monitor',
      detailedDescription: 'Professional-grade digital blood pressure monitor with advanced accuracy. Features easy-to-read display, irregular heartbeat detector, and memory function for tracking readings over time.',
      uses: [
        'Home blood pressure monitoring',
        'Hypertension management',
        'Health tracking',
        'Doctor consultation support'
      ],
      features: [
        'One-touch operation',
        '90-reading memory',
        'Irregular heartbeat detection',
        'WHO classification indicator'
      ],
      specifications: [
        'Cuff size: 22-32cm',
        'Battery operated',
        '2-year warranty',
        'Clinically validated'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 25,
      rating: 4.6,
      reviews: 167
    },
    {
      id: 7,
      name: 'Cetirizine 10mg',
      brand: 'Zyrtec',
      price: 25,
      vendor: 'City Pharmacy',
      category: 'Allergy',
      description: '24-hour allergy relief without drowsiness',
      detailedDescription: 'Cetirizine is an antihistamine that reduces the effects of natural chemical histamine in the body. Histamine can produce symptoms of sneezing, itching, watery eyes, and runny nose.',
      uses: [
        'Seasonal allergies',
        'Hay fever',
        'Chronic urticaria',
        'Allergic skin reactions'
      ],
      dosage: 'One tablet daily, with or without food',
      sideEffects: [
        'Dry mouth',
        'Mild drowsiness (rare)',
        'Headache',
        'Sore throat'
      ],
      precautions: [
        'Avoid alcohol',
        'Consult for kidney problems',
        'Safe for long-term use'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 80,
      rating: 4.5,
      reviews: 214
    },
    {
      id: 8,
      name: 'Omeprazole 20mg',
      brand: 'Prilosec',
      price: 45,
      vendor: 'City Pharmacy',
      category: 'Acid Reducer',
      description: 'Proton pump inhibitor for acid reflux',
      detailedDescription: 'Omeprazole is a proton pump inhibitor that decreases the amount of acid produced in the stomach. It is used to treat symptoms of GERD and other conditions caused by excess stomach acid.',
      uses: [
        'GERD (gastroesophageal reflux disease)',
        'Stomach ulcers',
        'Zollinger-Ellison syndrome',
        'Erosive esophagitis'
      ],
      dosage: 'One capsule daily before eating, usually for 4-8 weeks',
      sideEffects: [
        'Headache',
        'Diarrhea',
        'Stomach pain',
        'Nausea'
      ],
      precautions: [
        'Take before meals',
        'Do not crush or chew',
        'Long-term use requires monitoring',
        'May affect vitamin B12 absorption'
      ],
      image: '',
      prescriptionRequired: true,
      stock: 40,
      rating: 4.2,
      reviews: 178
    },
    {
      id: 9,
      name: 'Multivitamin Tablets',
      brand: 'Centrum',
      price: 150,
      vendor: 'WellCare Store',
      category: 'Vitamins & Supplements',
      description: 'Complete daily multivitamin for adults',
      detailedDescription: 'Comprehensive multivitamin formula containing essential vitamins and minerals to support overall health, energy production, immune function, and cellular protection.',
      uses: [
        'Daily nutritional support',
        'Energy production',
        'Immune system function',
        'Bone and eye health'
      ],
      keyIngredients: [
        'Vitamin A, C, D, E',
        'B-complex vitamins',
        'Calcium and Magnesium',
        'Zinc and Selenium'
      ],
      dosage: 'One tablet daily with a meal',
      sideEffects: [
        'Mild stomach upset',
        'Constipation',
        'Unusual taste'
      ],
      precautions: [
        'Keep out of reach of children',
        'Do not exceed recommended dose',
        'Consult if pregnant or nursing'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 150,
      rating: 4.7,
      reviews: 289
    },
    {
      id: 10,
      name: 'Calcium Supplements',
      brand: 'Caltrate',
      price: 200,
      vendor: 'WellCare Store',
      category: 'Vitamins & Supplements',
      description: 'Calcium with Vitamin D for bone health',
      detailedDescription: 'Advanced calcium supplement with Vitamin D3 to support bone density and strength. Essential for maintaining healthy bones and teeth, and preventing osteoporosis.',
      uses: [
        'Bone health maintenance',
        'Osteoporosis prevention',
        'Dental health',
        'Muscle function'
      ],
      dosage: 'One tablet twice daily with meals',
      sideEffects: [
        'Constipation',
        'Gas and bloating',
        'Stomach upset'
      ],
      precautions: [
        'Take with plenty of water',
        'Space from other medications',
        'Consult for kidney stones'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 90,
      rating: 4.4,
      reviews: 156
    },
    {
      id: 11,
      name: 'Metformin 500mg',
      brand: 'Glucophage',
      price: 85,
      vendor: 'HealthPlus Medicines',
      category: 'Diabetes',
      description: 'First-line treatment for type 2 diabetes',
      detailedDescription: 'Metformin is an oral diabetes medicine that helps control blood sugar levels. It works by helping to restore the body\'s proper response to insulin and decreasing the amount of sugar produced by the liver.',
      uses: [
        'Type 2 diabetes management',
        'Polycystic ovary syndrome (PCOS)',
        'Weight management in diabetes'
      ],
      dosage: 'As prescribed, usually 1-2 tablets daily with meals',
      sideEffects: [
        'Nausea',
        'Diarrhea',
        'Stomach upset',
        'Metallic taste'
      ],
      precautions: [
        'PRESCRIPTION REQUIRED',
        'Monitor kidney function',
        'Avoid excessive alcohol',
        'Take with food to reduce side effects'
      ],
      image: '',
      prescriptionRequired: true,
      stock: 60,
      rating: 4.3,
      reviews: 134
    },
    {
      id: 12,
      name: 'Atorvastatin 10mg',
      brand: 'Lipitor',
      price: 95,
      vendor: 'City Pharmacy',
      category: 'Cholesterol',
      description: 'Statin medication for cholesterol control',
      detailedDescription: 'Atorvastatin is a statin that slows the production of cholesterol in the body to reduce the amount of cholesterol that may build up on the walls of arteries and block blood flow.',
      uses: [
        'High cholesterol treatment',
        'Cardiovascular disease prevention',
        'Triglyceride reduction'
      ],
      dosage: 'One tablet daily, usually in the evening',
      sideEffects: [
        'Headache',
        'Muscle pain',
        'Joint pain',
        'Digestive issues'
      ],
      precautions: [
        'PRESCRIPTION REQUIRED',
        'Regular liver function tests',
        'Report unexplained muscle pain',
        'Avoid grapefruit products'
      ],
      image: '',
      prescriptionRequired: true,
      stock: 45,
      rating: 4.4,
      reviews: 167
    },
    // NEW EMERGENCY MEDICINES ADDED BELOW
    {
      id: 13,
      name: 'Dolo 650mg',
      brand: 'Micro Labs',
      price: 28,
      vendor: 'Emergency Pharmacy',
      category: 'Emergency',
      description: 'Fast-acting paracetamol for fever and pain relief',
      detailedDescription: 'Dolo 650 is a trusted paracetamol formulation that provides quick relief from fever, headache, body ache, and other mild to moderate pain conditions. Specially designed for rapid action.',
      uses: [
        'High fever reduction',
        'Severe headache relief',
        'Body pain and muscle aches',
        'Dental pain and migraines'
      ],
      dosage: 'One tablet every 4-6 hours, maximum 4 tablets in 24 hours',
      sideEffects: [
        'Rare when taken as directed',
        'Liver damage in overdose',
        'Allergic skin reactions'
      ],
      precautions: [
        'Do not exceed recommended dose',
        'Consult for liver conditions',
        'Avoid alcohol completely',
        'Emergency use for high fever'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 120,
      rating: 4.8,
      reviews: 425
    },
    {
      id: 14,
      name: 'Asthalin Inhaler',
      brand: 'Cipla',
      price: 145,
      vendor: 'Emergency Pharmacy',
      category: 'Emergency',
      description: 'Emergency relief for asthma and breathing difficulties',
      detailedDescription: 'Asthalin inhaler contains Salbutamol which provides immediate relief from asthma attacks, bronchospasm, and breathing difficulties by relaxing muscles in the airways.',
      uses: [
        'Asthma attacks',
        'Bronchospasm relief',
        'Exercise-induced asthma',
        'Chronic obstructive pulmonary disease'
      ],
      dosage: '1-2 puffs as needed during attack, maximum 8 puffs in 24 hours',
      sideEffects: [
        'Tremors',
        'Headache',
        'Rapid heartbeat',
        'Muscle cramps'
      ],
      precautions: [
        'PRESCRIPTION REQUIRED',
        'Not for regular use',
        'Seek emergency help if no relief',
        'Carry at all times if asthmatic'
      ],
      image: '',
      prescriptionRequired: true,
      stock: 35,
      rating: 4.6,
      reviews: 278
    },
    {
      id: 15,
      name: 'ORS Powder',
      brand: 'Electral',
      price: 15,
      vendor: 'WellCare Store',
      category: 'Emergency',
      description: 'Oral rehydration solution for dehydration emergency',
      detailedDescription: 'Electral ORS helps restore fluid and electrolyte balance during dehydration caused by diarrhea, vomiting, excessive sweating, or fever. Essential for preventing dehydration complications.',
      uses: [
        'Diarrhea and vomiting',
        'Heat stroke',
        'Food poisoning',
        'Post-operative hydration'
      ],
      dosage: 'One sachet in 200ml clean water, as needed based on condition',
      sideEffects: [
        'Rare when prepared correctly',
        'Nausea if taken too quickly'
      ],
      precautions: [
        'Use clean water for preparation',
        'Consume within 24 hours',
        'Seek doctor if severe dehydration',
        'Essential for children and elderly'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 200,
      rating: 4.9,
      reviews: 512
    },
    {
      id: 16,
      name: 'Avomine 25mg',
      brand: 'Sanofi',
      price: 42,
      vendor: 'City Pharmacy',
      category: 'Emergency',
      description: 'Emergency motion sickness and vomiting control',
      detailedDescription: 'Avomine (Promethazine) is highly effective for preventing and treating motion sickness, nausea, vomiting, and vertigo. Works by blocking signals to the vomiting center in the brain.',
      uses: [
        'Motion sickness prevention',
        'Severe nausea and vomiting',
        'Vertigo and dizziness',
        'Migraine-associated nausea'
      ],
      dosage: 'One tablet 1-2 hours before travel, or as needed for nausea',
      sideEffects: [
        'Drowsiness',
        'Dry mouth',
        'Blurred vision',
        'Dizziness'
      ],
      precautions: [
        'May cause drowsiness - avoid driving',
        'Avoid alcohol',
        'Not for children under 2 years',
        'Take before symptoms start for best effect'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 65,
      rating: 4.5,
      reviews: 189
    },
    {
      id: 17,
      name: 'Burnol Cream',
      brand: 'Johnson & Johnson',
      price: 55,
      vendor: 'HealthPlus Medicines',
      category: 'Emergency',
      description: 'First aid antiseptic cream for burns and wounds',
      detailedDescription: 'Burnol cream provides immediate relief from burns, scalds, and minor wounds. Contains antiseptic properties to prevent infection while promoting healing of damaged skin.',
      uses: [
        'Thermal burns and scalds',
        'Minor cuts and wounds',
        'Sunburn relief',
        'Skin abrasions'
      ],
      dosage: 'Apply generously on affected area 2-3 times daily',
      sideEffects: [
        'Mild stinging on application',
        'Skin irritation in sensitive individuals'
      ],
      precautions: [
        'For external use only',
        'Not for deep or infected wounds',
        'Seek doctor for severe burns',
        'Keep in first aid kit'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 80,
      rating: 4.7,
      reviews: 234
    },
    {
      id: 18,
      name: 'Digene Tablet',
      brand: 'Abbott',
      price: 12,
      vendor: 'Emergency Pharmacy',
      category: 'Emergency',
      description: 'Instant relief from acidity and indigestion',
      detailedDescription: 'Digene tablets provide fast relief from acidity, heartburn, indigestion, and gas. Antacid formulation that neutralizes excess stomach acid immediately upon consumption.',
      uses: [
        'Acidity and heartburn',
        'Indigestion and bloating',
        'Gas and flatulence',
        'Stomach discomfort'
      ],
      dosage: '1-2 tablets to be chewed as needed, maximum 12 tablets in 24 hours',
      sideEffects: [
        'Chalky taste',
        'Constipation with overuse',
        'Stomach cramps'
      ],
      precautions: [
        'Not for long-term regular use',
        'Consult if symptoms persist',
        'Take after meals if chronic acidity',
        'Keep handy for emergency relief'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 150,
      rating: 4.4,
      reviews: 367
    },
    {
      id: 19,
      name: 'Betadine Solution',
      brand: 'Win-Medicare',
      price: 85,
      vendor: 'City Pharmacy',
      category: 'Emergency',
      description: 'Antiseptic solution for wound disinfection',
      detailedDescription: 'Betadine solution contains povidone-iodine that effectively kills bacteria, viruses, and fungi. Essential for first aid to prevent infection in cuts, wounds, and abrasions.',
      uses: [
        'Wound disinfection',
        'Pre-surgical skin preparation',
        'Burn care',
        'Minor skin infections'
      ],
      dosage: 'Apply directly to affected area 2-3 times daily',
      sideEffects: [
        'Mild stinging',
        'Temporary skin discoloration',
        'Allergic reactions in iodine-sensitive individuals'
      ],
      precautions: [
        'For external use only',
        'Avoid contact with eyes',
        'Do not use on deep wounds without medical supervision',
        'Essential first aid item'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 45,
      rating: 4.6,
      reviews: 198
    },
    {
      id: 20,
      name: 'Volini Spray',
      brand: 'Sanofi',
      price: 220,
      vendor: 'HealthPlus Medicines',
      category: 'Emergency',
      description: 'Instant pain relief spray for muscle and joint injuries',
      detailedDescription: 'Volini spray provides immediate cooling relief from muscle pain, sprains, strains, and joint pain. Easy-to-use spray formulation for quick application during sports injuries or accidents.',
      uses: [
        'Muscle sprains and strains',
        'Joint pain and inflammation',
        'Sports injuries',
        'Back pain and stiffness'
      ],
      dosage: 'Spray on affected area 3-4 times daily from 15cm distance',
      sideEffects: [
        'Cooling sensation',
        'Mild skin irritation',
        'Redness in sensitive skin'
      ],
      precautions: [
        'For external use only',
        'Avoid broken skin',
        'Do not inhale spray',
        'Keep away from heat and flame'
      ],
      image: '',
      prescriptionRequired: false,
      stock: 30,
      rating: 4.5,
      reviews: 156
    }
  ];

  const categories = ['all', ...new Set(enhancedMedicines.map(medicine => medicine.category))];

  const filteredProducts = enhancedMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCartWithNotification = (product) => {
    addToCart(product);
    // You can add a toast notification here if needed
  };

  // Get quantity of product in cart
  const getProductQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // NEW: Handle back to home page
  const handleBackToHome = () => {
    setActiveView('home');
  };

  return (
    <div style={styles.mainContent}>
      {/* NEW: Back Button */}
      <button 
        style={styles.backButton}
        onClick={handleBackToHome}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = colors.accent;
          e.target.style.color = colors.primary;
          e.target.style.transform = 'translateX(-5px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = colors.primary;
          e.target.style.color = colors.white;
          e.target.style.transform = 'translateX(0)';
        }}
      >
        ← Back to Home
      </button>

      {/* Header Section */}
      <section style={styles.welcomeSection}>
        <h2 style={styles.welcomeTitle}>Our Medicine Products 💊</h2>
        <p style={styles.welcomeSubtitle}>
          Discover high-quality medicines and healthcare products with detailed information
        </p>
      </section>

      {/* Search and Filter Section */}
      <section style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search medicines, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {/* NEW: Health Priority Message */}
          <div style={styles.healthMessage}>
            For your safety and well-being, we provide only quality medicines from trusted sources, properly stored for maximum efficacy.
          </div>
        </div>

        <div style={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              style={
                selectedCategory === category 
                  ? {...styles.categoryButton, ...styles.activeCategoryButton}
                  : styles.categoryButton
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section style={styles.productsSection}>
        <div style={styles.productsGrid}>
          {filteredProducts.map(product => {
            const quantityInCart = getProductQuantity(product.id);
            
            return (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImage}>
                  {product.image}
                </div>
                
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productBrand}>{product.brand}</p>
                  <p style={styles.productDescription}>{product.description}</p>
                  
                  <div style={styles.productMeta}>
                    <div style={styles.productCategory}>{product.category}</div>
                    {product.prescriptionRequired && (
                      <div style={styles.prescriptionBadge}>Prescription Required</div>
                    )}
                  </div>

                  <div style={styles.productRating}>
                    <span style={styles.ratingStars}>
                      {'⭐'.repeat(Math.floor(product.rating))}
                    </span>
                    <span style={styles.ratingText}>({product.reviews})</span>
                  </div>

                  <div style={styles.productStock}>
                    {product.stock > 0 ? (
                      <span style={styles.inStock}>In Stock ({product.stock})</span>
                    ) : (
                      <span style={styles.outOfStock}>Out of Stock</span>
                    )}
                  </div>

                  <div style={styles.productPriceSection}>
                    <span style={styles.productPrice}>₹{product.price}</span>
                  </div>

                  {/* Quantity Controls - Only show if product is in cart */}
                  {quantityInCart > 0 ? (
                    <div style={styles.quantityControls}>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.primary;
                          e.target.style.color = colors.white;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.white;
                          e.target.style.color = colors.primary;
                        }}
                      >
                        −
                      </button>
                      <span style={styles.quantityDisplay}>{quantityInCart}</span>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                        disabled={quantityInCart >= product.stock}
                        onMouseEnter={(e) => {
                          if (quantityInCart < product.stock) {
                            e.target.style.backgroundColor = colors.primary;
                            e.target.style.color = colors.white;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (quantityInCart < product.stock) {
                            e.target.style.backgroundColor = colors.white;
                            e.target.style.color = colors.primary;
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    // Add to Cart Button - Only show if product is not in cart
                    <button
                      style={product.stock > 0 ? styles.addToCartButton : styles.disabledButton}
                      onClick={() => product.stock > 0 && addToCartWithNotification(product)}
                      disabled={product.stock === 0}
                      onMouseEnter={(e) => {
                        if (product.stock > 0) {
                          e.target.style.backgroundColor = colors.accent;
                          e.target.style.color = colors.primary;
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock > 0) {
                          e.target.style.backgroundColor = colors.primary;
                          e.target.style.color = colors.white;
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}; 

export default Products;