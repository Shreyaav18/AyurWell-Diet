/**
 * MongoDB Seeder Script for Indian Food Items
 * Place this file in: scripts/seedFoodItems.ts
 * Place JSON in: scripts/food_items.json
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// ============================================
// CONFIGURE THESE PATHS ACCORDING TO YOUR PROJECT
// ============================================

// Import your existing FoodItem model
// Adjust this path to match your project structure
import FoodItem from '../models/FoodItem'; // e.g., '../src/models/FoodItem'
// OR
// import FoodItem from '../src/models/FoodItem.model';
// OR
// import { FoodItem } from '../src/models';

// ============================================
// Configuration
// ============================================
const CONFIG = {
  // MongoDB Atlas URI from environment variable
  MONGODB_URI: process.env.MONGODB_URI || '',
  
  // Path to JSON file (relative to this script's location)
  JSON_FILE_PATH: path.join(__dirname, 'food_items.json'),
  
  // Batch size for insertion
  BATCH_SIZE: 100,
  
  // Clear existing data before seeding?
  CLEAR_EXISTING: false,
  
  // Collection name (optional - will use model's collection name by default)
  COLLECTION_NAME: 'fooditems'
};

// ============================================
// Helper Functions
// ============================================

/**
 * Validate environment variables
 */
function validateConfig(): void {
  if (!CONFIG.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI not found in environment variables!');
    console.error('💡 Make sure your .env file contains MONGODB_URI');
    process.exit(1);
  }
  
  if (!fs.existsSync(CONFIG.JSON_FILE_PATH)) {
    console.error(`❌ ERROR: JSON file not found at: ${CONFIG.JSON_FILE_PATH}`);
    console.error('💡 Make sure food_items.json is in the scripts folder');
    process.exit(1);
  }
}

/**
 * Connect to MongoDB Atlas
 */
async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(CONFIG.MONGODB_URI);
    
    // Wait for connection to be fully ready
    await mongoose.connection.asPromise();
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📁 Database: ${mongoose.connection.name || 'default'}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Load JSON data from file
 */
