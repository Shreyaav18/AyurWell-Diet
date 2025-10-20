import api from './api';

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  doshaType: string;
  medicalConditions: string[];
  allergies: string[];
  height: number;
  weight: number;
  activityLevel: string;
  doctorId: string;
}

export const patientService = {
  getAll: async (params?: any) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  getBMI: async (id: string) => {
    const response = await api.get(`/patients/${id}/bmi`);
    return response.data;
  }
};