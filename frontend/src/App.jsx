import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterStudentPage from './pages/auth/RegisterStudentPage';
import RegisterRecruiterPage from './pages/auth/RegisterRecruiterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ProfileSetup from './pages/student/ProfileSetup';
import MyApplications from './pages/student/MyApplications';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostInternship from './pages/recruiter/PostInternship';
import ViewApplicants from './pages/recruiter/ViewApplicants';

// ── Protected Route wrappers ─────────────────────────────
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated()) {
    return <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
  }
  return children;
}

// ── Main App ─────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth (redirect if already logged in) */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/register/student" element={<PublicOnlyRoute><RegisterStudentPage /></PublicOnlyRoute>} />
        <Route path="/register/recruiter" element={<PublicOnlyRoute><RegisterRecruiterPage /></PublicOnlyRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="STUDENT"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute requiredRole="STUDENT"><ProfileSetup /></ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute requiredRole="STUDENT"><MyApplications /></ProtectedRoute>
        } />

        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute requiredRole="RECRUITER"><RecruiterDashboard /></ProtectedRoute>
        } />
        <Route path="/recruiter/post" element={
          <ProtectedRoute requiredRole="RECRUITER"><PostInternship /></ProtectedRoute>
        } />
        <Route path="/recruiter/applicants/:id" element={
          <ProtectedRoute requiredRole="RECRUITER"><ViewApplicants /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "'Manrope', 'Plus Jakarta Sans', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '0px',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0 0 #000000',
              background: '#ffffff',
              color: '#000000',
            },
            success: {
              iconTheme: { primary: '#F97316', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
