import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler } from './middleware/errorHandler';
import foodRoutes from './routes/foodRoutes';
import patientRoutes from './routes/patientRoutes';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import dietChartRoutes from './routes/dietChartRoutes';
import mealSuggestionRoutes from './routes/mealSuggestionRoutes';
import ayurvedicRoutes from './routes/ayurvedicRoutes';
// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/diet-charts', dietChartRoutes);
app.use('/api/meal-suggestions', mealSuggestionRoutes);
app.use('/api/ayurvedic', ayurvedicRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Ayurvedic Diet Management API is running',
    timestamp: new Date().toISOString()
  });
});


// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;