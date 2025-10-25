import api from './api';

export const medicalHistoryService = {
  getPatientHistory: async (patientId: string) => {
    const response = await api.get(`/medical-history/${patientId}`);
    return response.data;
  },
  
  addHistoryEvent: async (data: any) => {
    const response = await api.post('/medical-history', data);
    return response.data;
  },
};