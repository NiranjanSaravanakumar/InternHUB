import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { Plus, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './PostInternship.css';

const DOMAINS = ['Full-Stack', 'Machine Learning', 'Data Science', 'Frontend', 'Backend', 'DevOps', 'Mobile Development', 'Cybersecurity', 'Cloud Computing', 'UI/UX Design'];
const LOCATIONS = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Remote'];

export default function PostInternship() {
  const [form, setForm] = useState({
    title: '', company: '', description: '', requiredSkills: [],
    minCgpa: '', domain: '', location: '', stipend: '', durationMonths: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.requiredSkills.includes(trimmed)) {
      setForm(f => ({ ...f, requiredSkills: [...f.requiredSkills, trimmed] }));
    }
    setSkillInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.requiredSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }
    setLoading(true);
    try {
      await recruiterService.postInternship({
        ...form,
        companyName: form.company,
        role: form.title,
        minimumCgpa: parseFloat(form.minCgpa) || 0,
        stipend: parseInt(form.stipend),
        durationMonths: parseInt(form.durationMonths) || null
      });
      toast.success('Internship posted successfully! 🎉');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-internship">
      <div className="container post-internship__inner">
        <div className="post-internship__header">
          <Link to="/recruiter/dashboard" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1>Post New Internship</h1>
          <p>Fill in the details below. Our algorithm will match you with the best-fit candidates.</p>
        </div>

        <form onSubmit={handleSubmit} className="post-internship__form">
          {/* Basic Info */}
          <div className="post-internship__section">
            <h3><span className="post-internship__num">01</span> Role Details</h3>
            <div className="post-internship__row">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="React / Java Developer"
                  value={form.title} onChange={e => update('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" placeholder="TechNova Solutions"
                  value={form.company} onChange={e => update('company', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea className="form-input post-internship__textarea"
                placeholder="Describe the role, responsibilities, and what the intern will learn..."
                value={form.description} onChange={e => update('description', e.target.value)} rows={4} />
            </div>
          </div>

          {/* Requirements */}
          <div className="post-internship__section">
            <h3><span className="post-internship__num">02</span> Matching Criteria</h3>
            <div className="form-group">
              <label className="form-label">Required Skills *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="form-input" style={{ flex: 1 }} placeholder="e.g., React, Spring Boot, MySQL"
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
                <button type="button" className="btn btn-primary btn-sm" onClick={() => addSkill(skillInput)}>
                  <Plus size={16} /> Add
                </button>
              </div>
              {form.requiredSkills.length > 0 && (
                <div className="post-internship__skills">
                  {form.requiredSkills.map(s => (
                    <span key={s} className="post-internship__skill-tag">
                      {s}
                      <button type="button" onClick={() => setForm(f => ({ ...f, requiredSkills: f.requiredSkills.filter(x => x !== s) }))}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="post-internship__row">
              <div className="form-group">
                <label className="form-label">Domain / Field *</label>
                <select className="form-input form-select" value={form.domain}
                  onChange={e => update('domain', e.target.value)} required>
                  <option value="">Select Domain</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum CGPA</label>
                <input type="number" className="form-input" placeholder="7.5 (leave 0 for none)"
                  min="0" max="10" step="0.1"
                  value={form.minCgpa} onChange={e => {
                    let val = e.target.value;
                    if (val !== '' && parseFloat(val) > 10) val = '10';
                    if (val !== '' && parseFloat(val) < 0) val = '0';
                    update('minCgpa', val);
                  }} />
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="post-internship__section">
            <h3><span className="post-internship__num">03</span> Location & Compensation</h3>
            <div className="post-internship__row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <select className="form-input form-select" value={form.location}
                  onChange={e => update('location', e.target.value)} required>
                  <option value="">Select Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Stipend (₹) *</label>
                <input type="number" className="form-input" placeholder="15000"
                  min="0" value={form.stipend} onChange={e => update('stipend', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (months)</label>
                <input type="number" className="form-input" placeholder="3"
                  min="1" max="24" value={form.durationMonths} onChange={e => update('durationMonths', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="post-internship__cta">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Posting...' : '🚀 Post Internship'}
            </button>
            <Link to="/recruiter/dashboard" className="btn btn-outline btn-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
