import api from './api';

export const ayurvedicService = {
  validateCompliance: async (data: {
    items: Array<{ itemId: string; type: string; quantity: number }>;
    doshaType: string;
    season?: string;
  }) => {
    const response = await api.post('/ayurvedic/validate', data);
    return response.data;
  },
};