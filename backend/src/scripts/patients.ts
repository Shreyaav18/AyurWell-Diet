// src/scripts/patients.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../models/Patient';
import User from '../models/User'; // Assuming you have a User model

dotenv.config();

const indianPatients = [
  {
    name: "Rajesh Kumar Sharma",
    age: 45,
    height: 172,
    weight: 78,
    gender: "male",
    doshaType: "vata",
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Peanuts", "Dust"],
    activityLevel: "moderate"
  },
  {
    name: "Priya Patel",
    age: 32,
    height: 158,
    weight: 62,
    gender: "female",
    doshaType: "pitta",
    medicalConditions: ["PCOS", "Thyroid"],
    allergies: [],
    activityLevel: "active"
  },
  {
    name: "Amit Singh",
    age: 28,
    height: 178,
    weight: 85,
    gender: "male",
    doshaType: "kapha",
    medicalConditions: [],
    allergies: ["Shellfish"],
    activityLevel: "very-active"
  },
  {
    name: "Sunita Devi",
    age: 55,
    height: 152,
    weight: 68,
    gender: "female",
    doshaType: "vata-pitta",
    medicalConditions: ["Arthritis", "High Cholesterol"],
    allergies: ["Aspirin", "Dairy"],
    activityLevel: "light"
  },
  {
    name: "Vikram Reddy",
    age: 38,
    height: 175,
    weight: 82,
    gender: "male",
    doshaType: "pitta-kapha",
    medicalConditions: ["Gastric Issues"],
    allergies: [],
    activityLevel: "moderate"
  },
  {
    name: "Anjali Mehta",
    age: 29,
    height: 165,
    weight: 58,
    gender: "female",
    doshaType: "vata",
    medicalConditions: ["Anxiety", "Insomnia"],
    allergies: ["Gluten"],
    activityLevel: "moderate"
  },
  {
    name: "Suresh Iyer",
    age: 62,
    height: 168,
    weight: 75,
    gender: "male",
    doshaType: "kapha",
    medicalConditions: ["Heart Disease", "Diabetes"],
    allergies: ["Penicillin"],
    activityLevel: "light"
  },
  {
    name: "Deepika Nair",
    age: 35,
    height: 160,
    weight: 65,
    gender: "female",
    doshaType: "pitta",
    medicalConditions: ["Migraine"],
    allergies: ["Soy", "Eggs"],
    activityLevel: "active"
  },
  {
    name: "Arjun Gupta",
    age: 42,
    height: 180,
    weight: 90,
    gender: "male",
    doshaType: "vata-kapha",
    medicalConditions: ["Lower Back Pain"],
    allergies: [],
    activityLevel: "moderate"
  },
  {
    name: "Kavita Desai",
    age: 50,
    height: 155,
    weight: 70,
    gender: "female",
    doshaType: "kapha",
    medicalConditions: ["Osteoporosis", "Hypothyroidism"],
    allergies: ["Iodine"],
    activityLevel: "light"
  },
  {
    name: "Manish Chopra",
    age: 31,
    height: 173,
    weight: 72,
    gender: "male",
    doshaType: "pitta",
    medicalConditions: ["Acid Reflux"],
    allergies: ["Latex"],
    activityLevel: "active"
  },
  {
    name: "Neha Kapoor",
    age: 26,
    height: 162,
    weight: 55,
    gender: "female",
    doshaType: "vata",
    medicalConditions: ["Anemia"],
    allergies: ["Seafood"],
    activityLevel: "very-active"
  },
  {
    name: "Sanjay Rao",
    age: 48,
    height: 170,
    weight: 80,
    gender: "male",
    doshaType: "pitta-kapha",
    medicalConditions: ["Sleep Apnea"],
    allergies: [],
    activityLevel: "moderate"
  },
  {
    name: "Pooja Joshi",
    age: 33,
    height: 157,
    weight: 60,
    gender: "female",
    doshaType: "vata-pitta",
    medicalConditions: ["IBS"],
    allergies: ["Nuts", "Pollen"],
    activityLevel: "moderate"
  },
  {
    name: "Ravi Krishnan",
    age: 58,
    height: 176,
    weight: 88,
    gender: "male",
    doshaType: "kapha",
    medicalConditions: ["High Blood Pressure", "Obesity"],
    allergies: ["Sulfa drugs"],
    activityLevel: "light"
  }
];

const seedPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('🌐 Connected to MongoDB');

    // Find a doctor user to assign patients to
    // Option 1: Find first doctor in database
    const doctor = await User.findOne({ role: 'dietitian' });
    
    if (!doctor) {
      console.error('❌ No doctor found in database. Please create a doctor user first.');
      console.log('💡 You can create a doctor through your auth/register endpoint with role: "doctor"');
      process.exit(1);
    }

    console.log(`👨‍⚕️ Found doctor: ${doctor.firstName || doctor.email}`);

    // Add doctorId to all patients
    const patientsWithDoctor = indianPatients.map(patient => ({
      ...patient,
      doctorId: doctor._id
    }));

    // Insert patients
    const result = await Patient.insertMany(patientsWithDoctor);
    
    console.log(`✅ ${result.length} patients added successfully!`);
    console.log(`📊 Total patients in database: ${await Patient.countDocuments()}`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
    process.exit(1);
  }
};

seedPatients();