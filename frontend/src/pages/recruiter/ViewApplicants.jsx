import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { ArrowLeft, Download, User, GraduationCap, MapPin, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import './ViewApplicants.css';

export default function ViewApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recruiterService.getApplicants(id)
      .then(res => setApplicants(res.data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#DCFCE7', color: '#15803D' };
    if (score >= 60) return { bg: '#FFEDD5', color: '#EA580C' };
    return { bg: '#F3F4F6', color: '#6B7280' };
  };

  return (
    <div className="view-applicants">
      <div className="container">
        <div className="view-applicants__header">
          <Link to="/recruiter/dashboard" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h1>Applicants</h1>
            <p>{applicants.length} candidate{applicants.length !== 1 ? 's' : ''} applied · Sorted by match score</p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)}
          </div>
        ) : applicants.length === 0 ? (
          <div className="view-applicants__empty">
            <User size={48} />
            <h3>No applications yet</h3>
            <p>Applications will appear here once candidates start applying.</p>
          </div>
        ) : (
          <div className="view-applicants__list">
            {[...applicants]
              .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
              .map((applicant, idx) => {
                const scoreStyle = getScoreColor(applicant.matchScore || 0);
                return (
                  <div key={applicant.applicationId} className={`applicant-card ${idx < 3 ? 'applicant-card--top' : ''}`}>
                    <div className="applicant-card__rank">#{idx + 1}</div>

                    <div className="applicant-card__avatar">{applicant.studentName?.charAt(0)}</div>

                    <div className="applicant-card__info">
                      <div className="applicant-card__name-row">
                        <h3>{applicant.studentName}</h3>
                        {idx < 3 && <span className="badge badge-orange">Top Pick</span>}
                      </div>
                      <p className="applicant-card__email">{applicant.studentEmail}</p>

                      <div className="applicant-card__details">
                        <span><GraduationCap size={13} /> {applicant.degree} · {applicant.department}</span>
                        <span><User size={13} /> CGPA: {applicant.cgpa || 'N/A'}</span>
                        {applicant.preferredLocation && <span><MapPin size={13} /> {applicant.preferredLocation}</span>}
                        <span>Passout: {applicant.passoutYear}</span>
                      </div>

                      {applicant.skills?.length > 0 && (
                        <div className="applicant-card__skills">
                          {applicant.skills.slice(0, 6).map(s => (
                            <span key={s} className="badge badge-gray">{s}</span>
                          ))}
                          {applicant.skills.length > 6 && (
                            <span className="badge badge-gray">+{applicant.skills.length - 6}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="applicant-card__right">
                      <div className="applicant-card__score"
                        style={{ background: scoreStyle.bg, color: scoreStyle.color }}>
                        <Zap size={14} />
                        {applicant.matchPercentage?.toFixed(1) || 0}% Match
                      </div>
                      <span className={`badge applicant-card__status badge-${
                        applicant.status === 'SHORTLISTED' ? 'green' :
                        applicant.status === 'REJECTED' ? 'gray' : 'blue'
                      }`}>
                        {applicant.status}
                      </span>
                      {applicant.resumeUrl && (
                        <a
                          href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'}/${applicant.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="applicant-card__resume-btn"
                          title={`Download ${applicant.studentName}'s resume`}
                        >
                          <Download size={14} />
                          View Resume
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
