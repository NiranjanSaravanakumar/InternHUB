import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { generateAssessmentQuestions } from '../../services/groqService';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';
import './SkillAssessment.css';

const TOTAL_TIME = 10 * 60; // 10 minutes in seconds

export default function SkillAssessment({ internship, onComplete, onClose }) {
  const [phase, setPhase]         = useState('loading'); // 'loading' | 'quiz' | 'submitting'
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});        // { [index]: selectedLetter }
  const [current, setCurrent]     = useState(0);
  const [timeLeft, setTimeLeft]   = useState(TOTAL_TIME);
  const [error, setError]         = useState(null);

  const { role, companyName, requiredSkills, internshipId } = internship;

  // ── Load questions from Groq ────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuestions() {
      try {
        const skills = requiredSkills ?? [];
        const qs = await generateAssessmentQuestions(skills, role, companyName);
        if (!cancelled) {
          setQuestions(qs);
          setPhase('quiz');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to generate questions');
          setPhase('error');
        }
      }
    }
    fetchQuestions();
    return () => { cancelled = true; };
  }, [requiredSkills, role, companyName]);

  // ── Countdown timer ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (answersSnapshot) => {
    setPhase('submitting');

    // Calculate score
    const snap = answersSnapshot ?? answers;
    let score = 0;
    questions.forEach((q, i) => {
      const selected = snap[i];
      // correctAnswer might be "B" or "B. something" — normalise to first char
      const correct = (q.correctAnswer ?? '').trim().charAt(0).toUpperCase();
      const chose   = (selected ?? '').trim().charAt(0).toUpperCase();
      if (chose && chose === correct) score++;
    });

    try {
      await studentService.applyForInternship(internshipId, score);
      toast.success(`Application submitted! Score: ${score}/15`, { duration: 5000 });
      onComplete(score);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
      setPhase('quiz');
    }
  }, [answers, questions, internshipId, onComplete]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    if (timeLeft <= 0) {
      handleSubmit(answers);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, answers, handleSubmit]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isUrgent = timeLeft <= 60;

  // ── Render: Loading ─────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="sa-overlay">
        <div className="sa-loading-card">
          <div className="sa-loading-icon-wrap">
            <Brain size={40} className="sa-brain-icon" />
          </div>
          <h2 className="sa-loading-title">Generating Your Assessment</h2>
          <p className="sa-loading-sub">
            Our AI is crafting 15 personalised questions for <strong>{role}</strong> at <strong>{companyName}</strong>…
          </p>
          <div className="sa-loading-skills">
            {(requiredSkills ?? []).map(s => (
              <span key={s} className="sa-skill-chip">{s}</span>
            ))}
          </div>
          <div className="sa-loading-spinner-row">
            <Loader2 size={22} className="sa-spinner" />
            <span>Powered by Groq · llama3-8b-8192</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Error ───────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="sa-overlay">
        <div className="sa-loading-card">
          <AlertCircle size={40} color="#EF4444" />
          <h2 className="sa-loading-title" style={{ color: '#EF4444' }}>Assessment Unavailable</h2>
          <p className="sa-loading-sub">{error}</p>
          <p className="sa-loading-sub" style={{ fontSize: 13, color: '#9CA3AF' }}>
            Make sure <code>VITE_GROQ_API_KEY</code> is set in <code>frontend/.env</code>
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="sa-btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Submitting ──────────────────────────────────────────────────
  if (phase === 'submitting') {
    return (
      <div className="sa-overlay">
        <div className="sa-loading-card">
          <Loader2 size={40} className="sa-spinner" style={{ color: '#F97316' }} />
          <h2 className="sa-loading-title">Submitting Your Application…</h2>
          <p className="sa-loading-sub">Calculating your score and saving your application.</p>
        </div>
      </div>
    );
  }

  // ── Render: Quiz ────────────────────────────────────────────────────────
  const q = questions[current];
  const selectedAnswer = answers[current];

  return (
    <div className="sa-overlay">
      {/* ── Sticky Header ── */}
      <div className="sa-header">
        <div className="sa-header-left">
          <div className="sa-header-logo">{companyName?.charAt(0)}</div>
          <div>
            <div className="sa-header-role">{role}</div>
            <div className="sa-header-company">{companyName} · Skill Assessment</div>
          </div>
        </div>

        <div className="sa-header-center">
          <div className="sa-progress-bar-track">
            <div className="sa-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="sa-progress-label">{answeredCount}/{questions.length} answered</div>
        </div>

        <div className={`sa-timer ${isUrgent ? 'sa-timer--urgent' : ''}`}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* ── Main Quiz Body ── */}
      <div className="sa-body">
        <div className="sa-question-card">
          {/* Question number */}
          <div className="sa-question-meta">
            <span className="sa-q-number">Question {current + 1} of {questions.length}</span>
            {selectedAnswer && (
              <span className="sa-answered-badge">
                <CheckCircle size={13} /> Answered
              </span>
            )}
          </div>

          {/* Question text */}
          <h2 className="sa-question-text">{q?.question}</h2>

          {/* Options */}
          <div className="sa-options">
            {(q?.options ?? []).map((opt, oi) => {
              const letter = opt.trim().charAt(0).toUpperCase();
              const isSelected = selectedAnswer === letter;
              return (
                <button
                  key={oi}
                  className={`sa-option ${isSelected ? 'sa-option--selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, [current]: letter }))}
                >
                  <span className={`sa-option-letter ${isSelected ? 'sa-option-letter--selected' : ''}`}>
                    {letter}
                  </span>
                  <span className="sa-option-text">{opt.slice(2).trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="sa-nav">
            <button
              className="sa-btn-outline"
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="sa-dot-nav">
              {questions.map((_, i) => (
                <button
                  key={i}
                  className={`sa-dot ${answers[i] ? 'sa-dot--answered' : ''} ${i === current ? 'sa-dot--current' : ''}`}
                  onClick={() => setCurrent(i)}
                  title={`Question ${i + 1}`}
                />
              ))}
            </div>

            {current < questions.length - 1 ? (
              <button
                className="sa-btn-outline"
                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="sa-btn-submit"
                onClick={() => handleSubmit()}
              >
                Submit Assessment &amp; Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
