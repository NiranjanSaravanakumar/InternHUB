import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Eye, EyeOff, GraduationCap, Building2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const [loginRole, setLoginRole] = useState('STUDENT');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isRecruiter = loginRole === 'RECRUITER';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isRecruiter
        ? await authService.loginRecruiter(form)
        : await authService.loginStudent(form);

      const returnedRole = res.data.role;

      // Guard: make sure the account role matches the selected portal
      if (isRecruiter && returnedRole !== 'RECRUITER') {
        toast.error('This account is a Student account. Please switch to the Candidate portal.');
        setLoading(false);
        return;
      }
      if (!isRecruiter && returnedRole !== 'STUDENT') {
        toast.error('This account is a Recruiter account. Please switch to the Recruiter portal.');
        setLoading(false);
        return;
      }

      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);

      if (returnedRole === 'STUDENT') {
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
      {/* ── Left Panel ─────────────────────────────────── */}
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <div className="auth-page__logo"><Briefcase size={22} /></div>
          <span>Intern<b>HUB</b></span>
        </div>
        <div className="auth-page__icon-big">
          {isRecruiter ? <Building2 size={64} /> : <GraduationCap size={64} />}
        </div>
        <h2 className="auth-page__tagline">
          {isRecruiter
            ? <><span>Manage your</span><br />talent pipeline.</>
            : <>Your next big<br /><span>opportunity awaits.</span></>}
        </h2>
        <p className="auth-page__desc">
          {isRecruiter
            ? 'Sign in to your recruiter dashboard to view applicants, manage internship listings, and discover top talent.'
            : 'Log in to discover internships perfectly matched to your skills, CGPA, and interests.'}
        </p>
        {isRecruiter ? (
          <div className="auth-page__recruiter-stats">
            {[['500+', 'Companies Trust Us'], ['25K+', 'Active Students'], ['95%', 'Match Accuracy']].map(([v, l]) => (
              <div key={l} className="auth-page__stat">
                <div className="auth-page__stat-val">{v}</div>
                <div className="auth-page__stat-label">{l}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="auth-page__testimonial">
            <div className="auth-page__quote">"InternHUB found me a 94% match internship in 2 days!"</div>
            <div className="auth-page__quote-author">— Priya S., B.Tech CSE, 2025</div>
          </div>
        )}
      </div>

      {/* ── Right Panel ────────────────────────────────── */}
      <div className="auth-page__right">
        <div className="auth-form">
          <div className="auth-form__header">
            <button onClick={() => navigate('/')} className="auth-back-btn"><ArrowLeft size={14} /> Back to Home</button>
            <h1 className="auth-form__title">Welcome Back</h1>
            <p className="auth-form__sub">
              Sign in to your {isRecruiter ? 'Recruiter' : 'Student'} portal
            </p>

            {/* Role Toggle */}
            <div className="auth-role-toggle" role="group" aria-label="Login portal">
              <button
                type="button"
                id="login-toggle-candidate"
                className={`flex items-center justify-center gap-2 auth-role-toggle__btn${loginRole === 'STUDENT' ? ' active' : ''}`}
                onClick={() => setLoginRole('STUDENT')}
              >
                <GraduationCap size={18} strokeWidth={2} /> Candidate
              </button>
              <button
                type="button"
                id="login-toggle-recruiter"
                className={`flex items-center justify-center gap-2 auth-role-toggle__btn${loginRole === 'RECRUITER' ? ' active' : ''}`}
                onClick={() => setLoginRole('RECRUITER')}
              >
                <Building2 size={18} strokeWidth={2} /> Recruiter
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {isRecruiter ? 'Work Email' : 'Email Address'}
              </label>
              <input
                type="email"
                className="form-input"
                placeholder={isRecruiter ? 'you@company.com' : 'you@example.com'}
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
              {loading ? 'Signing In...' : `Sign In as ${isRecruiter ? 'Recruiter' : 'Candidate'}`}
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