function loadJSONData(): any[] {
  try {
    const fileContent = fs.readFileSync(CONFIG.JSON_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log(`✅ Loaded ${data.length} food items from JSON`);
    return data;
  } catch (error) {
    console.error('❌ Error loading JSON file:', error);
    process.exit(1);
  }
}

/**
 * Clear existing data (if configured)
 */
async function clearExistingData(): Promise<void> {
  if (CONFIG.CLEAR_EXISTING) {
    try {
      const result = await FoodItem.deleteMany({});
      console.log(`🗑️  Cleared ${result.deletedCount} existing records`);
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      throw error;
    }
  }
}

/**
 * Validate a food item has required fields
 */
function validateFoodItem(item: any): boolean {
  const isValid = !!(item.name && item.category && item.cuisineType);
  if (!isValid) {
    console.log(`   ⚠️  Invalid item (missing required fields):`, {
      name: item.name || 'MISSING',
      category: item.category || 'MISSING',
      cuisineType: item.cuisineType || 'MISSING'
    });
  }
  return isValid;
}

/**
 * Insert data in batches with progress tracking
 */
async function insertInBatches(data: any[]): Promise<void> {
  const totalItems = data.length;
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log(`\n🚀 Starting batch insertion (${CONFIG.BATCH_SIZE} items per batch)...`);
  console.log(`📁 Collection: ${FoodItem.collection.name}`);
  console.log(`🗄️  Database: ${mongoose.connection.name || 'default'}`);
  
  // Check first item structure
  console.log('\n📋 Sample data (first item):');
  console.log(JSON.stringify(data[0], null, 2));

  for (let i = 0; i < totalItems; i += CONFIG.BATCH_SIZE) {
    const batch = data.slice(i, i + CONFIG.BATCH_SIZE);
    const validItems = batch.filter(validateFoodItem);
    
    const batchNum = Math.floor(i / CONFIG.BATCH_SIZE) + 1;
    console.log(`\n🔍 Batch ${batchNum}:`);
    console.log(`   Total in batch: ${batch.length}`);
    console.log(`   Valid items: ${validItems.length}`);
    console.log(`   Invalid items: ${batch.length - validItems.length}`);
    
    if (validItems.length === 0) {
      skippedCount += batch.length;
      console.log(`   ⚠️  No valid items in this batch - SKIPPING`);
      continue;
    }

    try {
      // Insert with explicit options
      const result = await FoodItem.insertMany(validItems, { 
        ordered: false,
        lean: false
      });
      
      insertedCount += result.length;
      console.log(`   ✅ Successfully inserted: ${result.length} items`);
      
      const progress = Math.min(((i + CONFIG.BATCH_SIZE) / totalItems) * 100, 100);
      console.log(`   📊 Overall Progress: ${progress.toFixed(1)}%`);
      
    } catch (error: any) {
      console.log(`   ❌ Error encountered:`, error.message);
      
      if (error.code) {
        console.log(`   Error code: ${error.code}`);
      }
      
      if (error.writeErrors && error.writeErrors.length > 0) {
        console.log(`   Write errors count: ${error.writeErrors.length}`);
        console.log(`   First write error:`, {
          code: error.writeErrors[0].code,
          message: error.writeErrors[0].errmsg
        });
        
        // Count successful inserts even with errors
        const insertedInBatch = error.insertedDocs?.length || 0;
        insertedCount += insertedInBatch;
        skippedCount += (validItems.length - insertedInBatch);
        console.log(`   Partially inserted: ${insertedInBatch} items`);
      } else if (error.code === 11000) {
        // Duplicate key error
        console.log(`   Duplicate key error - some items already exist`);
        skippedCount += validItems.length;
      } else {
        // Other errors
        errorCount += validItems.length;
        console.log(`   Critical error - batch failed completely`);
      }
    }
  }

  console.log('\n');
  console.log('═'.repeat(60));
  console.log('📊 SEEDING SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Successfully inserted: ${insertedCount}`);
  console.log(`⚠️  Skipped (duplicates/invalid): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total processed: ${totalItems}`);
  console.log('═'.repeat(60));
  
  // CRITICAL: Wait for MongoDB to commit all writes
  console.log('\n⏳ Waiting for database writes to commit...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('✅ Write commit wait completed');
}

/**
 * Display statistics about seeded data
 */
async function displayStatistics(): Promise<void> {
  try {
    console.log('\n🔍 DEBUG INFO:');
    console.log(`   Database: ${mongoose.connection.name || 'default'}`);
    console.log(`   Collection: ${FoodItem.collection.name}`);
    
    // List all collections
    try {
      const collections = await mongoose.connection.db?.listCollections().toArray();
      if (collections) {
        console.log(`   Available collections:`, collections.map(c => c.name).join(', '));
      }
    } catch (err) {
      console.log(`   Could not list collections`);
    }
    
    const totalCount = await FoodItem.countDocuments();
    
    console.log('\n📊 DATABASE STATISTICS');
    console.log('═'.repeat(60));
    console.log(`Total food items in database: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('\n⚠️  WARNING: No documents found in the database!');
      console.log('Possible reasons:');
      console.log('  1. Data validation failed (check logs above for invalid items)');
      console.log('  2. All items were duplicates (check if CLEAR_EXISTING is false)');
      console.log('  3. Model schema mismatch with JSON data structure');
      console.log('  4. Wrong database/collection being queried');
      console.log('\n💡 Try setting CLEAR_EXISTING to true and run again');
      return;
    }
    
    // Category distribution
    const categoryStats = await FoodItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Cuisine distribution (top 10)
    const cuisineStats = await FoodItem.aggregate([
      { $group: { _id: '$cuisineType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    console.log('\n📦 By Category:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });
    
    console.log('\n🍽️  By Cuisine Type (Top 10):');
    cuisineStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });
    
    console.log('═'.repeat(60));
    
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
  }
}

/**
 * Create indexes for better query performance
 */
async function createIndexes(): Promise<void> {
  try {
    console.log('\n🔍 Creating database indexes...');
    
    // Create indexes on commonly queried fields
    // Note: name index already exists as unique, so we skip it
    await FoodItem.collection.createIndex({ category: 1 });
    await FoodItem.collection.createIndex({ cuisineType: 1 });
    await FoodItem.collection.createIndex({ suitableForDoshas: 1 });
    await FoodItem.collection.createIndex({ 'ayurvedicProperties.digestibilityScore': -1 });
    
    console.log('✅ Indexes created successfully');
  } catch (error: any) {
    console.error('⚠️  Warning: Could not create some indexes:', error.message);
  }
}

// ============================================
// Main Seeding Function
// ============================================
async function seedDatabase(): Promise<void> {
  console.log('═'.repeat(60));
  console.log('🌱 MONGODB SEEDER - INDIAN FOOD ITEMS');
  console.log('═'.repeat(60));
  console.log(`📅 Started at: ${new Date().toLocaleString()}\n`);
  
  try {
    // Step 1: Validate configuration
    validateConfig();
    
    // Step 2: Connect to database
    await connectDB();
    
    // Step 3: Load JSON data
    const foodData = loadJSONData();
    
    // Step 4: Clear existing data (if configured)
    await clearExistingData();
    
    // Step 5: Insert data in batches
    await insertInBatches(foodData);
    
    // Step 6: Create indexes
    await createIndexes();
    
    // Step 7: Display statistics
    await displayStatistics();
    
    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`📅 Finished at: ${new Date().toLocaleString()}\n`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// ============================================
// Execute
// ============================================
seedDatabase();