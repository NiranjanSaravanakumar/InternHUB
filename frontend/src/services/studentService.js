import api from './api';

export const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/student/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMatches: () => api.get('/student/matches'),
  applyForInternship: (id) => api.post(`/student/apply/${id}`),
  getMyApplications: () => api.get('/student/applications'),
};
