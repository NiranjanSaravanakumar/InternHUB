import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowRight, User, Building2, Mail, Phone, Lock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import './register-nb.css';

/* ── Constants ──────────────────────────────────────────── */
const DEGREES   = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'BBA', 'B.Com', 'Other'];
const DEPTS     = ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics (ECE)', 'Electrical (EEE)', 'Mechanical', 'Civil', 'Data Science', 'AI & ML', 'Other'];
const YEARS     = Array.from({ length: 16 }, (_, i) => 2015 + i);
const EMP_ROLES = ['HR Manager', 'Tech Lead', 'Software Engineer', 'CTO', 'Founder', 'Talent Acquisition', 'Engineering Manager', 'Product Manager', 'Other'];

/* ── Password rules ─────────────────────────────────────── */
const PW_RULES = [
  { key: 'length',  label: 'len:8-16',    test: (p) => p.length >= 8 && p.length <= 16 },
  { key: 'upper',   label: 'upper:A-Z',   test: (p) => /[A-Z]/.test(p) },
  { key: 'lower',   label: 'lower:a-z',   test: (p) => /[a-z]/.test(p) },
  { key: 'digit',   label: 'digit:0-9',   test: (p) => /[0-9]/.test(p) },
  { key: 'symbol',  label: 'sym:!@#$%',   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/* ── Reusable field components ──────────────────────────── */
function NbInput({ label, icon: Icon, error, inputRef, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-black font-['Manrope']">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black opacity-40 pointer-events-none">
            <Icon size={15} strokeWidth={2.5} />
          </span>
        )}
        <input
          ref={inputRef}
          className={`
            w-full border-2 border-black bg-white
            ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-3
            text-sm font-medium text-black
            font-['Manrope'] rounded-none
            focus:outline-none focus:ring-0 focus:border-[#F97316]
            placeholder:text-black/30 placeholder:font-normal
            shadow-[3px_3px_0_0_#000000]
            ${error ? 'border-red-600' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="font-mono text-[11px] text-red-600">{error}</span>
      )}
    </div>
  );
}

function NbSelect({ label, icon: Icon, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-black font-['Manrope']">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black opacity-40 pointer-events-none z-10">
            <Icon size={15} strokeWidth={2.5} />
          </span>
        )}
        <select
          className={`
            w-full border-2 border-black bg-white
            ${Icon ? 'pl-9' : 'pl-3'} pr-8 py-3
            text-sm font-medium text-black
            font-['Manrope'] rounded-none appearance-none
            focus:outline-none focus:ring-0 focus:border-[#F97316]
            shadow-[3px_3px_0_0_#000000]
          `}
          {...props}
        >
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#000" strokeWidth="2" strokeLinecap="square"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ── Password checklist ─────────────────────────────────── */
function PwChecklist({ password, confirmPassword }) {
  const results = useMemo(() =>
    PW_RULES.map(r => ({ ...r, passed: password.length > 0 && r.test(password) })),
    [password]
  );
  const match = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-lg shadow-gray-200/50">
      <div className="font-sans text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-2">
        Password Constraints
      </div>
      <div className="flex flex-col gap-1">
        {results.map(({ key, label, passed }) => (
          <div key={key} className="flex items-center gap-2">
            {passed
              ? <CheckCircle2 size={12} className="text-orange-500 shrink-0" strokeWidth={2.5} />
              : <XCircle     size={12} className="text-red-500 shrink-0"   strokeWidth={2.5} />
            }
            <span className={`font-sans text-[11px] font-medium ${passed ? 'text-gray-800' : 'text-red-600'}`}>
              {label}
            </span>
          </div>
        ))}
        {/* match rule */}
        <div className="flex items-center gap-2 mt-0.5 border-t border-gray-100 pt-1">
          {match
            ? <CheckCircle2 size={12} className="text-orange-500 shrink-0" strokeWidth={2.5} />
            : <XCircle     size={12} className={`${mismatch ? 'text-red-500' : 'text-gray-300'} shrink-0`} strokeWidth={2.5} />
          }
          <span className={`font-sans text-[11px] font-medium ${match ? 'text-gray-800' : mismatch ? 'text-red-600' : 'text-gray-400'}`}>
            Passwords Match
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Grid dot background ────────────────────────────────── */
const DOT_BG = {
  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
  backgroundSize: '22px 22px',
};

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const [role, setRole]               = useState('CANDIDATE');  // 'CANDIDATE' | 'RECRUITER'
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  /* shared fields */
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [pw,      setPw]      = useState('');
  const [confirm, setConfirm] = useState('');

  /* candidate-only */
  const [dob,        setDob]        = useState('');
  const [college,    setCollege]    = useState('');
  const [cgpa,       setCgpa]       = useState('');
  const [degree,     setDegree]     = useState('');
  const [dept,       setDept]       = useState('');
  const [passYear,   setPassYear]   = useState('');

  /* recruiter-only */
  const [company,    setCompany]    = useState('');
  const [empRole,    setEmpRole]    = useState('');

  /* Password validation */
  const allPwRulesPassed = useMemo(
    () => PW_RULES.every(r => r.test(pw)),
    [pw]
  );
  const passwordsMatch = pw.length > 0 && pw === confirm;
  const canSubmit = allPwRulesPassed && passwordsMatch && name && email && phone;

  /* ── Submit ───────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      if (role === 'RECRUITER') {
        const res = await authService.registerRecruiter({
          name, email, password: pw, phone,
          companyName: company, employeeRole: empRole,
        });
        login(res.data);
        toast.success('Account created. Start posting internships.');
        navigate('/recruiter/dashboard');
      } else {
        const res = await authService.registerStudent({
          name, email, password: pw, phone,
          dateOfBirth: dob, collegeName: college,
          degree, department: dept,
          passoutYear: Number(passYear),
        });
        login(res.data);
        toast.success('Account created. Complete your profile.');
        navigate('/student/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const isCandidate = role === 'CANDIDATE';

  /* ── RENDER ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white font-['Manrope']" style={DOT_BG}>
      <div className="min-h-screen flex items-start justify-center pt-28 pb-16 px-4">
        <div className="w-full max-w-xl">

          {/* ── Header ───────────────────────────────────── */}
          <div className="mb-8">
            <div className="inline-block border-2 border-black bg-black px-3 py-1 mb-4">
              <span className="font-mono text-xs text-white tracking-widest uppercase">
                internhub / register
              </span>
            </div>
            <h1 className="text-4xl font-black text-black uppercase leading-none tracking-tight">
              {isCandidate ? 'Candidate' : 'Recruiter'}<br />
              <span className="text-[#F97316]">Registration.</span>
            </h1>
            <p className="mt-2 text-sm text-black/50 font-medium">
              {isCandidate
                ? 'Build your profile. Get skill-matched. Land the internship.'
                : 'Post internships. Surface pre-matched candidates. Hire faster.'}
            </p>
          </div>

          {/* ── Role Toggle ──────────────────────────────── */}
          <div className="flex border-2 border-black mb-8 shadow-[4px_4px_0_0_#000000]">
            {['CANDIDATE', 'RECRUITER'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`
                  flex items-center justify-center gap-2
                  flex-1 py-3 text-xs font-black uppercase tracking-widest
                  transition-none border-none outline-none
                  active:translate-y-[1px] active:translate-x-[1px]
                  ${role === r
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-[#F9FAFB]'}
                `}
              >
                {r === 'CANDIDATE' ? (
                  <>
                    <User size={18} strokeWidth={2} /> Candidate
                  </>
                ) : (
                  <>
                    <Building2 size={18} strokeWidth={2} /> Recruiter
                  </>
                )}
              </button>
            ))}
          </div>

          {/* ── Form ─────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">

              {/* Full Name */}
              <NbInput
                label="Full Name"
                icon={User}
                type="text"
                placeholder={isCandidate ? 'Aditya Kumar' : 'Rahul Mehta'}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              {/* Email */}
              <NbInput
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder={isCandidate ? 'you@university.edu' : 'you@company.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              {/* Phone */}
              <NbInput
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />

              {/* ── Candidate-only fields ─────────────────── */}
              {isCandidate && (
                <>
                  {/* DOB */}
                  <NbInput
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                  />

                  {/* College */}
                  <NbInput
                    label="College / University"
                    type="text"
                    placeholder="IIT Bombay / VTU Bengaluru"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                  />

                  {/* CGPA */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-black">CGPA</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="8.50"
                        value={cgpa}
                        onChange={e => setCgpa(e.target.value)}
                        className="
                          w-full border-2 border-black bg-white
                          pl-3 pr-16 py-3 text-sm font-black text-black
                          font-mono rounded-none
                          focus:outline-none focus:ring-0 focus:border-[#F97316]
                          placeholder:text-black/25 placeholder:font-normal
                          shadow-[3px_3px_0_0_#000000]
                        "
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black/40">
                        / 10.0
                      </span>
                    </div>
                  </div>

                  {/* Degree + Dept row */}
                  <div className="grid grid-cols-2 gap-4">
                    <NbSelect label="Degree" value={degree} onChange={e => setDegree(e.target.value)}>
                      <option value="">Select</option>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </NbSelect>
                    <NbSelect label="Department" value={dept} onChange={e => setDept(e.target.value)}>
                      <option value="">Select</option>
                      {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </NbSelect>
                  </div>

                  {/* Passout Year */}
                  <NbSelect label="Expected Passout Year" value={passYear} onChange={e => setPassYear(e.target.value)}>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </NbSelect>
                </>
              )}

              {/* ── Recruiter-only fields ─────────────────── */}
              {!isCandidate && (
                <>
                  <NbInput
                    label="Company Name"
                    icon={Building2}
                    type="text"
                    placeholder="TechNova Solutions"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    required
                  />
                  <NbSelect label="Your Role at Company" value={empRole} onChange={e => setEmpRole(e.target.value)}>
                    <option value="">Select your role</option>
                    {EMP_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </NbSelect>
                </>
              )}

              {/* ── Divider: Password Section ─────────────── */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-[2px] bg-black" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">
                  // set_password
                </span>
                <div className="flex-1 h-[2px] bg-black" />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-black">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black opacity-40 pointer-events-none">
                    <Lock size={15} strokeWidth={2.5} />
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="min 8 chars"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    required
                    className="
                      w-full border-2 border-black bg-white
                      pl-9 pr-12 py-3 text-sm font-medium text-black
                      font-['Manrope'] rounded-none
                      focus:outline-none focus:ring-0 focus:border-[#F97316]
                      placeholder:text-black/30 placeholder:font-normal
                      shadow-[3px_3px_0_0_#000000]
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showPw ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-black">
                  Retype Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black opacity-40 pointer-events-none">
                    <RefreshCw size={15} strokeWidth={2.5} />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="repeat password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className={`
                      w-full border-2 bg-white
                      pl-9 pr-12 py-3 text-sm font-medium text-black
                      font-['Manrope'] rounded-none
                      focus:outline-none focus:ring-0
                      placeholder:text-black/30 placeholder:font-normal
                      shadow-[3px_3px_0_0_#000000]
                      ${confirm.length > 0
                        ? pw === confirm
                          ? 'border-green-600 focus:border-green-600'
                          : 'border-red-600 focus:border-red-600'
                        : 'border-black focus:border-[#F97316]'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {/* Validation Checklist */}
              {(pw.length > 0 || confirm.length > 0) && (
                <PwChecklist password={pw} confirmPassword={confirm} />
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={`
                  mt-2 w-full flex items-center justify-center gap-2
                  border-2 border-black py-4
                  text-sm font-black uppercase tracking-widest
                  transition-none
                  ${canSubmit && !loading
                    ? 'bg-[#F97316] text-white shadow-[4px_4px_0_0_#000000] hover:bg-[#EA580C] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none cursor-pointer'
                    : 'bg-black/10 text-black/30 border-black/20 cursor-not-allowed shadow-none'}
                `}
              >
                {loading
                  ? <span className="font-mono text-xs tracking-widest animate-pulse">processing...</span>
                  : (
                    <>
                      {isCandidate ? 'Create Candidate Account' : 'Create Recruiter Account'}
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </>
                  )}
              </button>

              {/* Footer link */}
              <p className="text-center text-xs text-black/50 font-medium pb-2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-black font-black underline underline-offset-2 hover:text-[#F97316] transition-colors"
                >
                  Sign In
                </Link>
              </p>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
