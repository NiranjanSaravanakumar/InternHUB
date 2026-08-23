import api from './api';

export const recruiterService = {
  postInternship: (data) => api.post('/recruiter/internships', data),
  getMyInternships: () => api.get('/recruiter/internships'),
  deleteInternship: (id) => api.delete(`/recruiter/internships/${id}`),
  getApplicants: (id) => api.get(`/recruiter/internships/${id}/applicants`),
};

export const internshipService = {
  getAll: (params) => api.get('/internships', { params }),
  getById: (id) => api.get(`/internships/${id}`),
};
