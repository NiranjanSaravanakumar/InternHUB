import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Eye, EyeOff, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const DEGREES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'BBA', 'B.Com', 'Other'];
const DEPARTMENTS = ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics (ECE)', 'Electrical (EEE)', 'Mechanical', 'Civil', 'Data Science', 'AI & ML', 'Other'];
const YEARS = Array.from({ length: 16 }, (_, i) => 2015 + i);

export default function RegisterStudentPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    dateOfBirth: '', collegeName: '', degree: '', department: '', passoutYear: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const res = await authService.registerStudent({
        ...form,
        passoutYear: Number(form.passoutYear)
      });
      login(res.data);
      toast.success('Account created! Complete your profile to get matched.');
      navigate('/student/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <div className="auth-page__icon-big"><GraduationCap size={64} /></div>
        <h2 className="auth-page__tagline">
          Start your<br /><span>journey today.</span>
        </h2>
        <p className="auth-page__desc">
          Create your free account and let our algorithm match you with the perfect internship. It takes less than 2 minutes.
        </p>
        <div className="auth-page__steps-preview">
          {['Create Account', 'Build Profile', 'Get Matched'].map((s, i) => (
            <div key={s} className={`auth-page__step-item ${i < step ? 'done' : i === step - 1 ? 'active' : ''}`}>
              <div className="auth-page__step-dot">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <div className="auth-form__header">
            <h1 className="auth-form__title">
              {step === 1 ? 'Create Your Account' : 'Academic Details'}
            </h1>
            <p className="auth-form__sub">
              Step {step} of 2 · Student Registration
            </p>
            <div className="auth-form__progress">
              <div className="auth-form__progress-fill" style={{ width: `${step * 50}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="auth-form__row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="Aditya Kumar" value={form.name}
                      onChange={e => update('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" value={form.dateOfBirth}
                      onChange={e => update('dateOfBirth', e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com"
                    value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div className="auth-form__row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" placeholder="+91 98765 43210"
                      value={form.phone} onChange={e => update('phone', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" placeholder="City, State"
                      value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="auth-form__pw-wrapper">
                    <input type={showPw ? 'text' : 'password'} className="form-input"
                      placeholder="Create a strong password (min 8 chars)"
                      value={form.password} onChange={e => update('password', e.target.value)}
                      minLength={8} required />
                    <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">College / University Name</label>
                  <input className="form-input" placeholder="IIT Bombay / VTU Bengaluru"
                    value={form.collegeName} onChange={e => update('collegeName', e.target.value)} required />
                </div>
                <div className="auth-form__row">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <select className="form-input form-select" value={form.degree}
                      onChange={e => update('degree', e.target.value)} required>
                      <option value="">Select Degree</option>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-input form-select" value={form.department}
                      onChange={e => update('department', e.target.value)} required>
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Passout Year</label>
                  <select className="form-input form-select" value={form.passoutYear}
                    onChange={e => update('passoutYear', e.target.value)} required>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="auth-form__nav">
              {step === 2 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
              )}
              <button type="submit" className={`btn btn-primary ${step === 1 ? 'btn-full' : ''}`} disabled={loading}>
                {loading ? 'Creating Account...' : step === 1 ? 'Continue →' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="auth-form__divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-outline btn-full">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
