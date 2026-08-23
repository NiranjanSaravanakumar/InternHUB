import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated, isCandidate, isRecruiter } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = isCandidate() ? '/student/dashboard' : '/recruiter/dashboard';

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Briefcase size={20} />
          </div>
          <span className="navbar__logo-text">Intern<span>HUB</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          <Link to="/#internships" className="navbar__link">Find Internships</Link>
          <Link to="/#companies" className="navbar__link">Companies</Link>
          <Link to="/#how-it-works" className="navbar__link">How It Works</Link>
        </div>

        {/* Auth Buttons */}
        <div className="navbar__actions">
          {isAuthenticated() ? (
            <div className="navbar__user" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="navbar__avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar__username">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={16} className={`navbar__chevron ${dropdownOpen ? 'open' : ''}`} />

              {dropdownOpen && (
                <div className="navbar__dropdown">
                  <Link to={dashboardLink} className="navbar__dropdown-item">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  {isCandidate() && (
                    <Link to="/student/profile" className="navbar__dropdown-item">
                      <User size={16} /> My Profile
                    </Link>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register/student" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/#internships" className="navbar__mobile-link">Find Internships</Link>
          <Link to="/#companies" className="navbar__mobile-link">Companies</Link>
          <Link to="/#how-it-works" className="navbar__mobile-link">How It Works</Link>
          <div className="navbar__mobile-actions">
            {isAuthenticated() ? (
              <>
                <Link to={dashboardLink} className="btn btn-outline btn-full">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-primary btn-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-full">Login</Link>
                <Link to="/register/student" className="btn btn-primary btn-full">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
