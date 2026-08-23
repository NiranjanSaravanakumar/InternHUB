import api from './api';

export const recruiterService = {

  // ── Post Internship ───────────────────────────────────────────────────
  postInternship: (data) =>
    api.post('/recruiter/internships', data),
    // data: { companyName, role, requiredSkills[], minimumCgpa, domain, location, stipend }

  // ── My Internships ────────────────────────────────────────────────────
  getMyInternships: () =>
    api.get('/recruiter/internships'),
    // Returns Internship[]: { id, companyName, role, requiredSkills (CSV string),
    //   minimumCgpa, domain, location, stipend, createdAt }

  // ── Delete ────────────────────────────────────────────────────────────
  deleteInternship: (id) =>
    api.delete(`/recruiter/internships/${id}`),

  // ── Applicants ────────────────────────────────────────────────────────
  getApplicants: (internshipId) =>
    api.get(`/recruiter/internships/${internshipId}/applicants`),
    // Returns ApplicantDTO[]: { applicationId, matchPercentage, status, appliedAt,
    //   studentId, studentName, studentEmail, phoneNumber, cgpa, skills[],
    //   preferredDomain, preferredLocation, collegeName, degree, department,
    //   passoutYear, resumeUrl }
};
