import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Building2, TrendingUp, MapPin, DollarSign, Star, CheckCircle, Zap, Target, Globe } from 'lucide-react';
import './LandingPage.css';

const SAMPLE_INTERNSHIPS = [
  {
    id: 1, title: 'React / Java Developer', company: 'TechNova Solutions',
    domain: 'Full-Stack', location: 'Bengaluru', stipend: 20000,
    skills: ['React', 'Spring Boot', 'MySQL', 'REST APIs'],
    match: 92
  },
  {
    id: 2, title: 'ML Engineer Intern', company: 'DataSpark AI',
    domain: 'Machine Learning', location: 'Remote', stipend: 18000,
    skills: ['Python', 'TensorFlow', 'Pandas', 'NumPy'],
    match: 87
  },
  {
    id: 3, title: 'Frontend Developer', company: 'PixelForge',
    domain: 'Frontend', location: 'Hyderabad', stipend: 15000,
    skills: ['React', 'TypeScript', 'CSS3', 'Figma'],
    match: 78
  },
];

const STATS = [
  { icon: Briefcase, value: '10K+', label: 'Internships' },
  { icon: Building2, value: '500+', label: 'Companies' },
  { icon: Users, value: '25K+', label: 'Students' },
  { icon: TrendingUp, value: '95%', label: 'Match Accuracy' },
];

