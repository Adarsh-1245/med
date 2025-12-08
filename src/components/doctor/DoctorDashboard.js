import React from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorHeader from './DoctorHeader';
import DashboardContent from './DashboardContent';
import AppointmentsContent from './AppointmentsContent';
import PregnancyCareContent from './PregnancyCareContent';
import PatientsContent from './PatientsContent';
import EarningsContent from './EarningsContent';
import MessagesContent from './MessagesContent';
import TimeSlotsContent from './TimeSlotsContent';
import DoctorModals from './DoctorModals';
import { 
  useDoctorState, 
  useDoctorActions,
  dashboardData,
  navigationItems 
} from './doctorUtils';

// Sub-components for specific routes
const DoctorAppointmentDetail = () => {
  const { appointmentId } = useParams();
  return (
    <div>
      <h2>Appointment Details</h2>
      <p>Viewing appointment: {appointmentId}</p>
      {/* Add appointment detail view here */}
    </div>
  );
};

const DoctorPatientDetail = () => {
  const { patientId } = useParams();
  return (
    <div>
      <h2>Patient Profile</h2>
      <p>Viewing patient: {patientId}</p>
      {/* Add patient detail view here */}
    </div>
  );
};

const DoctorMessagesDetail = () => {
  const { conversationId } = useParams();
  return (
    <div>
      <h2>Conversation</h2>
      <p>Viewing conversation: {conversationId}</p>
      {/* Add conversation detail view here */}
    </div>
  );
};

const DoctorPregnancyDetail = () => {
  const { pregnancyId } = useParams();
  return (
    <div>
      <h2>Pregnancy Care Details</h2>
      <p>Viewing pregnancy case: {pregnancyId}</p>
      {/* Add pregnancy care detail view here */}
    </div>
  );
};

const DoctorEarningDetail = () => {
  const { period } = useParams();
  return (
    <div>
      <h2>Earnings Details</h2>
      <p>Viewing earnings for: {period}</p>
      {/* Add earning detail view here */}
    </div>
  );
};

const DoctorTimeslotDetail = () => {
  const { timeslotId } = useParams();
  return (
    <div>
      <h2>Timeslot Management</h2>
      <p>Managing timeslot: {timeslotId}</p>
      {/* Add timeslot detail view here */}
    </div>
  );
};

