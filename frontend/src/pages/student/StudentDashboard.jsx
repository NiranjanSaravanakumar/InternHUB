import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import InternshipCard from '../../components/student/InternshipCard';
import FilterSidebar from '../../components/student/FilterSidebar';
import { Search, Crown, Zap, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: '', location: '', minStipend: 0, minMatch: 0, sortBy: 'match'
  });

  const loadMatches = async () => {
    setLoading(true);
    try {
      const res = await studentService.getMatches();
      setMatches(res.data);
    } catch (err) {
      toast.error('Failed to load matches. Please complete your profile first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  const handleApply = async (internshipId) => {
    try {
      await studentService.applyForInternship(internshipId);
      toast.success('Application submitted! 🎉');
      setMatches(prev => prev.map(m =>
        m.internshipId === internshipId ? { ...m, alreadyApplied: true } : m
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  // Filter + sort
  const filtered = matches
    .filter(m => {
      if (filters.domain && m.domain !== filters.domain) return false;
      if (filters.location && m.location !== filters.location) return false;
      if (filters.minStipend && m.stipend < filters.minStipend) return false;
      if (filters.minMatch && m.matchScore < filters.minMatch) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return m.title?.toLowerCase().includes(q) || m.company?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) =>
      filters.sortBy === 'stipend'
        ? (b.stipend || 0) - (a.stipend || 0)
        : b.matchScore - a.matchScore
    );

  const topThree = filtered.slice(0, 3);

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="student-dashboard__header">
        <div className="container">
          <div className="student-dashboard__welcome">
            <div>
              <h1 className="student-dashboard__title">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="student-dashboard__sub">
                {matches.length} internships found · Sorted by your match score
              </p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={loadMatches}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {/* Search */}
          <div className="student-dashboard__search">
            <Search size={18} className="student-dashboard__search-icon" />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="student-dashboard__search-input"
            />
          </div>
        </div>
      </div>

      <div className="container student-dashboard__body">
        {/* Top 3 Banner */}
        {!loading && topThree.length > 0 && (
          <div className="student-dashboard__top-section">
            <div className="student-dashboard__top-header">
              <Crown size={20} />
              <h2>Your Top 3 Matches</h2>
              <span className="badge badge-orange">Premium Picks</span>
            </div>
            <div className="student-dashboard__top-grid">
              {topThree.map((match, idx) => (
                <InternshipCard
                  key={match.internshipId}
                  match={match}
                  onApply={handleApply}
                  rank={idx + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="student-dashboard__main">
          <FilterSidebar filters={filters} onChange={setFilters} />
          <div className="student-dashboard__results">
            <div className="student-dashboard__results-header">
              <span className="student-dashboard__count">
                {filtered.length} results
              </span>
              <div className="student-dashboard__sort-info">
                <Zap size={14} />
                Sorted by {filters.sortBy === 'match' ? 'Best Match' : 'Highest Stipend'}
              </div>
            </div>

            {loading ? (
              <div className="student-dashboard__loading">
                {[1,2,3,4].map(i => (
                  <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="student-dashboard__empty">
                <div className="student-dashboard__empty-icon">🔍</div>
                <h3>No matches found</h3>
                <p>Try adjusting your filters or updating your profile skills.</p>
              </div>
            ) : (
              <div className="student-dashboard__cards">
                {filtered.map((match, idx) => (
                  <InternshipCard
                    key={match.internshipId}
                    match={match}
                    onApply={handleApply}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
