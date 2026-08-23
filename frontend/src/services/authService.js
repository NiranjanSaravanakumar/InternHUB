import api from './api';

export const authService = {
  loginStudent: (data) => api.post('/auth/login', data),
  loginRecruiter: (data) => api.post('/auth/login', data),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerRecruiter: (data) => api.post('/auth/register/recruiter', data),
};
