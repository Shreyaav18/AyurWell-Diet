import api from './api';

export const mealSuggestionService = {
  // Generate meal suggestions
  generateSuggestions: async (params: {
    patientId: string;
    mealType: string;
    targetCalories: number;
    excludeFoodIds?: string[];
  }) => {
    const response = await api.post('/meal-suggestions/generate', params);
    return response.data;
  },
};