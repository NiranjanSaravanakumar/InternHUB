import { useEffect, useState } from 'react';
import {
  X, MapPin, DollarSign, Zap, CheckCircle, XCircle,
  Building2, GraduationCap, Layers, Briefcase, Clock, Send
} from 'lucide-react';
import './InternshipModal.css';

export default function InternshipModal({ internship, onClose, onConfirmApply }) {
  const [applying, setApplying] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const {
    role, companyName, domain, location, stipend,
    requiredSkills, matchScore, matchedSkills, missingSkills, minimumCgpa,
    skillScore, domainScore, cgpaScore, locationScore
  } = internship;

  const scoreColor = matchScore >= 80 ? '#15803D' : matchScore >= 60 ? '#F97316' : '#6B7280';
  const scoreBg   = matchScore >= 80 ? '#DCFCE7' : matchScore >= 60 ? '#FFEDD5' : '#F3F4F6';

  const handleApply = async () => {
    setApplying(true);
    await onConfirmApply(internship.internshipId);
    setApplying(false);
    onClose();
  };

  const scoreBreakdown = [
    { label: 'Skill Match',    value: skillScore,    weight: '50%', color: '#F97316' },
    { label: 'Domain Match',   value: domainScore,   weight: '20%', color: '#8B5CF6' },
    { label: 'CGPA Match',     value: cgpaScore,     weight: '15%', color: '#0EA5E9' },
    { label: 'Location Match', value: locationScore, weight: '15%', color: '#10B981' },
  ];

  return (
    <div className="im-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="im-panel" role="dialog" aria-modal="true" aria-label={`${role} at ${companyName}`}>

        {/* ── Header ── */}
        <div className="im-header">
          <div className="im-header-left">
            <div className="im-logo">{companyName?.charAt(0)}</div>
            <div>
              <h2 className="im-title">{role}</h2>
              <p className="im-company"><Building2 size={13} /> {companyName}</p>
            </div>
          </div>
          <div className="im-header-right">
            <div className="im-score" style={{ background: scoreBg, color: scoreColor }}>
              <Zap size={16} /> {matchScore}% Match
            </div>
            <button className="im-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="im-body">

          {/* Quick Info Chips */}
          <div className="im-chips">
            <span className="im-chip"><MapPin size={13} /> {location}</span>
            <span className="im-chip"><DollarSign size={13} /> Rs.{stipend?.toLocaleString()}/mo</span>
            <span className="im-chip"><Layers size={13} /> {domain}</span>
            <span className="im-chip"><GraduationCap size={13} /> Min CGPA: {minimumCgpa}</span>
          </div>

          {/* Match Score Breakdown */}
          <div className="im-section">
            <h4 className="im-section-title"><Zap size={15} /> Match Score Breakdown</h4>
            <div className="im-breakdown">
              {scoreBreakdown.map(({ label, value, weight, color }) => (
                <div key={label} className="im-breakdown-row">
                  <div className="im-breakdown-meta">
                    <span className="im-breakdown-label">{label}</span>
                    <span className="im-breakdown-weight">{weight}</span>
                  </div>
                  <div className="im-breakdown-bar-track">
                    <div className="im-breakdown-bar-fill"
                      style={{ width: `${value ?? 0}%`, background: color }} />
                  </div>
                  <span className="im-breakdown-pct" style={{ color }}>{value ?? 0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="im-section">
            <h4 className="im-section-title"><Briefcase size={15} /> About the Role</h4>
            <p className="im-desc">
              As a <strong>{role}</strong> intern at <strong>{companyName}</strong>, you will work
              closely with senior engineers and product teams to build and ship real features.
              You will be involved in the full development lifecycle — from design discussions and
              code reviews to testing and deployment.
            </p>
            <ul className="im-desc-list">
              <li>Collaborate with the engineering team on day-to-day development tasks</li>
              <li>Write clean, maintainable, and well-tested code in a {domain} environment</li>
              <li>Participate in sprint planning, stand-ups, and retrospectives</li>
              <li>Learn from mentors and contribute meaningful features to the product</li>
              <li>Work in an {location === 'Remote' ? 'fully remote, async-first' : location + '-based'} team setup</li>
            </ul>
          </div>

          {/* Requirements */}
          <div className="im-section">
            <h4 className="im-section-title"><GraduationCap size={15} /> Requirements</h4>
            <div className="im-req-row">
              <span className="im-req-label"><Clock size={13} /> Duration</span>
              <span className="im-req-value">3 – 6 months</span>
            </div>
            <div className="im-req-row">
              <span className="im-req-label"><GraduationCap size={13} /> Min CGPA</span>
              <span className="im-req-value">{minimumCgpa} / 10</span>
            </div>
            <div className="im-req-row">
              <span className="im-req-label"><Layers size={13} /> Domain</span>
              <span className="im-req-value">{domain}</span>
            </div>
          </div>

          {/* Required Skills */}
          <div className="im-section">
            <h4 className="im-section-title"><CheckCircle size={15} /> Required Skills</h4>
            <div className="im-skills">
              {requiredSkills?.map(skill => {
                const matched = matchedSkills?.includes(skill);
                return (
                  <span key={skill} className={`im-skill ${matched ? 'im-skill--match' : 'im-skill--missing'}`}>
                    {matched ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {skill}
                  </span>
                );
              })}
            </div>
            {missingSkills?.length > 0 && (
              <p className="im-missing-hint">
                <XCircle size={12} /> You are missing {missingSkills.length} skill{missingSkills.length > 1 ? 's' : ''}:
                {' '}<strong>{missingSkills.join(', ')}</strong>
              </p>
            )}
          </div>

        </div>

        {/* ── Footer CTA ── */}
        <div className="im-footer">
          <button className="btn btn-outline btn-lg im-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-lg im-apply-btn"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? (
              <><span className="im-spinner" /> Submitting...</>
            ) : (
              <><Send size={16} /> Confirm & Apply Now</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
