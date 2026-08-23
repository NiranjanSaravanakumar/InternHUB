import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
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
    return <Navigate to={user?.role === 'CANDIDATE' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated()) {
    return <Navigate to={user?.role === 'CANDIDATE' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
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
        <Route path="/register/student" element={<PublicOnlyRoute><RegisterStudentPage /></PublicOnlyRoute>} />
        <Route path="/register/recruiter" element={<PublicOnlyRoute><RegisterRecruiterPage /></PublicOnlyRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="CANDIDATE"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute requiredRole="CANDIDATE"><ProfileSetup /></ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute requiredRole="CANDIDATE"><MyApplications /></ProtectedRoute>
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 500,
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
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
