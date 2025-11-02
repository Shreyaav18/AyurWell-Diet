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
  getAllFoods: async (params?: { search?: string; category?: string; dosha?: string; page?: number; limit?: number }) => {
    const response = await api.get('/foods', { params });
    // Extract the foods array from nested structure
    return response.data.data.foods || [];
  },

  // Get food item by ID
  getFoodById: async (id: string) => {
    const response = await api.get(`/foods/${id}`);
    return response.data.data || response.data;
  },

  // Search foods
  searchFoods: async (query: string) => {
    const response = await api.get('/foods/search', {
      params: { q: query }
    });
    return response.data.data?.foods || response.data.foods || [];
  },

  // Get foods by category
  getFoodsByCategory: async (category: string) => {
    const response = await api.get('/foods/category', {
      params: { category }
    });
    return response.data.data?.foods || response.data.foods || [];
  },

  // Get dosha-compatible foods
  getDoshaCompatibleFoods: async (doshaType: string) => {
    const response = await api.get('/foods/dosha', {
      params: { doshaType }
    });
    return response.data.data?.foods || response.data.foods || [];
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
    return response.data.data || response.data;
  }
};
  
export default foodService;