import { MapPin, DollarSign, Zap, CheckCircle, Crown } from 'lucide-react';
import './InternshipCard.css';

export default function InternshipCard({ match, onApply, rank }) {
  const {
    internshipId, role, companyName, domain, location, stipend,
    requiredSkills, matchScore, matchedSkills,
    missingSkills, alreadyApplied, minimumCgpa
  } = match;

  const isTopThree = rank <= 3;
  const scoreColor = matchScore >= 80 ? '#15803D' : matchScore >= 60 ? '#F97316' : '#6B7280';
  const scoreBg = matchScore >= 80 ? '#DCFCE7' : matchScore >= 60 ? '#FFEDD5' : '#F3F4F6';

  return (
    <div className={`internship-card ${isTopThree ? 'internship-card--top' : ''}`}>
      {isTopThree && (
        <div className="internship-card__top-badge">
          <Crown size={12} />
          #{rank} Best Match
        </div>
      )}

      <div className="internship-card__header">
        <div className="internship-card__company-logo">
          {companyName?.charAt(0) || 'C'}
        </div>
        <div className="internship-card__title-block">
          <h3 className="internship-card__title">{role}</h3>
          <p className="internship-card__company">{companyName}</p>
        </div>
        <div className="internship-card__score" style={{ background: scoreBg, color: scoreColor }}>
          <Zap size={14} />
          {matchScore}%
        </div>
      </div>

      <div className="internship-card__meta">
        <span className="internship-card__meta-item">
          <MapPin size={13} />
          {location}
        </span>
        <span className="internship-card__meta-item">
          <DollarSign size={13} />
          ₹{stipend?.toLocaleString()}/mo
        </span>
        {minimumCgpa > 0 && (
          <span className="internship-card__meta-item">
            Min CGPA: {minimumCgpa}
          </span>
        )}
      </div>

      <div className="internship-card__domain">
        <span className="badge badge-blue">{domain}</span>
      </div>

      {requiredSkills?.length > 0 && (
        <div className="internship-card__skills">
          {requiredSkills.slice(0, 5).map((skill) => {
            const isMatched = matchedSkills?.includes(skill);
            return (
              <span
                key={skill}
                className={`internship-card__skill ${isMatched ? 'internship-card__skill--matched' : 'internship-card__skill--missing'}`}
              >
                {isMatched && <CheckCircle size={10} />}
                {skill}
              </span>
            );
          })}
          {requiredSkills.length > 5 && (
            <span className="internship-card__skill internship-card__skill--more">
              +{requiredSkills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="internship-card__footer">
        <div className="internship-card__match-bar">
          <div className="internship-card__match-bar-fill" style={{ width: `${matchScore}%`, background: scoreColor }} />
        </div>
        <button
          className={`btn btn-sm ${alreadyApplied ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => !alreadyApplied && onApply(internshipId)}
          disabled={alreadyApplied}
        >
          {alreadyApplied ? '✓ Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}
