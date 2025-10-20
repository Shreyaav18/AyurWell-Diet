import api from './api';

export interface Food {
  _id: string;
  name: string;
  category: string;
  cuisineType: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ayurvedicProperties: {
    rasa: string[];
    virya: string;
    vipaka: string;
    guna: string[];
    digestibilityScore: number;
  };
  suitableForDoshas: string[];
}

export const foodService = {
  getAll: async (params?: any) => {
    const response = await api.get('/foods', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/foods', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/foods/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/foods/categories');
    return response.data;
  }
};