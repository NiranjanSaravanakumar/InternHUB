import api from './api';

export const studentService = {

  // ── Profile ──────────────────────────────────────────────────────────
  getProfile: () =>
    api.get('/student/profile'),

  updateProfile: (data) =>
    api.put('/student/profile', data),
    // data: { cgpa, skills: [], preferredDomain, preferredLocation, experienceMonths }

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/student/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // ── Matches ───────────────────────────────────────────────────────────
  getMatches: () =>
    api.get('/student/matches'),
    // Returns MatchResultDTO[]: { internshipId, companyName, role, domain,
    //   location, stipend, minimumCgpa, requiredSkills[], matchScore,
    //   skillScore, domainScore, cgpaScore, locationScore,
    //   matchedSkills[], missingSkills[], alreadyApplied }

  // ── Apply ─────────────────────────────────────────────────────────────
  applyForInternship: (internshipId, assessmentScore) =>
    api.post(`/student/apply/${internshipId}`, { assessmentScore }),

  // ── Applications ──────────────────────────────────────────────────────
  getMyApplications: () =>
    api.get('/student/applications'),
    // Returns Application[]: { id, internship, matchPercentage, status, appliedAt }
};
