import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Eye, EyeOff, GraduationCap, Building2, ArrowLeft, UploadCloud, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const DEGREES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'BBA', 'B.Com', 'Other'];
const DEPARTMENTS = ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics (ECE)', 'Electrical (EEE)', 'Mechanical', 'Civil', 'Data Science', 'AI & ML', 'Other'];
const YEARS = Array.from({ length: 16 }, (_, i) => 2015 + i);
const EMPLOYEE_ROLES = ['HR Manager', 'Tech Lead', 'Software Engineer', 'CTO', 'Founder', 'Talent Acquisition', 'Engineering Manager', 'Product Manager', 'Other'];

export default function RegisterStudentPage() {
  const [registerRole, setRegisterRole] = useState('STUDENT');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', retypePassword: '', phone: '', address: '',
    dateOfBirth: '', collegeName: '', degree: '', department: '', passoutYear: '',
    companyName: '', employeeRole: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [showRetypePw, setShowRetypePw] = useState(false);
  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeDragOver, setResumeDragOver] = useState(false);

  // Max allowed DoB = today minus 15 years
  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 15);
    return d.toISOString().split('T')[0];
  })();

  const handleDobChange = (val) => {
    update('dateOfBirth', val);
    if (val && val > maxDob) {
      setDobError('You must be at least 15 years old.');
    } else {
      setDobError('');
    }
  };

  const handlePhoneDigits = (val) => {
    // Strip non-digits, cap at 10
    const digits = val.replace(/\D/g, '').slice(0, 10);
    update('phone', digits);
  };

  const PW_RULES = [
    { label: '8–16 characters',   test: (p) => p.length >= 8 && p.length <= 16 },
    { label: '1 Uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: '1 Lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: '1 Digit',           test: (p) => /[0-9]/.test(p) },
    { label: '1 Symbol (!@#…)',   test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];
  const pwValid = PW_RULES.every(r => r.test(form.password));
  const pwMatch = form.password === form.retypePassword && form.retypePassword !== '';
  const step2CanSubmit = pwValid && pwMatch && resume !== null;
  const { login } = useAuth();
  const navigate = useNavigate();

  const isRecruiter = registerRole === 'RECRUITER';

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRoleSwitch = (role) => {
    setRegisterRole(role);
    setStep(1);
  };

  const handleResumeFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, DOC, or DOCX files are accepted.');
      return;
    }
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRecruiter && step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      if (isRecruiter) {
        const res = await authService.registerRecruiter({
          name: form.name, email: form.email, password: form.password,
          phoneNumber: form.phone || "0000000000", address: form.address,
          companyName: form.companyName, employeeRole: form.employeeRole,
        });
        login(res.data);
        toast.success('Account created! Start posting internships.');
        navigate('/recruiter/dashboard');
      } else {
        // Step 1: Register student account (JSON)
        const res = await authService.registerStudent({
          ...form,
          phoneNumber: form.phone || "0000000000",
          passoutYear: Number(form.passoutYear)
        });
        // Step 2: Store JWT so the upload call can authenticate
        login(res.data);
        // Step 3: Upload resume using the fresh JWT
        if (resume) {
          try {
            const { studentService } = await import('../../services/studentService');
            await studentService.uploadResume(resume);
            toast.success('Account created & resume uploaded! Complete your profile to get matched.');
          } catch {
            toast.success('Account created! Resume upload failed — you can re-upload from your profile.');
          }
        } else {
          toast.success('Account created! Complete your profile to get matched.');
        }
        navigate('/student/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = isRecruiter ? 1 : 2;
  const progressWidth = isRecruiter ? 100 : step * 50;

  return (
    <div className="auth-page">
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
            ? <><span>Find pre-matched</span><br />talent instantly.</>
            : <>Start your<br /><span>journey today.</span></>}
        </h2>
        <p className="auth-page__desc">
          {isRecruiter
            ? 'Post your internship and our algorithm will surface only the most qualified, skill-matched candidates — ranked by compatibility score.'
            : 'Create your free account and let our algorithm match you with the perfect internship. It takes less than 2 minutes.'}
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
          <div className="auth-page__steps-preview">
            {['Create Account', 'Build Profile', 'Get Matched'].map((s, i) => (
              <div key={s} className={`auth-page__step-item ${i < step ? 'done' : i === step - 1 ? 'active' : ''}`}>
                <div className="auth-page__step-dot">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <div className="auth-form__header">
            <button onClick={() => navigate('/')} className="auth-back-btn"><ArrowLeft size={14} /> Back to Home</button>
            <h1 className="auth-form__title">
              {isRecruiter ? 'Create Company Account' : (step === 1 ? 'Create Your Account' : 'Academic Details')}
            </h1>
            <p className="auth-form__sub">
              Step {step} of {totalSteps} · {isRecruiter ? 'Recruiter' : 'Student'} Registration
            </p>

            {/* Role Selection Toggle */}
            <div className="auth-role-toggle" role="group" aria-label="Registration type">
              <button
                type="button"
                id="toggle-candidate"
                className={`auth-role-toggle__btn${registerRole === 'STUDENT' ? ' active' : ''}`}
                onClick={() => handleRoleSwitch('STUDENT')}
              >
                <GraduationCap size={18} strokeWidth={2} /> Candidate
              </button>
              <button
                type="button"
                id="toggle-recruiter"
                className={`auth-role-toggle__btn${registerRole === 'RECRUITER' ? ' active' : ''}`}
                onClick={() => handleRoleSwitch('RECRUITER')}
              >
                <Building2 size={18} strokeWidth={2} /> Recruiter
              </button>
            </div>

            <div className="auth-form__progress">
              <div className="auth-form__progress-fill" style={{ width: `${progressWidth}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── STUDENT STEP 1 ───────────────────────────────── */}
            {!isRecruiter && step === 1 && (
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
                      max={maxDob}
                      onChange={e => handleDobChange(e.target.value)} required />
                    {dobError && <span className="form-error">{dobError}</span>}
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
                    <div className="auth-form__phone-wrapper">
                      <span className="auth-form__phone-prefix">+91</span>
                      <input
                        className="form-input auth-form__phone-input"
                        placeholder="98765 43210"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={e => handlePhoneDigits(e.target.value)}
                        minLength={10}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required />
                    </div>
                    {form.phone.length > 0 && form.phone.length < 10 && (
                      <span className="form-error">Enter exactly 10 digits.</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" placeholder="City, State"
                      value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* ── STUDENT STEP 2 ───────────────────────────────── */}
            {!isRecruiter && step === 2 && (
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

                {/* ── Security Fields ── */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="auth-form__pw-wrapper">
                    <input type={showPw ? 'text' : 'password'} className="form-input"
                      placeholder="Create a strong password"
                      value={form.password} onChange={e => update('password', e.target.value)}
                      required />
                    <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Retype Password</label>
                  <div className="auth-form__pw-wrapper">
                    <input type={showRetypePw ? 'text' : 'password'} className="form-input"
                      placeholder="Confirm your password"
                      value={form.retypePassword} onChange={e => update('retypePassword', e.target.value)}
                      required />
                    <button type="button" className="auth-form__pw-toggle" onClick={() => setShowRetypePw(!showRetypePw)}>
                      {showRetypePw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* ── Neo-Brutalist Password Checklist ── */}
                <div className="pw-checklist">
                  {PW_RULES.map(rule => (
                    <div key={rule.label} className={`pw-checklist__item ${rule.test(form.password) ? 'pass' : 'fail'}`}>
                      <span className="pw-checklist__icon">{rule.test(form.password) ? '✔' : '✘'}</span>
                      <span className="pw-checklist__label">{rule.label}</span>
                    </div>
                  ))}
                  {form.retypePassword !== '' && (
                    <div className={`pw-checklist__item ${pwMatch ? 'pass' : 'fail'}`}>
                      <span className="pw-checklist__icon">{pwMatch ? '✔' : '✘'}</span>
                      <span className="pw-checklist__label">Passwords match</span>
                    </div>
                  )}
                </div>

                {/* ── Resume Upload Dropzone ── */}
                <div className="resume-upload-label">Resume</div>
                <div
                  className={`resume-dropzone${resumeDragOver ? ' resume-dropzone--drag' : ''}${resume ? ' resume-dropzone--active' : ''}`}
                  onClick={() => !resume && document.getElementById('resume-file-input').click()}
                  onDragOver={(e) => { e.preventDefault(); setResumeDragOver(true); }}
                  onDragLeave={() => setResumeDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setResumeDragOver(false);
                    handleResumeFile(e.dataTransfer.files[0]);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume"
                  onKeyDown={(e) => e.key === 'Enter' && !resume && document.getElementById('resume-file-input').click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => handleResumeFile(e.target.files[0])}
                  />
                  {resume ? (
                    <>
                      <CheckCircle size={32} color="#16A34A" strokeWidth={2} />
                      <p className="resume-dropzone__filename">{resume.name}</p>
                      <button
                        type="button"
                        className="resume-dropzone__remove"
                        onClick={(e) => { e.stopPropagation(); setResume(null); }}
                        aria-label="Remove resume"
                      >
                        <X size={14} /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} color="#F97316" strokeWidth={1.75} />
                      <p className="resume-dropzone__text">Upload your Resume (PDF, DOCX)</p>
                      <p className="resume-dropzone__hint">Drag & drop or click to browse</p>
                    </>
                  )}
                </div>
              </>
            )}

            {/* ── RECRUITER FORM (single step) ─────────────────── */}
            {isRecruiter && (
              <>
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

            <div className="auth-form__nav">
              {!isRecruiter && step === 2 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
              )}
              <button
                type="submit"
                className={`btn btn-primary ${(isRecruiter || step === 1) ? 'btn-full' : ''}`}
                disabled={loading || (!isRecruiter && step === 2 && !step2CanSubmit)}
              >
                {loading
                  ? 'Creating Account...'
                  : isRecruiter
                    ? 'Create Recruiter Account'
                    : step === 1
                      ? 'Continue →'
                      : 'Create Account'}
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
