import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from  '../models/Patient';

dotenv.config();
const seedPatients = async () => {
  try {
    await mongoose.connect('process.env.MONGODB_URI || ');
    console.log('🌐 Connected to MongoDB');
    // Clear existing
    
    const patients = [
      {
    name: "Rajesh Kumar Sharma",
    age: 45,
    height: 172,
    weight: 78,
    gender: "Male",
    dosha_type: "Vata",
    medical_conditions: "Hypertension, Type 2 Diabetes",
    allergies: "Peanuts, Dust",
    activity_level: "Moderate"
  },
  {
    name: "Priya Patel",
    age: 32,
    height: 158,
    weight: 62,
    gender: "Female",
    dosha_type: "Pitta",
    medical_conditions: "PCOS, Thyroid",
    allergies: "None",
    activity_level: "High"
  },
  {
    name: "Amit Singh",
    age: 28,
    height: 178,
    weight: 85,
    gender: "Male",
    dosha_type: "Kapha",
    medical_conditions: "None",
    allergies: "Shellfish",
    activity_level: "Very Active"
  },
  {
    name: "Sunita Devi",
    age: 55,
    height: 152,
    weight: 68,
    gender: "Female",
    dosha_type: "Vata-Pitta",
    medical_conditions: "Arthritis, High Cholesterol",
    allergies: "Aspirin, Dairy",
    activity_level: "Low"
  },
  {
    name: "Vikram Reddy",
    age: 38,
    height: 175,
    weight: 82,
    gender: "Male",
    dosha_type: "Pitta-Kapha",
    medical_conditions: "Gastric Issues",
    allergies: "None",
    activity_level: "Moderate"
  },
  {
    name: "Anjali Mehta",
    age: 29,
    height: 165,
    weight: 58,
    gender: "Female",
    dosha_type: "Vata",
    medical_conditions: "Anxiety, Insomnia",
    allergies: "Gluten",
    activity_level: "Moderate"
  },
  {
    name: "Suresh Iyer",
    age: 62,
    height: 168,
    weight: 75,
    gender: "Male",
    dosha_type: "Kapha",
    medical_conditions: "Heart Disease, Diabetes",
    allergies: "Penicillin",
    activity_level: "Low"
  },
  {
    name: "Deepika Nair",
    age: 35,
    height: 160,
    weight: 65,
    gender: "Female",
    dosha_type: "Pitta",
    medical_conditions: "Migraine",
    allergies: "Soy, Eggs",
    activity_level: "High"
  },
  {
    name: "Arjun Gupta",
    age: 42,
    height: 180,
    weight: 90,
    gender: "Male",
    dosha_type: "Vata-Kapha",
    medical_conditions: "Lower Back Pain",
    allergies: "None",
    activity_level: "Moderate"
  },
  {
    name: "Kavita Desai",
    age: 50,
    height: 155,
    weight: 70,
    gender: "Female",
    dosha_type: "Kapha",
    medical_conditions: "Osteoporosis, Hypothyroidism",
    allergies: "Iodine",
    activity_level: "Low"
  },
  {
    name: "Manish Chopra",
    age: 31,
    height: 173,
    weight: 72,
    gender: "Male",
    dosha_type: "Pitta",
    medical_conditions: "Acid Reflux",
    allergies: "Latex",
    activity_level: "High"
  },
  {
    name: "Neha Kapoor",
    age: 26,
    height: 162,
    weight: 55,
    gender: "Female",
    dosha_type: "Vata",
    medical_conditions: "Anemia",
    allergies: "Seafood",
    activity_level: "Very Active"
  },
  {
    name: "Sanjay Rao",
    age: 48,
    height: 170,
    weight: 80,
    gender: "Male",
    dosha_type: "Kapha-Pitta",
    medical_conditions: "Sleep Apnea",
    allergies: "None",
    activity_level: "Moderate"
  },
  {
    name: "Pooja Joshi",
    age: 33,
    height: 157,
    weight: 60,
    gender: "Female",
    dosha_type: "Pitta-Vata",
    medical_conditions: "IBS",
    allergies: "Nuts, Pollen",
    activity_level: "Moderate"
  },
  {
    name: "Ravi Krishnan",
    age: 58,
    height: 176,
    weight: 88,
    gender: "Male",
    dosha_type: "Kapha",
    medical_conditions: "High Blood Pressure, Obesity",
    allergies: "Sulfa drugs",
    activity_level: "Low"
  }
    ];
    
    await Patient.insertMany(patients);
    console.log('✅ Patients seeded successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
  }
};

seedPatients();