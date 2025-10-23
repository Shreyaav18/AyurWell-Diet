import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Question } from '../models/Questions'

dotenv.config();
const questionsData = [
  // Physical Category
  {
    questionNumber: 1,
    category: 'physical',
    questionText: 'What is your body frame?',
    options: [
      {
        optionText: 'Thin, light, difficulty gaining weight',
        doshaType: 'vata'
      },
      {
        optionText: 'Medium, muscular, moderate weight',
        doshaType: 'pitta'
      },
      {
        optionText: 'Large, solid, gains weight easily',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 2,
    category: 'physical',
    questionText: 'What is your skin type?',
    options: [
      {
        optionText: 'Dry, rough, thin, cool to touch',
        doshaType: 'vata'
      },
      {
        optionText: 'Warm, oily, prone to rashes and inflammation',
        doshaType: 'pitta'
      },
      {
        optionText: 'Thick, moist, smooth, cool and pale',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 3,
    category: 'physical',
    questionText: 'What is your hair like?',
    options: [
      {
        optionText: 'Dry, thin, rough, prone to split ends',
        doshaType: 'vata'
      },
      {
        optionText: 'Fine, oily, early graying or thinning',
        doshaType: 'pitta'
      },
      {
        optionText: 'Thick, oily, wavy, lustrous',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 4,
    category: 'physical',
    questionText: 'How are your eyes?',
    options: [
      {
        optionText: 'Small, dry, active, darting movements',
        doshaType: 'vata'
      },
      {
        optionText: 'Sharp, penetrating, sensitive to light',
        doshaType: 'pitta'
      },
      {
        optionText: 'Large, calm, attractive, steady gaze',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 5,
    category: 'physical',
    questionText: 'How is your body temperature?',
    options: [
      {
        optionText: 'Cold hands and feet, prefer warm climate',
        doshaType: 'vata'
      },
      {
        optionText: 'Warm, prefer cool climate, dislike heat',
        doshaType: 'pitta'
      },
      {
        optionText: 'Moderate, adapt to most temperatures',
        doshaType: 'kapha'
      }
    ]
  },

  // Physiological Category
  {
    questionNumber: 6,
    category: 'physiological',
    questionText: 'How is your appetite?',
    options: [
      {
        optionText: 'Variable, irregular, often forget to eat',
        doshaType: 'vata'
      },
      {
        optionText: 'Strong, sharp, cannot skip meals',
        doshaType: 'pitta'
      },
      {
        optionText: 'Steady, can skip meals easily',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 7,
    category: 'physiological',
    questionText: 'How is your digestion?',
    options: [
      {
        optionText: 'Irregular, gas, bloating, constipation',
        doshaType: 'vata'
      },
      {
        optionText: 'Quick, strong, sometimes burning sensation',
        doshaType: 'pitta'
      },
      {
        optionText: 'Slow, heavy feeling after meals',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 8,
    category: 'physiological',
    questionText: 'What is your sleep pattern?',
    options: [
      {
        optionText: 'Light, interrupted, difficulty falling asleep',
        doshaType: 'vata'
      },
      {
        optionText: 'Moderate, sound, may wake feeling hot',
        doshaType: 'pitta'
      },
      {
        optionText: 'Deep, heavy, long duration, hard to wake',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 9,
    category: 'physiological',
    questionText: 'What is your energy level throughout the day?',
    options: [
      {
        optionText: 'Comes in bursts, tires easily',
        doshaType: 'vata'
      },
      {
        optionText: 'Moderate, consistent, good stamina',
        doshaType: 'pitta'
      },
      {
        optionText: 'Steady, slow to start but good endurance',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 10,
    category: 'physiological',
    questionText: 'How do you sweat?',
    options: [
      {
        optionText: 'Minimal sweating, even with exercise',
        doshaType: 'vata'
      },
      {
        optionText: 'Profuse sweating, strong body odor',
        doshaType: 'pitta'
      },
      {
        optionText: 'Moderate, pleasant smell',
        doshaType: 'kapha'
      }
    ]
  },

  // Mental Category
  {
    questionNumber: 11,
    category: 'mental',
    questionText: 'How is your memory?',
    options: [
      {
        optionText: 'Quick to learn, quick to forget',
        doshaType: 'vata'
      },
      {
        optionText: 'Sharp, clear, retentive',
        doshaType: 'pitta'
      },
      {
        optionText: 'Slow to learn, but never forget',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 12,
    category: 'mental',
    questionText: 'What is your thought process like?',
    options: [
      {
        optionText: 'Quick, restless, many thoughts at once',
        doshaType: 'vata'
      },
      {
        optionText: 'Sharp, logical, organized, focused',
        doshaType: 'pitta'
      },
      {
        optionText: 'Calm, slow, steady, methodical',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 13,
    category: 'mental',
    questionText: 'How do you handle stress?',
    options: [
      {
        optionText: 'Anxious, worried, nervous',
        doshaType: 'vata'
      },
      {
        optionText: 'Irritable, angry, frustrated',
        doshaType: 'pitta'
      },
      {
        optionText: 'Withdrawn, depressed, avoidant',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 14,
    category: 'mental',
    questionText: 'What is your speaking style?',
    options: [
      {
        optionText: 'Fast, talkative, rambling',
        doshaType: 'vata'
      },
      {
        optionText: 'Sharp, clear, argumentative',
        doshaType: 'pitta'
      },
      {
        optionText: 'Slow, melodious, monotonous',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 15,
    category: 'mental',
    questionText: 'How do you make decisions?',
    options: [
      {
        optionText: 'Quickly but often change mind',
        doshaType: 'vata'
      },
      {
        optionText: 'Decisively and stick to it',
        doshaType: 'pitta'
      },
      {
        optionText: 'Slowly, after much deliberation',
        doshaType: 'kapha'
      }
    ]
  },

  // Behavioral Category
  {
    questionNumber: 16,
    category: 'behavioral',
    questionText: 'How do you spend money?',
    options: [
      {
        optionText: 'Impulsively, on small things',
        doshaType: 'vata'
      },
      {
        optionText: 'Moderately, on quality items',
        doshaType: 'pitta'
      },
      {
        optionText: 'Carefully, save and accumulate',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 17,
    category: 'behavioral',
    questionText: 'What is your work style?',
    options: [
      {
        optionText: 'Creative, enthusiastic, erratic',
        doshaType: 'vata'
      },
      {
        optionText: 'Goal-oriented, intense, perfectionist',
        doshaType: 'pitta'
      },
      {
        optionText: 'Steady, reliable, methodical',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 18,
    category: 'behavioral',
    questionText: 'How do you react to change?',
    options: [
      {
        optionText: 'Love change and variety',
        doshaType: 'vata'
      },
      {
        optionText: 'Adapt if necessary',
        doshaType: 'pitta'
      },
      {
        optionText: 'Resist change, prefer routine',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 19,
    category: 'behavioral',
    questionText: 'What are your hobbies like?',
    options: [
      {
        optionText: 'Many interests, constantly changing',
        doshaType: 'vata'
      },
      {
        optionText: 'Competitive activities, sports',
        doshaType: 'pitta'
      },
      {
        optionText: 'Relaxing, sedentary activities',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 20,
    category: 'behavioral',
    questionText: 'How do you relate to others?',
    options: [
      {
        optionText: 'Enthusiastic, changeable friendships',
        doshaType: 'vata'
      },
      {
        optionText: 'Loyal but demanding',
        doshaType: 'pitta'
      },
      {
        optionText: 'Stable, long-lasting relationships',
        doshaType: 'kapha'
      }
    ]
  },

  // Additional Mixed Category Questions
  {
    questionNumber: 21,
    category: 'physical',
    questionText: 'What is your joint health like?',
    options: [
      {
        optionText: 'Cracking sounds, dry, stiff joints',
        doshaType: 'vata'
      },
      {
        optionText: 'Loose, flexible, prone to inflammation',
        doshaType: 'pitta'
      },
      {
        optionText: 'Strong, well-lubricated, stable',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 22,
    category: 'physiological',
    questionText: 'How is your thirst level?',
    options: [
      {
        optionText: 'Variable, irregular, sometimes forget to drink',
        doshaType: 'vata'
      },
      {
        optionText: 'Excessive thirst, need cold drinks',
        doshaType: 'pitta'
      },
      {
        optionText: 'Low thirst, can go long without water',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 23,
    category: 'mental',
    questionText: 'What is your emotional nature?',
    options: [
      {
        optionText: 'Anxious, fearful, insecure',
        doshaType: 'vata'
      },
      {
        optionText: 'Intense, passionate, jealous',
        doshaType: 'pitta'
      },
      {
        optionText: 'Calm, content, possessive',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 24,
    category: 'behavioral',
    questionText: 'How is your walking pace?',
    options: [
      {
        optionText: 'Fast, light steps, always in a hurry',
        doshaType: 'vata'
      },
      {
        optionText: 'Moderate, purposeful, determined',
        doshaType: 'pitta'
      },
      {
        optionText: 'Slow, steady, graceful',
        doshaType: 'kapha'
      }
    ]
  },
  {
    questionNumber: 25,
    category: 'physiological',
    questionText: 'How do you handle physical exercise?',
    options: [
      {
        optionText: 'Low stamina, tire quickly, need frequent breaks',
        doshaType: 'vata'
      },
      {
        optionText: 'Good stamina, enjoy competitive exercise',
        doshaType: 'pitta'
      },
      {
        optionText: 'High endurance, slow and steady pace',
        doshaType: 'kapha'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert questions
    const insertedQuestions = await Question.insertMany(questionsData);
    console.log(`Inserted ${insertedQuestions.length} questions`);

    console.log('\n✅ Seed data inserted successfully!');
    console.log(`\nBreakdown by category:`);
    console.log(`- Physical: 6 questions`);
    console.log(`- Physiological: 7 questions`);
    console.log(`- Mental: 6 questions`);
    console.log(`- Behavioral: 6 questions`);
    console.log(`- Total: 25 questions`);

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();