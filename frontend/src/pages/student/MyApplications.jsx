import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './MyApplications.css';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getMyApplications()
      .then(res => setApplications(res.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    APPLIED: { label: 'Applied', class: 'badge-blue' },
    REVIEWED: { label: 'Under Review', class: 'badge-orange' },
    SHORTLISTED: { label: 'Shortlisted 🎉', class: 'badge-green' },
    REJECTED: { label: 'Not Selected', class: 'badge-gray' },
  };

  return (
    <div className="my-applications">
      <div className="container">
        <div className="my-applications__header">
          <h1>My Applications</h1>
          <p>{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="my-applications__empty">
            <Briefcase size={48} />
            <h3>No applications yet</h3>
            <p>Head to the dashboard to discover and apply for internships matched to your profile.</p>
            <Link to="/student/dashboard" className="btn btn-primary">
              Find Internships <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="my-applications__list">
            {applications.map(app => {
              const status = statusConfig[app.status] || statusConfig.APPLIED;
              const intern = app.internship;
              return (
                <div key={app.id} className="application-card">
                  <div className="application-card__logo">
                    {intern?.company?.charAt(0) || 'C'}
                  </div>
                  <div className="application-card__info">
                    <div className="application-card__title-row">
                      <h3>{intern?.role}</h3>
                      <span className={`badge ${status.class}`}>{status.label}</span>
                    </div>
                    <p className="application-card__company">{intern?.companyName}</p>
                    <div className="application-card__meta">
                      <span><MapPin size={12} /> {intern?.location}</span>
                      <span><DollarSign size={12} /> ₹{intern?.stipend?.toLocaleString()}/mo</span>
                      <span><Clock size={12} /> {intern?.durationMonths} months</span>
                      <span className="application-card__applied">
                        Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="application-card__match">
                    <div className="application-card__match-score">
                    {app.matchPercentage?.toFixed(0) ?? 0}%
                  </div>
                    <div className="application-card__match-label">Match</div>
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
