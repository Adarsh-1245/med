// LabTestsView.js
import React, { useState } from 'react';

const LabTestsView = ({ setActiveView, addNotification }) => {
  const [activeTab, setActiveTab] = useState('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([
    {
      id: 'LAB001',
      tests: ['Complete Blood Count', 'Liver Function Test'],
      lab: 'Metropolis Laboratory',
      date: '2024-01-15',
      time: '08:00 AM',
      status: 'Completed',
      results: 'Available',
      amount: 1200,
      reportUrl: '#'
    },
    {
      id: 'LAB002',
      tests: ['Thyroid Profile', 'Vitamin D'],
      lab: 'Thyrocare',
      date: '2024-01-20',
      time: '10:30 AM',
      status: 'Scheduled',
      results: 'Pending',
      amount: 1500
    }
  ]);

  const labTests = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'blood',
      price: 400,
      fasting: 'Not Required',
      reportTime: '24 hours',
      description: 'Measures different components of blood including red cells, white cells, and platelets',
      popular: true,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Thyroid Profile',
      category: 'hormone',
      price: 600,
      fasting: 'Fasting Required',
      reportTime: '48 hours',
      description: 'Comprehensive thyroid function test including T3, T4, and TSH levels',
      popular: true,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Liver Function Test',
      category: 'organ',
      price: 800,
      fasting: 'Fasting Required',
      reportTime: '24 hours',
      description: 'Assesses liver health by measuring enzymes, proteins, and bilirubin',
      popular: false,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop'
    },
    {
      id: 4,
      name: 'Kidney Function Test',
      category: 'organ',
      price: 700,
      fasting: 'Fasting Required',
      reportTime: '24 hours',
      description: 'Evaluates kidney function through creatinine, urea, and electrolyte levels',
      popular: false,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop'
    },
    {
      id: 5,
      name: 'Diabetes Screening',
      category: 'metabolic',
      price: 300,
      fasting: 'Fasting Required',
      reportTime: '24 hours',
      description: 'Blood glucose levels testing for diabetes diagnosis and monitoring',
      popular: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop'
    },
    {
      id: 6,
      name: 'Vitamin D Test',
      category: 'vitamin',
      price: 900,
      fasting: 'Not Required',
      reportTime: '48 hours',
      description: 'Measures Vitamin D levels essential for bone health and immunity',
      popular: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tests', icon: '🧪' },
    { id: 'blood', name: 'Blood Tests', icon: '💉' },
    { id: 'hormone', name: 'Hormone Tests', icon: '⚖️' },
    { id: 'organ', name: 'Organ Function', icon: '🫀' },
    { id: 'metabolic', name: 'Metabolic', icon: '🔬' },
    { id: 'vitamin', name: 'Vitamin Tests', icon: '💊' }
  ];

  const labs = [
    {
      id: 1,
      name: 'Metropolis Laboratory',
      rating: 4.5,
      distance: '1.2 km',
      sampleCollection: 'Home Service Available',
      timing: '6:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1516549655669-df6654e447e9?w=200&h=120&fit=crop'
    },
    {
      id: 2,
      name: 'Thyrocare',
      rating: 4.3,
      distance: '2.1 km',
      sampleCollection: 'Home & Lab Service',
      timing: '7:00 AM - 9:00 PM',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=120&fit=crop'
    },
    {
      id: 3,
      name: 'Lal Path Labs',
      rating: 4.6,
      distance: '1.8 km',
      sampleCollection: 'Home Service Available',
      timing: '6:30 AM - 8:00 PM',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=120&fit=crop'
    }
  ];

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        marginRight: '1rem',
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
      type="button"
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#E0F2F1';
        e.target.style.color = '#124441';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#009688';
      }}
    >
      ← {text}
    </button>
  );

  const addToCart = (test) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === test.id);
      if (existing) return prev;
      return [...prev, { ...test, quantity: 1 }];
    });
    addNotification('Test Added', `${test.name} added to cart`, 'lab');
  };

  const removeFromCart = (testId) => {
    setCart(prev => prev.filter(item => item.id !== testId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const bookTests = () => {
    if (cart.length === 0) {
      alert('Please add tests to cart first');
      return;
    }
    const newBooking = {
      id: `LAB${Date.now()}`,
      tests: cart.map(item => item.name),
      lab: 'Metropolis Laboratory',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'Scheduled',
      results: 'Pending',
      amount: getTotalPrice()
    };
    setBookingHistory(prev => [newBooking, ...prev]);
    setCart([]);
    setActiveTab('history');
    addNotification('Tests Booked', 'Your lab tests have been scheduled successfully', 'lab');
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '120px',
      minHeight: 'calc(100vh - 120px)',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#E0F2F1'
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
      color: '#124441',
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
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      marginTop: '20px',
      border: '1px solid #4DB6AC'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '12px 24px',
      borderRadius: '25px',
      border: '1px solid #4DB6AC',
      backgroundColor: '#FFFFFF',
      color: '#4F6F6B',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      backgroundColor: '#009688',
      color: '#FFFFFF',
      borderColor: '#009688'
    },
    searchSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      border: '1px solid #4DB6AC'
    },
    searchBox: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '25px',
      border: '1px solid #4DB6AC',
      fontSize: '1rem',
      marginBottom: '15px',
      backgroundColor: '#FFFFFF',
      color: '#124441'
    },
    categories: {
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      paddingBottom: '10px'
    },
    category: {
      padding: '10px 20px',
      borderRadius: '20px',
      border: '1px solid #4DB6AC',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      color: '#4F6F6B'
    },
    activeCategory: {
      backgroundColor: '#009688',
      color: '#FFFFFF',
      borderColor: '#009688'
    },
    testsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    testCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: '1px solid #4DB6AC',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    testImage: {
      width: '100%',
      height: '120px',
      borderRadius: '10px',
      objectFit: 'cover',
      marginBottom: '15px'
    },
    testName: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#124441',
      marginBottom: '10px'
    },
    testDescription: {
      fontSize: '0.9rem',
      color: '#4F6F6B',
      marginBottom: '15px',
      lineHeight: '1.4'
    },
    testDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    testPrice: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#009688'
    },
    testInfo: {
      fontSize: '0.8rem',
      color: '#4F6F6B'
    },
    button: {
      backgroundColor: '#009688',
      color: '#FFFFFF',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      width: '100%',
      transition: 'all 0.3s ease'
    },
    cartBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '0.7rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    },
    bookingCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      border: '1px solid #4DB6AC'
    },
    contentSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      border: '1px solid #4DB6AC'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#124441',
      marginBottom: '20px'
    },
    headerActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    cartButtonContainer: {
      position: 'relative',
      display: 'inline-block'
    }
  };

  const BookTestsTab = () => (
    <div>
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="🔍 Search for lab tests (e.g., CBC, Thyroid, Vitamin D)..."
          style={styles.searchBox}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={styles.categories}>
          {categories.map(category => (
            <button
              key={category.id}
              style={{
                ...styles.category,
                ...(selectedCategory === category.id ? styles.activeCategory : {})
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.testsGrid}>
        {filteredTests.map(test => (
          <div 
            key={test.id} 
            style={styles.testCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 150, 136, 0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <img src={test.image} alt={test.name} style={styles.testImage} />
            {test.popular && (
              <div style={{
                position: 'absolute',
                top: '25px',
                right: '25px',
                backgroundColor: '#FF6B6B',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                Popular
              </div>
            )}
            <div style={styles.testName}>{test.name}</div>
            <div style={styles.testDescription}>{test.description}</div>
            <div style={styles.testDetails}>
              <div>
                <div style={styles.testPrice}>₹{test.price}</div>
                <div style={styles.testInfo}>Report: {test.reportTime}</div>
              </div>
              <div style={styles.testInfo}>
                <div>Fasting: {test.fasting}</div>
              </div>
            </div>
            <button 
              style={{
                ...styles.button,
                backgroundColor: cart.some(item => item.id === test.id) ? '#4DB6AC' : '#009688'
              }}
              onClick={() => cart.some(item => item.id === test.id) ? removeFromCart(test.id) : addToCart(test)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = cart.some(item => item.id === test.id) ? '#4F6F6B' : '#4DB6AC';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = cart.some(item => item.id === test.id) ? '#4DB6AC' : '#009688';
              }}
            >
              {cart.some(item => item.id === test.id) ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const CartTab = () => (
    <div style={styles.contentSection}>
      <h3 style={styles.sectionTitle}>🛒 Test Cart ({cart.length} tests)</h3>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#4F6F6B' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧪</div>
          <div style={{ color: '#124441', fontWeight: '500' }}>Your cart is empty</div>
          <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>Add tests from the Book section</div>
        </div>
      ) : (
        <div>
          {cart.map(test => (
            <div key={test.id} style={styles.bookingCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#124441' }}>{test.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#4F6F6B' }}>Report: {test.reportTime}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#009688' }}>₹{test.price}</div>
                  <button 
                    onClick={() => removeFromCart(test.id)}
                    style={{
                      backgroundColor: '#FF6B6B',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FF4757';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#FF6B6B';
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ 
            backgroundColor: '#E0F2F1', 
            padding: '20px', 
            borderRadius: '10px', 
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #4DB6AC'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#124441' }}>Total Amount</div>
              <div style={{ fontSize: '0.9rem', color: '#4F6F6B' }}>{cart.length} tests selected</div>
            </div>
            <div style={{ fontWeight: 'bold', color: '#009688', fontSize: '1.2rem' }}>
              ₹{getTotalPrice()}
            </div>
          </div>
          <button 
            style={{ 
              ...styles.button, 
              marginTop: '20px', 
              fontSize: '1rem', 
              padding: '15px',
              backgroundColor: '#009688'
            }}
            onClick={bookTests}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4DB6AC';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#009688';
            }}
          >
            🧪 Book Tests Now
          </button>
        </div>
      )}
    </div>
  );

  const HistoryTab = () => (
    <div style={styles.contentSection}>
      <h3 style={styles.sectionTitle}>📋 Test History</h3>
      {bookingHistory.map(booking => (
        <div key={booking.id} style={styles.bookingCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#124441', fontSize: '1.1rem' }}>Booking #{booking.id}</div>
              <div style={{ fontSize: '0.9rem', color: '#4F6F6B', marginTop: '5px' }}>
                {booking.tests.join(', ')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4F6F6B', marginTop: '5px' }}>
                {booking.lab} • {booking.date} at {booking.time}
              </div>
            </div>
            <div style={{
              padding: '5px 15px',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              backgroundColor: booking.status === 'Completed' ? '#E8F5E9' : '#FFF3E0',
              color: booking.status === 'Completed' ? '#2E7D32' : '#F57C00',
              border: '1px solid #4DB6AC'
            }}>
              {booking.status}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#009688' }}>₹{booking.amount}</div>
            {booking.results === 'Available' ? (
              <button style={{
                backgroundColor: '#009688',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4DB6AC';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#009688';
              }}
              >
                📄 View Report
              </button>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#4F6F6B' }}>Results: {booking.results}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const LabsTab = () => (
    <div style={styles.contentSection}>
      <h3 style={styles.sectionTitle}>🏥 Nearby Laboratories</h3>
      <div style={styles.testsGrid}>
        {labs.map(lab => (
          <div 
            key={lab.id} 
            style={styles.testCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 150, 136, 0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <img src={lab.image} alt={lab.name} style={styles.testImage} />
            <div style={styles.testName}>{lab.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#FFA500', marginRight: '5px' }}>★</span>
              <span style={{ color: '#124441' }}>{lab.rating}</span>
              <span style={{ marginLeft: '10px', color: '#4F6F6B', fontSize: '0.9rem' }}>
                📍 {lab.distance}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#4F6F6B', marginBottom: '10px' }}>
              {lab.sampleCollection}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#4F6F6B', marginBottom: '15px' }}>
              ⏰ {lab.timing}
            </div>
            <button 
              style={styles.button}
              onClick={() => addNotification('Lab Selected', `${lab.name} selected for testing`, 'lab')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4DB6AC';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#009688';
              }}
            >
              Select Lab
            </button>
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
          <h1 style={styles.title}>Lab Tests 🔬</h1>
          <p style={styles.subtitle}>Book diagnostic tests, view results online, and track health metrics</p>
        </div>

        <div style={styles.cartButtonContainer}>
          <button 
            style={{
              ...styles.tab,
              backgroundColor: cart.length > 0 ? '#009688' : '#FFFFFF',
              color: cart.length > 0 ? '#FFFFFF' : '#4F6F6B',
              borderColor: '#4DB6AC'
            }}
            onClick={() => setActiveTab('cart')}
            onMouseEnter={(e) => {
              if (cart.length === 0) {
                e.target.style.backgroundColor = '#E0F2F1';
                e.target.style.color = '#124441';
              }
            }}
            onMouseLeave={(e) => {
              if (cart.length === 0) {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#4F6F6B';
              }
            }}
          >
            🛒 Cart
            {cart.length > 0 && (
              <span style={styles.cartBadge}>{cart.length}</span>
            )}
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        {['book', 'history', 'labs'].map(tab => (
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

      {activeTab === 'book' && <BookTestsTab />}
      {activeTab === 'cart' && <CartTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'labs' && <LabsTab />}
    </div>
  );
};

export default LabTestsView;