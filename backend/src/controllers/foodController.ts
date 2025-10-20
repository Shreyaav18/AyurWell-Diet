import { Request, Response } from 'express';
import FoodItem from '../models/FoodItem';

export const getAllFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      category, 
      cuisineType, 
      search, 
      dosha,
      page = 1, 
      limit = 20 
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (cuisineType) query.cuisineType = cuisineType;
    if (dosha) query.suitableForDoshas = dosha;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const foods = await FoodItem.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ name: 1 });

    const total = await FoodItem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        foods,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch foods'
    });
  }
};

export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await FoodItem.findById(req.params.id);

    if (!food) {
      res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { food }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch food'
    });
  }
};

export const createFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await FoodItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: { food }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create food'
    });
  }
};

export const updateFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: { food }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update food'
    });
  }
};

export const deleteFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await FoodItem.findByIdAndDelete(req.params.id);

    if (!food) {
      res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete food'
    });
  }
};

export const bulkImportFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { foods } = req.body;

    if (!Array.isArray(foods) || foods.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected array of foods'
      });
      return;
    }

    const result = await FoodItem.insertMany(foods, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Successfully imported ${result.length} food items`,
      data: { count: result.length }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to import foods'
    });
  }
};

export const getFoodCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await FoodItem.distinct('category');

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
};