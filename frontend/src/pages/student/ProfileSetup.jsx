import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Plus, X, Upload, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProfileSetup.css';

const DOMAINS = ['Full-Stack', 'Machine Learning', 'Data Science', 'Frontend', 'Backend', 'DevOps', 'Mobile Development', 'Cybersecurity', 'Cloud Computing', 'UI/UX Design'];
const LOCATIONS = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Remote', 'Any'];
const POPULAR_SKILLS = ['Java', 'Spring Boot', 'React', 'Node.js', 'Python', 'MySQL', 'MongoDB', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'TensorFlow', 'REST APIs', 'Git', 'Figma', 'Flutter', 'Angular', 'Vue.js', 'PostgreSQL'];

export default function ProfileSetup() {
  const [form, setForm] = useState({
    cgpa: '', skills: [], preferredDomain: '', experienceMonths: 0, preferredLocation: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [resume, setResume] = useState(null);            // newly selected file
  const [existingResumeUrl, setExistingResumeUrl] = useState(null); // from backend
  const [showDropzone, setShowDropzone] = useState(false); // toggle for replace flow
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    studentService.getProfile().then(res => {
      if (res.data) {
        const d = res.data;
        // Backend returns skills as a comma-separated string (e.g. "Java,React").
        // It also serialises the @Transient getSkillList() as `skillList` (array).
        // Prefer the array if present, otherwise parse the string.
        let parsedSkills = [];
        if (Array.isArray(d.skillList) && d.skillList.length > 0) {
          parsedSkills = d.skillList;
        } else if (typeof d.skills === 'string' && d.skills.trim()) {
          parsedSkills = d.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else if (Array.isArray(d.skills)) {
          parsedSkills = d.skills;
        }

        setForm({
          // cgpa: use the raw number; only fall back to '' when null/undefined (not 0)
          cgpa: d.cgpa != null ? String(d.cgpa) : '',
          skills: parsedSkills,
          preferredDomain: d.preferredDomain || '',
          experienceMonths: d.experienceMonths ?? 0,
          preferredLocation: d.preferredLocation || ''
        });
        // Persist the existing resume URL so we can show the "Current File" UI
        if (d.resumeUrl) setExistingResumeUrl(d.resumeUrl);
      }
    }).catch(() => {});
  }, []);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.updateProfile({
        ...form,
        cgpa: parseFloat(form.cgpa),
        experienceMonths: parseInt(form.experienceMonths)
      });
      if (resume) {
        await studentService.uploadResume(resume);
        toast.success('Resume uploaded!');
      }
      setSaved(true);
      toast.success('Profile updated! Calculating your matches...');
      setTimeout(() => navigate('/student/dashboard'), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const completionPct = (() => {
    let score = 0;
    if (form.cgpa) score += 25;
    if (form.skills.length > 0) score += 25;
    if (form.preferredDomain) score += 25;
    if (form.preferredLocation) score += 25;
    return score;
  })();

  return (
    <div className="profile-setup">
      <div className="container profile-setup__inner">
        <div className="profile-setup__header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/student/profile')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0 0', color: 'inherit' }}
            >
              <ArrowLeft size={28} />
            </button>
            <div>
              <h1 style={{ marginTop: 0 }}>Complete Your Profile</h1>
              <p>This information powers your match score. The more you fill, the better your recommendations.</p>
            </div>
          </div>
          <div className="profile-setup__completion">
            <div className="profile-setup__completion-ring">
              <svg viewBox="0 0 60 60" width="60" height="60">
                <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-orange)" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26 * completionPct / 100} ${2 * Math.PI * 26}`}
                  strokeLinecap="round" transform="rotate(-90 30 30)" />
              </svg>
              <div className="profile-setup__completion-text">{completionPct}%</div>
            </div>
            <div>
              <div className="profile-setup__completion-label">Profile Complete</div>
              <div className="profile-setup__completion-sub">Fill all 4 fields for best matches</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-setup__form">
          {/* CGPA */}
          <div className="profile-setup__section">
            <h3 className="profile-setup__section-title">
              <span className="profile-setup__section-num">01</span> Academic Score
            </h3>
            <div className="profile-setup__field">
              <label className="form-label">Current CGPA (out of 10)</label>
              <input
                type="number"
                className="form-input"
                placeholder="8.5"
                min="0" max="10" step="0.1"
                value={form.cgpa}
                onChange={e => {
                  let val = e.target.value;
                  if (val !== '' && parseFloat(val) > 10) val = '10';
                  if (val !== '' && parseFloat(val) < 0) val = '0';
                  setForm(f => ({ ...f, cgpa: val }));
                }}
                style={{ maxWidth: 200 }}
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div className="profile-setup__section">
            <h3 className="profile-setup__section-title">
              <span className="profile-setup__section-num">02</span> Technical Skills
              <span className="profile-setup__section-badge">{form.skills.length} added</span>
            </h3>
            <div className="profile-setup__skill-input">
              <input
                type="text"
                className="form-input"
                placeholder="Type a skill and press Enter (e.g., React, Java)"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); }
                }}
              />
              <button type="button" className="btn btn-primary btn-sm" onClick={() => addSkill(skillInput)}>
                <Plus size={16} /> Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="profile-setup__skills">
                {form.skills.map(s => (
                  <span key={s} className="profile-setup__skill-tag">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="profile-setup__popular-skills">
              <p className="profile-setup__popular-label">Popular skills:</p>
              {POPULAR_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 10).map(s => (
                <button key={s} type="button" className="profile-setup__popular-btn" onClick={() => addSkill(s)}>
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Domain + Location */}
          <div className="profile-setup__section">
            <h3 className="profile-setup__section-title">
              <span className="profile-setup__section-num">03</span> Preferences
            </h3>
            <div className="profile-setup__row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Preferred Domain</label>
                <select
                  className="form-input form-select"
                  value={form.preferredDomain}
                  onChange={e => setForm(f => ({ ...f, preferredDomain: e.target.value }))}
                  required
                >
                  <option value="">Select your interest area</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Preferred Location</label>
                <select
                  className="form-input form-select"
                  value={form.preferredLocation}
                  onChange={e => setForm(f => ({ ...f, preferredLocation: e.target.value }))}
                  required
                >
                  <option value="">Select location preference</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 240 }}>
              <label className="form-label">Prior Experience (months)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0" max="120"
                value={form.experienceMonths}
                onChange={e => setForm(f => ({ ...f, experienceMonths: e.target.value }))}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="profile-setup__section">
            <h3 className="profile-setup__section-title">
              <span className="profile-setup__section-num">04</span>
              Resume
              {(existingResumeUrl || resume) && (
                <span className="profile-setup__section-badge" style={{ color: '#15803D', background: '#DCFCE7', borderColor: '#86EFAC' }}>
                  ✓ Uploaded
                </span>
              )}
            </h3>

            {/* Hidden file input — always present */}
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={e => {
                setResume(e.target.files[0] || null);
                setShowDropzone(false); // collapse dropzone after selection
              }}
            />

            {/* ── CASE A: Newly selected file (overrides everything) ── */}
            {resume && (
              <div className="ps-resume-current">
                <div className="ps-resume-current__left">
                  <CheckCircle size={20} color="#15803D" />
                  <div>
                    <p className="ps-resume-current__name">{resume.name}</p>
                    <p className="ps-resume-current__meta">{(resume.size / 1024).toFixed(0)} KB · Ready to save</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="ps-resume-current__replace-btn"
                  onClick={() => { setResume(null); setShowDropzone(true); }}
                >
                  <X size={14} /> Remove
                </button>
              </div>
            )}

            {/* ── CASE B: Existing resume from backend, no new file chosen ── */}
            {!resume && existingResumeUrl && !showDropzone && (
              <div className="ps-resume-current">
                <div className="ps-resume-current__left">
                  <FileText size={20} color="#15803D" />
                  <div>
                    <p className="ps-resume-current__name">Resume Uploaded</p>
                    <p className="ps-resume-current__meta">Saved from registration · ready for applications</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="ps-resume-current__replace-btn"
                  onClick={() => setShowDropzone(true)}
                >
                  ↑ Replace Resume
                </button>
              </div>
            )}

            {/* ── CASE C: No resume at all OR user clicked Replace ── */}
            {!resume && (!existingResumeUrl || showDropzone) && (
              <div
                className="profile-setup__upload"
                onClick={() => document.getElementById('resume-upload').click()}
              >
                <Upload size={28} />
                <p>{existingResumeUrl ? 'Choose a new file to replace your current resume' : 'Click to upload your resume'}</p>
                <span>PDF, DOC, DOCX — Max 5MB</span>
                {showDropzone && existingResumeUrl && (
                  <button
                    type="button"
                    className="ps-resume-cancel-replace"
                    onClick={e => { e.stopPropagation(); setShowDropzone(false); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading || saved}>
            {saved ? '✓ Saved! Redirecting...' : loading ? 'Saving...' : 'Save Profile & Find Matches →'}
          </button>
        </form>
      </div>
    </div>
  );
}
