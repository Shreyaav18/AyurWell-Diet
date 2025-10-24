import api from './api'; // Your axios instance

export const assessmentService = {
  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  
  submitAssessment: async (data: any) => {
    const response = await api.post('/assessments', data);
    return response.data;
  },
  
  getPatientAssessments: async (patientId: string) => {
    const response = await api.get(`/assessments/patient/${patientId}`);
    return response.data;
  },
};