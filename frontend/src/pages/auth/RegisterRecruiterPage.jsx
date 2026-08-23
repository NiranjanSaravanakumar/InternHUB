import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const EMPLOYEE_ROLES = ['HR Manager', 'Tech Lead', 'Software Engineer', 'CTO', 'Founder', 'Talent Acquisition', 'Engineering Manager', 'Product Manager', 'Other'];

export default function RegisterRecruiterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    companyName: '', employeeRole: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.registerRecruiter(form);
      login(res.data);
      toast.success('Account created! Start posting internships.');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left auth-page__left--recruiter">
        <div className="auth-page__brand">
          <div className="auth-page__logo"><Briefcase size={22} /></div>
          <span>Intern<b>HUB</b></span>
        </div>
        <div className="auth-page__icon-big"><Building2 size={64} /></div>
        <h2 className="auth-page__tagline">
          Find <span>pre-matched</span><br />talent instantly.
        </h2>
        <p className="auth-page__desc">
          Post your internship and our algorithm will surface only the most qualified, skill-matched candidates — ranked by compatibility score.
        </p>
        <div className="auth-page__recruiter-stats">
          {[['500+', 'Companies Trust Us'], ['25K+', 'Active Students'], ['95%', 'Match Accuracy']].map(([v, l]) => (
            <div key={l} className="auth-page__stat">
              <div className="auth-page__stat-val">{v}</div>
              <div className="auth-page__stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <div className="auth-form__header">
            <h1 className="auth-form__title">Recruiter Registration</h1>
            <p className="auth-form__sub">Create your company account to start hiring</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" placeholder="Rahul Mehta" value={form.name}
                  onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-input" placeholder="TechNova Solutions" value={form.companyName}
                  onChange={e => update('companyName', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Role at Company</label>
              <select className="form-input form-select" value={form.employeeRole}
                onChange={e => update('employeeRole', e.target.value)} required>
                <option value="">Select your role</option>
                {EMPLOYEE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input type="email" className="form-input" placeholder="you@company.com" value={form.email}
                onChange={e => update('email', e.target.value)} required />
            </div>

            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.phone}
                  onChange={e => update('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Office Address</label>
                <input className="form-input" placeholder="City, State" value={form.address}
                  onChange={e => update('address', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-form__pw-wrapper">
                <input type={showPw ? 'text' : 'password'} className="form-input"
                  placeholder="Create a strong password" value={form.password}
                  onChange={e => update('password', e.target.value)} minLength={8} required />
                <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Recruiter Account'}
            </button>
          </form>

          <div className="auth-form__divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-outline btn-full">Sign In</Link>
          <p className="auth-form__switch">
            Looking for internships? <Link to="/register/student">Register as Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
