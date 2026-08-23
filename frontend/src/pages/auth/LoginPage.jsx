import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.loginStudent(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      if (res.data.role === 'CANDIDATE') {
        navigate(res.data.profileComplete ? '/student/dashboard' : '/student/profile');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <div className="auth-page__logo"><Briefcase size={22} /></div>
          <span>Intern<b>HUB</b></span>
        </div>
        <h2 className="auth-page__tagline">
          Your next big<br /><span>opportunity awaits.</span>
        </h2>
        <p className="auth-page__desc">
          Log in to discover internships perfectly matched to your skills, CGPA, and interests.
        </p>
        <div className="auth-page__testimonial">
          <div className="auth-page__quote">"InternHUB found me a 94% match internship in 2 days!"</div>
          <div className="auth-page__quote-author">— Priya S., B.Tech CSE, 2025</div>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <div className="auth-form__header">
            <h1 className="auth-form__title">Welcome Back</h1>
            <p className="auth-form__sub">Sign in to your InternHUB account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-form__pw-wrapper">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-form__divider"><span>OR</span></div>

          <div className="auth-form__links">
            <p>Don't have an account?</p>
            <div className="auth-form__register-options">
              <Link to="/register/student" className="btn btn-outline btn-sm">Join as Student</Link>
              <Link to="/register/recruiter" className="btn btn-outline btn-sm">Join as Recruiter</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
