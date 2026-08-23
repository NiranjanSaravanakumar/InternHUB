import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recruiterService } from '../../services/recruiterService';
import { Plus, Trash2, Users, Briefcase, MapPin, DollarSign, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import './RecruiterDashboard.css';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recruiterService.getMyInternships()
      .then(res => setInternships(res.data))
      .catch(() => toast.error('Failed to load internships'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship posting?')) return;
    try {
      await recruiterService.deleteInternship(id);
      setInternships(prev => prev.filter(i => i.id !== id));
      toast.success('Internship deleted');
    } catch {
      toast.error('Failed to delete internship');
    }
  };

  const totalApplications = internships.reduce((sum, i) => sum + (i.applicationCount || 0), 0);

  return (
    <div className="recruiter-dashboard">
      <div className="container">
        {/* Header */}
        <div className="recruiter-dashboard__header">
          <div>
            <h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p>{user?.name} · Recruiter Dashboard</p>
          </div>
          <Link to="/recruiter/post" className="btn btn-primary">
            <Plus size={18} /> Post New Internship
          </Link>
        </div>

        {/* Stats */}
        <div className="recruiter-dashboard__stats">
          {[
            { icon: Briefcase, label: 'Active Postings', value: internships.filter(i => i.active).length },
            { icon: Users, label: 'Total Applications', value: totalApplications },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="recruiter-dashboard__stat-card">
              <div className="recruiter-dashboard__stat-icon"><Icon size={24} /></div>
              <div className="recruiter-dashboard__stat-value">{value}</div>
              <div className="recruiter-dashboard__stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Internships Table */}
        <div className="recruiter-dashboard__table-wrap">
          <div className="recruiter-dashboard__table-header">
            <h2>Your Internship Postings</h2>
          </div>

          {loading ? (
            <div className="recruiter-dashboard__loading">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
            </div>
          ) : internships.length === 0 ? (
            <div className="recruiter-dashboard__empty">
              <Briefcase size={48} />
              <h3>No internships posted yet</h3>
              <p>Post your first internship to start receiving applications.</p>
              <Link to="/recruiter/post" className="btn btn-primary">Post Now</Link>
            </div>
          ) : (
            <div className="recruiter-dashboard__internships">
              {internships.map(intern => (
                <div key={intern.id} className="recruiter-card">
                  <div className="recruiter-card__logo">
                    {intern.company?.charAt(0) || 'C'}
                  </div>
                  <div className="recruiter-card__main">
                    <h3 className="recruiter-card__title">{intern.title}</h3>
                    <p className="recruiter-card__company">{intern.company}</p>
                    <div className="recruiter-card__meta">
                      <span className="badge badge-blue">{intern.domain}</span>
                      <span><MapPin size={12} /> {intern.location}</span>
                      <span><DollarSign size={12} /> ₹{intern.stipend?.toLocaleString()}/mo</span>
                      {intern.minCgpa > 0 && <span>Min CGPA: {intern.minCgpa}</span>}
                    </div>
                    <div className="recruiter-card__skills">
                      {intern.requiredSkills?.slice(0, 5).map(s => (
                        <span key={s} className="badge badge-gray">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="recruiter-card__actions">
                    <Link
                      to={`/recruiter/applicants/${intern.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye size={15} /> View Applicants
                    </Link>
                    <button
                      className="btn btn-sm recruiter-card__delete"
                      onClick={() => handleDelete(intern.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
