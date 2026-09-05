import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import InternshipCard from '../../components/student/InternshipCard';
import InternshipModal from '../../components/student/InternshipModal';
import FilterSidebar from '../../components/student/FilterSidebar';
import { Search, Crown, Zap, RefreshCw, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [filters, setFilters] = useState({
    domain: '', location: '', minStipend: 0, minMatch: 0, sortBy: 'match'
  });
  const [profile, setProfile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const [matchesRes, profileRes] = await Promise.all([
        studentService.getMatches(),
        studentService.getProfile()
      ]);
      setMatches(matchesRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      toast.error('Failed to load matches. Please complete your profile first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);



  const handleApply = async (internshipId, assessmentScore) => {
    if (!profile?.resumeUrl) {
      toast.error('Please upload your resume first');
      return;
    }
    try {
      await studentService.applyForInternship(internshipId, assessmentScore);
      setMatches(prev => prev.map(m =>
        m.internshipId === internshipId ? { ...m, alreadyApplied: true } : m
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleView = (internship) => setSelectedInternship(internship);
  const handleCloseModal = () => setSelectedInternship(null);
  // score is forwarded from SkillAssessment → InternshipModal → here (not used directly, SA handles the API call)
  const handleConfirmApply = async (internshipId, assessmentScore) => {
    await handleApply(internshipId, assessmentScore);
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

  // ── Profile completion (4 fields × 25%) ──────────────────────────────
  const skillList = (() => {
    if (!profile?.skills) return [];
    if (Array.isArray(profile.skillList) && profile.skillList.length > 0) return profile.skillList;
    if (typeof profile.skills === 'string' && profile.skills.trim())
      return profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  })();

  const completionPct = (() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.cgpa && profile.cgpa > 0) score += 25;
    if (skillList.length > 0)             score += 25;
    if (profile.preferredDomain)          score += 25;
    if (profile.preferredLocation)        score += 25;
    return score;
  })();

  const isProfileComplete = completionPct === 100;

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

        {/* ══ PROFILE COMPLETION WALL ══════════════════════════════════ */}
        {!loading && !isProfileComplete && (
          <div className="sd-profile-wall">
            {/* Animated progress ring */}
            <div className="sd-profile-wall__ring-wrap">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#FED7AA" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="#F97316" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34 * completionPct / 100} ${2 * Math.PI * 34}`}
                  transform="rotate(-90 40 40)"
                  className="sd-profile-wall__ring-progress"
                />
              </svg>
              <div className="sd-profile-wall__ring-pct">{completionPct}%</div>
            </div>

            <div className="sd-profile-wall__icon-wrap">
              <UserCog size={36} color="#F97316" strokeWidth={1.75} />
            </div>

            <h2 className="sd-profile-wall__heading">
              Complete your profile to unlock internship matches
            </h2>
            <p className="sd-profile-wall__sub">
              Our smart matching algorithm needs your full details — skills, CGPA, preferred domain &amp; location — to surface the best opportunities for you.
            </p>

            {/* Checklist */}
            <div className="sd-profile-wall__checklist">
              {[
                { label: 'CGPA added',             done: !!(profile?.cgpa && profile.cgpa > 0) },
                { label: 'Skills listed',           done: skillList.length > 0 },
                { label: 'Preferred domain set',    done: !!profile?.preferredDomain },
                { label: 'Preferred location set',  done: !!profile?.preferredLocation },
              ].map(({ label, done }) => (
                <div key={label} className={`sd-profile-wall__check-item ${done ? 'done' : ''}`}>
                  <span className="sd-profile-wall__check-dot">{done ? '✓' : '○'}</span>
                  {label}
                </div>
              ))}
            </div>

            <a href="/student/profile/edit" className="sd-profile-wall__cta">
              Complete My Profile →
            </a>
          </div>
        )}

        {/* ══ INTERNSHIP FEED (only when profile is 100%) ══════════════ */}
        {(loading || isProfileComplete) && (
          <>
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
                      onView={handleView}
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
          </>
        )}
      </div>
      {/* ── Internship Detail Modal ── */}
      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={handleCloseModal}
          onConfirmApply={handleConfirmApply}
        />
      )}
    </div>
  );
}