// Main DoctorDashboard component with routing
const DoctorDashboard = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get state and state setters
  const state = useDoctorState(user);
  const {
    activePage,
    timeRange,
    appointmentFilter,
    patientSearch,
    earningFilter,
    showProfileModal,
    showNotificationsModal,
    showMessagesModal,
    showChatbotModal,
    showLogoutConfirm,
    consultationDetails,
    userProfile,
    notifications,
    appointments,
    patientMessages,
    selectedPatient,
    formErrors,
    windowSize,
    timeslots,
    pregnancyFilter
  } = state;

  // Get actions
  const actions = useDoctorActions({
    ...state,
    setActivePage: state.setActivePage,
    setTimeRange: state.setTimeRange,
    setAppointmentFilter: state.setAppointmentFilter,
    setPatientSearch: state.setPatientSearch,
    setEarningFilter: state.setEarningFilter,
    setShowProfileModal: state.setShowProfileModal,
    setShowNotificationsModal: state.setShowNotificationsModal,
    setShowMessagesModal: state.setShowMessagesModal,
    setShowChatbotModal: state.setShowChatbotModal,
    setShowLogoutConfirm: state.setShowLogoutConfirm,
    setConsultationDetails: state.setConsultationDetails,
    setUserProfile: state.setUserProfile,
    setNotifications: state.setNotifications,
    setAppointments: state.setAppointments,
    setPatientNotes: state.setPatientNotes,
    setPatientMessages: state.setPatientMessages,
    setFormErrors: state.setFormErrors,
    setSelectedPatient: state.setSelectedPatient,
    setIsSidebarOpen: state.setIsSidebarOpen,
    setTimeslots: state.setTimeslots,
    setPregnancyFilter: state.setPregnancyFilter
  });

  const {
    getUnreadMessagesCount,
    getUnreadNotificationsCount,
    handleStartConversation,
    handleMarkAsRead,
    handleSendMessage,
    handleStartConsultation,
    handleCancelAppointment,
    handleApproveAppointment,
    handleRejectAppointment,
    handleAddNotes,
    handleViewFullHistory,
    handleProfileUpdate,
    handleMarkNotificationAsRead,
    handleMarkAllNotificationsAsRead,
    handleClearAllNotifications,
    showNotification,
    validateForm,
    addTimeslot,
    updateTimeslot,
    deleteTimeslot,
    toggleTimeslotAvailability,
    handleApprovePregnancyAppointment,
    handleScheduleHomeVisit,
    handleUploadReportToLocker,
    handleViewPregnancyReports,
    handleUpdatePregnancyPackage
  } = actions;

  // Update activePage based on route
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/appointments')) state.setActivePage('appointments');
    else if (path.includes('/pregnancy-care')) state.setActivePage('pregnancyCare');
    else if (path.includes('/patients')) state.setActivePage('patients');
    else if (path.includes('/earnings')) state.setActivePage('earnings');
    else if (path.includes('/messages')) state.setActivePage('messages');
    else if (path.includes('/timeslots')) state.setActivePage('timeslots');
    else state.setActivePage('dashboard');
  }, [location.pathname]);

  // Common props for all content components
  const getCommonContentProps = () => {
    const commonActions = {
      handleStartConversation,
      handleViewFullHistory,
      handleAddNotes,
      handleStartConsultation,
      handleCancelAppointment,
      handleApproveAppointment,
      handleRejectAppointment,
      setConsultationDetails: state.setConsultationDetails
    };

    const timeslotActions = {
      addTimeslot,
      updateTimeslot,
      deleteTimeslot,
      toggleTimeslotAvailability,
      setTimeslots: state.setTimeslots
    };

    const pregnancyActions = {
      handleApprovePregnancyAppointment,
      handleScheduleHomeVisit,
      handleUploadReportToLocker,
      handleViewPregnancyReports,
      handleUpdatePregnancyPackage
    };

    return {
      dashboardData,
      state: {
        activePage,
        timeRange,
        appointmentFilter,
        patientSearch,
        earningFilter,
        appointments,
        patientMessages,
        userProfile,
        timeslots,
        pregnancyFilter
      },
      actions: {
        setActivePage: state.setActivePage,
        setTimeRange: state.setTimeRange,
        setAppointmentFilter: state.setAppointmentFilter,
        setPatientSearch: state.setPatientSearch,
        setEarningFilter: state.setEarningFilter,
        setConsultationDetails: state.setConsultationDetails,
        getUnreadMessagesCount,
        getUnreadNotificationsCount,
        setPregnancyFilter: state.setPregnancyFilter,
        ...commonActions,
        ...timeslotActions,
        ...pregnancyActions
      }
    };
  };

  // Check if current route is messages page
  const isMessagesPage = location.pathname.includes('/messages');

  return (
    <div style={styles.container}>
      {/* Sidebar - hidden on messages detail pages */}
      {!isMessagesPage && (
        <DoctorSidebar
          activePage={activePage}
          setActivePage={(page) => {
            state.setActivePage(page);
            // Navigate to corresponding route
            const routeMap = {
              dashboard: '/doctor/dashboard',
              appointments: '/doctor/dashboard/appointments',
              pregnancyCare: '/doctor/dashboard/pregnancy-care',
              patients: '/doctor/dashboard/patients',
              earnings: '/doctor/dashboard/earnings',
              messages: '/doctor/dashboard/messages',
              timeslots: '/doctor/dashboard/timeslots'
            };
            navigate(routeMap[page] || '/doctor/dashboard');
          }}
          userProfile={userProfile}
          getUnreadMessagesCount={getUnreadMessagesCount}
          setShowProfileModal={state.setShowProfileModal}
          setShowLogoutConfirm={state.setShowLogoutConfirm}
          navigationItems={navigationItems}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={state.setIsSidebarOpen}
        />
      )}

      <div style={{
        ...styles.content,
        marginLeft: !isMessagesPage && window.innerWidth > 768 ? '280px' : '0',
        width: !isMessagesPage && window.innerWidth > 768 ? 'calc(100% - 280px)' : '100%'
      }}>
        <DoctorHeader
          activePage={activePage}
          userProfile={userProfile}
          getUnreadNotificationsCount={getUnreadNotificationsCount}
          setShowNotificationsModal={state.setShowNotificationsModal}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={state.setIsSidebarOpen}
        />
        
        {/* Main Content with Routing */}
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<DashboardContent {...getCommonContentProps()} />} />
          <Route path="/dashboard" element={<DashboardContent {...getCommonContentProps()} />} />
          
          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentsContent {...getCommonContentProps()} />} />
          <Route path="/appointments/:appointmentId" element={<DoctorAppointmentDetail />} />
          
          {/* Pregnancy Care */}
          <Route path="/pregnancy-care" element={<PregnancyCareContent {...getCommonContentProps()} />} />
          <Route path="/pregnancy-care/:pregnancyId" element={<DoctorPregnancyDetail />} />
          
          {/* Patients */}
          <Route path="/patients" element={<PatientsContent {...getCommonContentProps()} />} />
          <Route path="/patients/:patientId" element={<DoctorPatientDetail />} />
          
          {/* Earnings */}
          <Route path="/earnings" element={<EarningsContent {...getCommonContentProps()} />} />
          <Route path="/earnings/:period" element={<DoctorEarningDetail />} />
          
          {/* Messages */}
          <Route path="/messages" element={<MessagesContent {...getCommonContentProps()} />} />
          <Route path="/messages/:conversationId" element={<DoctorMessagesDetail />} />
          
          {/* Timeslots */}
          <Route path="/timeslots" element={<TimeSlotsContent {...getCommonContentProps()} />} />
          <Route path="/timeslots/:timeslotId" element={<DoctorTimeslotDetail />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<DashboardContent {...getCommonContentProps()} />} />
        </Routes>
      </div>

      {/* Floating Chatbot Button */}
      <button 
        style={styles.chatbotButton}
        onClick={() => state.setShowChatbotModal(true)}
        title="Medical AI Assistant"
      >
        <span style={styles.chatbotIcon}>🩺</span>
        <span style={styles.chatbotTooltip}>AI Assistant</span>
      </button>

      <DoctorModals
        state={{
          showProfileModal,
          showNotificationsModal,
          showMessagesModal,
          showChatbotModal,
          showLogoutConfirm,
          consultationDetails,
          userProfile,
          notifications,
          patientMessages,
          selectedPatient,
          formErrors,
          windowSize
        }}
        actions={{
          setShowProfileModal: state.setShowProfileModal,
          setShowNotificationsModal: state.setShowNotificationsModal,
          setShowMessagesModal: state.setShowMessagesModal,
          setShowChatbotModal: state.setShowChatbotModal,
          setShowLogoutConfirm: state.setShowLogoutConfirm,
          setConsultationDetails: state.setConsultationDetails,
          setUserProfile: state.setUserProfile,
          setFormErrors: state.setFormErrors,
          handleProfileUpdate,
          handleMarkNotificationAsRead,
          handleMarkAllNotificationsAsRead,
          handleClearAllNotifications,
          handleSendMessage,
          handleMarkAsRead,
          handleViewFullHistory,
          handleAddNotes,
          validateForm,
          handleStartConversation
        }}
        onLogout={onLogout}
        dashboardData={dashboardData}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative'
  },
  content: {
    flex: 1,
    transition: 'all 0.3s ease'
  },
  chatbotButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#7C2A62',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(124, 42, 98, 0.3)',
    zIndex: 100,
    transition: 'all 0.3s ease',
    animation: 'pulse 2s infinite',
    overflow: 'visible'
  },
  chatbotIcon: {
    fontSize: '28px',
    marginBottom: '2px'
  },
  chatbotTooltip: {
    position: 'absolute',
    top: '-35px',
    backgroundColor: '#7C2A62',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  }
};

// Add CSS for pulse animation and hover effects
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(124, 42, 98, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 25px rgba(124, 42, 98, 0.4);
    }
    100% {
      transform: scale(1);
      boxShadow: 0 4px 20px rgba(124, 42, 98, 0.3);
    }
  }

  button:hover .chatbot-tooltip {
    opacity: 1;
    transform: translateY(0);
  }

  button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(124, 42, 98, 0.5);
  }
`;
document.head.appendChild(style);

export default DoctorDashboard;