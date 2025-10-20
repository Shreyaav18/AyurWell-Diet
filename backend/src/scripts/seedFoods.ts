import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FoodItem from '../models/FoodItem';

dotenv.config();

const sampleFoods = [
  {
    name: 'Basmati Rice (cooked)',
    category: 'grains',
    cuisineType: 'indian',
    servingSize: 100,
    servingUnit: 'g',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    vitamins: { vitaminB12: 0, folate: 8 },
    minerals: { iron: 0.2, magnesium: 12 },
    ayurvedicProperties: {
      rasa: ['sweet'],
      virya: 'cold',
      vipaka: 'sweet',
      guna: ['heavy', 'oily'],
      digestibilityScore: 7
    },
    suitableForDoshas: ['pitta', 'vata'],
    seasonalRecommendation: ['all']
  },
  {
    name: 'Moong Dal (cooked)',
    category: 'legumes',
    cuisineType: 'indian',
    servingSize: 100,
    servingUnit: 'g',
    calories: 105,
    protein: 7.0,
    carbs: 19,
    fat: 0.4,
    fiber: 7.6,
    vitamins: { folate: 159 },
    minerals: { iron: 1.4, magnesium: 48 },
    ayurvedicProperties: {
      rasa: ['sweet', 'astringent'],
      virya: 'cold',
      vipaka: 'sweet',
      guna: ['light', 'dry'],
      digestibilityScore: 9
    },
    suitableForDoshas: ['all'],
    seasonalRecommendation: ['all']
  },
  {
    name: 'Ghee',
    category: 'oils',
    cuisineType: 'indian',
    servingSize: 15,
    servingUnit: 'g',
    calories: 135,
    protein: 0,
    carbs: 0,
    fat: 15,
    fiber: 0,
    vitamins: { vitaminA: 108, vitaminE: 0.4 },
    minerals: {},
    ayurvedicProperties: {
      rasa: ['sweet'],
      virya: 'cold',
      vipaka: 'sweet',
      guna: ['oily', 'soft'],
      digestibilityScore: 10
    },
    suitableForDoshas: ['all'],
    seasonalRecommendation: ['all']
  },
  {
    name: 'Spinach (cooked)',
    category: 'vegetables',
    cuisineType: 'indian',
    servingSize: 100,
    servingUnit: 'g',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.3,
    fiber: 2.2,
    vitamins: { vitaminA: 469, vitaminC: 9.8, vitaminK: 483 },
    minerals: { iron: 2.7, calcium: 99, magnesium: 79 },
    ayurvedicProperties: {
      rasa: ['bitter', 'astringent'],
      virya: 'cold',
      vipaka: 'pungent',
      guna: ['light', 'dry'],
      digestibilityScore: 6
    },
    suitableForDoshas: ['pitta', 'kapha'],
    seasonalRecommendation: ['winter', 'spring']
  },
  {
    name: 'Ginger (fresh)',
    category: 'spices',
    cuisineType: 'indian',
    servingSize: 5,
    servingUnit: 'g',
    calories: 4,
    protein: 0.1,
    carbs: 0.9,
    fat: 0,
    fiber: 0.1,
    vitamins: { vitaminC: 0.25 },
    minerals: { potassium: 21 },
    ayurvedicProperties: {
      rasa: ['pungent', 'sweet'],
      virya: 'hot',
      vipaka: 'sweet',
      guna: ['hot', 'light'],
      digestibilityScore: 9
    },
    suitableForDoshas: ['vata', 'kapha'],
    seasonalRecommendation: ['winter', 'autumn']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');

    await FoodItem.deleteMany({});
    console.log('Cleared existing food items');

    await FoodItem.insertMany(sampleFoods);
    console.log(`Inserted ${sampleFoods.length} food items`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();