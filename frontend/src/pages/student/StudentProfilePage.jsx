import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import {
  User, Mail, Phone, MapPin, GraduationCap, Calendar,
  Briefcase, Star, Clock, FileText, Edit3, Download,
  CheckCircle, BookOpen, Target, Award
} from 'lucide-react';
import './StudentProfilePage.css';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="sp-loading">
        <div className="sp-loading__spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const skillList = profile?.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const completionPct = (() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.cgpa) score += 25;
    if (skillList.length > 0) score += 25;
    if (profile.preferredDomain) score += 25;
    if (profile.preferredLocation) score += 25;
    return score;
  })();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="sp">
      <div className="container sp__inner">

        {/* ── Hero Card ── */}
        <div className="sp__hero">
          <div className="sp__hero-left">
            <div className="sp__avatar">{initials}</div>
            <div className="sp__hero-info">
              <h1 className="sp__name">{user?.name || '—'}</h1>
              <p className="sp__role-badge">Student · {profile?.preferredDomain || 'No domain set'}</p>
              <div className="sp__hero-meta">
                {user?.email && (
                  <span><Mail size={14} /> {user.email}</span>
                )}
                {profile?.preferredLocation && (
                  <span><MapPin size={14} /> {profile.preferredLocation}</span>
                )}
              </div>
            </div>
          </div>
          <div className="sp__hero-right">
            {/* Completion Ring */}
            <div className="sp__completion">
              <svg viewBox="0 0 64 64" width="64" height="64" className="sp__ring">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-orange)" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 28 * completionPct / 100} ${2 * Math.PI * 28}`}
                  strokeLinecap="round" transform="rotate(-90 32 32)" />
              </svg>
              <div className="sp__completion-pct">{completionPct}%</div>
              <p className="sp__completion-label">Profile Complete</p>
            </div>
            <Link to="/student/profile/edit" className="btn btn-primary btn-sm sp__edit-btn">
              <Edit3 size={14} /> Edit Profile
            </Link>
          </div>
        </div>

        {!profile && (
          <div className="sp__empty">
            <BookOpen size={40} />
            <h3>Profile Not Set Up Yet</h3>
            <p>Complete your profile to start getting matched with internships.</p>
            <Link to="/student/profile/edit" className="btn btn-primary">Set Up Profile</Link>
          </div>
        )}

        {profile && (
          <div className="sp__grid">

            {/* ── Academic Info ── */}
            <div className="sp__card">
              <div className="sp__card-header">
                <GraduationCap size={18} />
                <h3>Academic Details</h3>
              </div>
              <div className="sp__rows">
                <div className="sp__row">
                  <span className="sp__row-label"><BookOpen size={14} /> College</span>
                  <span className="sp__row-value">{profile.collegeName || '—'}</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><Award size={14} /> Degree</span>
                  <span className="sp__row-value">{profile.degree || '—'} · {profile.department || '—'}</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><Calendar size={14} /> Passout Year</span>
                  <span className="sp__row-value">{profile.passoutYear || '—'}</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><Star size={14} /> CGPA</span>
                  <span className="sp__row-value sp__row-value--highlight">{profile.cgpa ?? '—'} / 10</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><Calendar size={14} /> Date of Birth</span>
                  <span className="sp__row-value">
                    {profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Preferences ── */}
            <div className="sp__card">
              <div className="sp__card-header">
                <Target size={18} />
                <h3>Preferences</h3>
              </div>
              <div className="sp__rows">
                <div className="sp__row">
                  <span className="sp__row-label"><Briefcase size={14} /> Domain</span>
                  <span className="sp__row-value">{profile.preferredDomain || '—'}</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><MapPin size={14} /> Location</span>
                  <span className="sp__row-value">{profile.preferredLocation || '—'}</span>
                </div>
                <div className="sp__row">
                  <span className="sp__row-label"><Clock size={14} /> Experience</span>
                  <span className="sp__row-value">
                    {profile.experienceMonths != null
                      ? profile.experienceMonths === 0
                        ? 'No prior experience'
                        : `${profile.experienceMonths} month${profile.experienceMonths !== 1 ? 's' : ''}`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="sp__card sp__card--wide">
              <div className="sp__card-header">
                <CheckCircle size={18} />
                <h3>Technical Skills</h3>
                <span className="sp__card-badge">{skillList.length} skills</span>
              </div>
              {skillList.length > 0 ? (
                <div className="sp__skills">
                  {skillList.map(skill => (
                    <span key={skill} className="sp__skill-tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="sp__empty-text">No skills added yet. <Link to="/student/profile/edit">Add skills →</Link></p>
              )}
            </div>

            {/* ── Resume ── */}
            <div className="sp__card sp__card--wide">
              <div className="sp__card-header">
                <FileText size={18} />
                <h3>Resume</h3>
              </div>
              {profile.resumeUrl ? (
                <div className="sp__resume">
                  <div className="sp__resume-icon"><FileText size={28} /></div>
                  <div className="sp__resume-info">
                    <p className="sp__resume-name">resume.pdf</p>
                    <p className="sp__resume-sub">Uploaded · Ready for applications</p>
                  </div>
                  <a
                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'}/${profile.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ) : (
                <div className="sp__resume-empty">
                  <FileText size={32} />
                  <p>No resume uploaded yet.</p>
                  <Link to="/student/profile/edit" className="btn btn-outline btn-sm">Upload Resume</Link>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