const STEPS = [
  { num: '01', title: 'Build Your Profile', desc: 'Add your skills, CGPA, domain preference, and upload your resume in minutes.' },
  { num: '02', title: 'Discover Matches', desc: 'Our algorithm instantly scores every internship against your profile across 4 parameters.' },
  { num: '03', title: 'Apply with Confidence', desc: 'See exactly why you\'re a great fit and apply to your top-matched opportunities.' },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content animate-fadeInUp">
            <div className="hero__eyebrow">
              <Zap size={14} />
              AI-Powered Skill Matching
            </div>
            <h1 className="hero__heading">
              Find the <span className="hero__highlight">Right Internship.</span><br />
              Build Your Future.
            </h1>
            <p className="hero__subtext">
              Stop scrolling through irrelevant postings. InternHUB matches your exact skills, CGPA, domain interest, and location against thousands of opportunities — giving you a precise match score for each.
            </p>
            <div className="hero__actions">
              <Link to="/register/student" className="btn btn-primary btn-lg">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Explore Internships
              </Link>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-avatars">
                {['A', 'R', 'S', 'M', 'K'].map((l, i) => (
                  <div key={i} className="hero__trust-avatar" style={{ zIndex: 5 - i }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="hero__trust-text">
                <strong>25,000+</strong> students already matched
              </p>
            </div>
          </div>

          <div className="hero__visual animate-fadeInUp delay-200">
            <div className="hero__card hero__card--student animate-float">
              <div className="hero__card-header">
                <div className="hero__card-avatar">A</div>
                <div>
                  <p className="hero__card-name">Aditya Kumar</p>
                  <p className="hero__card-sub">B.Tech CSE · CGPA 8.7</p>
                </div>
              </div>
              <div className="hero__card-skills">
                {['React', 'Spring Boot', 'MySQL'].map(s => (
                  <span key={s} className="badge badge-orange">{s}</span>
                ))}
              </div>
              <div className="hero__card-location">
                <MapPin size={12} /> Bengaluru
              </div>
            </div>

            <div className="hero__connector">
              <div className="hero__connector-line" />
              <div className="hero__connector-score">
                <Zap size={16} />
                92% Match
              </div>
              <div className="hero__connector-line" />
            </div>

            <div className="hero__card hero__card--company animate-float delay-300">
              <div className="hero__company-logo">T</div>
              <div>
                <p className="hero__card-name">TechNova Solutions</p>
                <p className="hero__card-sub">React / Java Developer</p>
              </div>
              <div className="hero__card-meta">
                <span><MapPin size={11} /> Bengaluru</span>
                <span><DollarSign size={11} /> ₹20K/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stats__item">
                <div className="stats__icon"><Icon size={22} /></div>
                <div className="stats__value">{value}</div>
                <div className="stats__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discovery Preview ── */}
      <section className="section preview" id="internships">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Internships Made <span>For You</span></h2>
            <p className="section-sub">Every result is ranked by your personal match score, not generic popularity.</p>
          </div>
          <div className="preview__grid">
            {SAMPLE_INTERNSHIPS.map((intern, idx) => (
              <div key={intern.id} className={`preview__card ${idx === 0 ? 'preview__card--top' : ''}`}>
                {idx === 0 && <div className="preview__card-badge"><Star size={12} /> #1 Best Match</div>}
                <div className="preview__card-header">
                  <div className="preview__company-logo">{intern.company.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="preview__card-title">{intern.title}</h3>
                    <p className="preview__card-company">{intern.company}</p>
                  </div>
                  <div className="preview__match-badge">{intern.match}% Match</div>
                </div>
                <div className="preview__card-meta">
                  <span><MapPin size={12} /> {intern.location}</span>
                  <span><DollarSign size={12} /> ₹{intern.stipend.toLocaleString()}/mo</span>
                </div>
                <div className="badge badge-blue preview__domain">{intern.domain}</div>
                <div className="preview__skills">
                  {intern.skills.map(s => (
                    <span key={s} className="badge badge-gray">{s}</span>
                  ))}
                </div>
                <Link to="/register/student" className="btn btn-outline-orange btn-sm btn-full">
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          <div className="preview__cta">
            <Link to="/register/student" className="btn btn-primary btn-lg">
              See All Matches <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Matching USP ── */}
      <section className="section matching-usp" id="how-matching-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Smart <span>Matching Engine</span></h2>
            <p className="section-sub">Four weighted parameters. One precise score.</p>
          </div>
          <div className="matching-usp__flow">
            <div className="matching-usp__node matching-usp__node--profile">
              <div className="matching-usp__node-icon"><Users size={24} /></div>
              <p>Your Profile</p>
            </div>
            <div className="matching-usp__arrow">→</div>
            <div className="matching-usp__params">
              {[
                { label: 'Skill Match', weight: '50%', desc: 'Technical & soft skills overlap' },
                { label: 'Domain Match', weight: '20%', desc: 'Interest area alignment' },
                { label: 'CGPA Match', weight: '15%', desc: 'Academic cutoff check' },
                { label: 'Location Match', weight: '15%', desc: 'City or Remote preference' },
              ].map(p => (
                <div key={p.label} className="matching-usp__param">
                  <div className="matching-usp__param-weight">{p.weight}</div>
                  <div className="matching-usp__param-label">{p.label}</div>
                  <div className="matching-usp__param-desc">{p.desc}</div>
                </div>
              ))}
            </div>
            <div className="matching-usp__arrow">→</div>
            <div className="matching-usp__node matching-usp__node--result">
              <div className="matching-usp__node-icon"><Target size={24} /></div>
              <div className="matching-usp__score">92%</div>
              <p>Match Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Companies ── */}
      <section className="section companies" id="companies">
        <div className="container">
          <div className="companies__inner">
            <div className="companies__content">
              <div className="section-eyebrow"><Building2 size={14} /> For Recruiters</div>
              <h2 className="section-title">Hire the <span>Next Generation</span> of Talent</h2>
              <p className="section-sub">Post your internship once. Our platform surfaces only the most qualified candidates ranked by match score — no more sifting through thousands of irrelevant applications.</p>
              <ul className="companies__features">
                {[
                  'Post internships in under 5 minutes',
                  'See pre-ranked applicants by match score',
                  'View full profile, CGPA, skills & resume',
                  'Track application status in real-time',
                ].map(f => (
                  <li key={f}><CheckCircle size={16} /> {f}</li>
                ))}
              </ul>
              <Link to="/register/recruiter" className="btn btn-primary btn-lg">
                Post an Internship <ArrowRight size={18} />
              </Link>
            </div>
            <div className="companies__visual">
              <div className="companies__card">
                <div className="companies__card-header">
                  <span className="badge badge-orange">3 Applicants</span>
                  <span className="badge badge-green">React / Java</span>
                </div>
                <h4>Top Applicants</h4>
                {[
                  { name: 'Aditya Kumar', match: 92, cgpa: 8.7 },
                  { name: 'Riya Sharma', match: 85, cgpa: 8.2 },
                  { name: 'Sanjay Mehta', match: 74, cgpa: 7.9 },
                ].map(a => (
                  <div key={a.name} className="companies__applicant">
                    <div className="companies__applicant-avatar">{a.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <p className="companies__applicant-name">{a.name}</p>
                      <p className="companies__applicant-cgpa">CGPA: {a.cgpa}</p>
                    </div>
                    <div className="companies__applicant-match">{a.match}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It <span>Works</span></h2>
            <p className="section-sub">Get matched and apply in three simple steps.</p>
          </div>
          <div className="how-it-works__steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className="how-it-works__step animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="how-it-works__num">{step.num}</div>
                <h3 className="how-it-works__title">{step.title}</h3>
                <p className="how-it-works__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="final-cta">
        <div className="container final-cta__inner">
          <Globe size={48} className="final-cta__icon" />
          <h2 className="final-cta__heading">Your Next Opportunity Starts Here</h2>
          <p className="final-cta__sub">Join 25,000+ students who found their perfect internship with InternHUB.</p>
          <div className="final-cta__actions">
            <Link to="/register/student" className="btn final-cta__btn-white btn-lg">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/register/recruiter" className="btn final-cta__btn-outline btn-lg">
              I'm a Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">
              <Briefcase size={18} />
              <span>Intern<b>HUB</b></span>
            </div>
            <p className="footer__tagline">Matching Skills. Building Futures.</p>
          </div>
          <div className="footer__links">
            {[
              { title: 'Platform', links: ['Find Internships', 'How It Works', 'For Companies', 'Pricing'] },
              { title: 'Students', links: ['Register', 'Login', 'Profile Setup', 'My Applications'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press Kit'] },
            ].map(col => (
              <div key={col.title} className="footer__col">
                <h4>{col.title}</h4>
                {col.links.map(l => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2025 InternHUB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
