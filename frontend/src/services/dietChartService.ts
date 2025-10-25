import api from './api';

export const dietChartService = {
  getPatientDietCharts: async (patientId: string) => {
    const response = await api.get(`/diet-charts/patient/${patientId}`);
    return response.data;
  },
  
  getDietChartById: async (id: string) => {
    const response = await api.get(`/diet-charts/${id}`);
    return response.data;
  },
  
  createDietChart: async (data: any) => {
    const response = await api.post('/diet-charts', data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/diet-charts/${id}/status`, { status });
    return response.data;
  },
  
  deleteDietChart: async (id: string) => {
    const response = await api.delete(`/diet-charts/${id}`);
    return response.data;
  }
};