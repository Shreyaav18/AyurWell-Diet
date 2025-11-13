import React, { useState, useEffect } from 'react';
import { foodService, Food } from '../services/foodService';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#4b5563',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  },
  filterGridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
  },
  select: {
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '3rem 0',
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  foodGridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  foodGridLg: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  foodCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  foodTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  category: {
    color: '#4b5563',
    marginBottom: '0.5rem',
  },
  details: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  detailItem: {
    marginBottom: '0.25rem',
  },
  rasaLabel: {
    fontWeight: '600',
    marginTop: '0.5rem',
  },
};

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await foodService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };
  

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await foodService.getAllFoods({
        search: search || undefined,
        category: category || undefined
      });
      setFoods(response.data.foods);
    } catch (error) {
      console.error('Failed to fetch foods', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
  fetchFoods();
}, [category, search]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await foodService.getCategories();
      console.log('Categories response:', response); // Add this
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await foodService.getAllFoods({
        search: search || undefined,
        category: category || undefined
      });
      console.log('Foods response:', response); // Add this
      console.log('Foods array:', response.data.foods); // Add this
      setFoods(response.data.foods);
    } catch (error) {
      console.error('Failed to fetch foods', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
  fetchFoods();
}, [category, search]);

  const getGridStyle = () => {
    if (windowWidth >= 1024) return styles.foodGridLg;
    if (windowWidth >= 768) return styles.foodGridMd;
    return styles.foodGrid;
  };

  const getFilterGridStyle = () => {
    return windowWidth >= 768 ? styles.filterGridMd : styles.filterGrid;
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Food Database</h1>
          <Link 
            to="/dashboard"
            style={styles.backButton}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
          >
            Back to Dashboard
          </Link>
        </div>

        <div style={styles.filterContainer}>
          <div style={getFilterGridStyle()}>
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={getGridStyle()}>
            {foods.map((food) => (
              <div key={food._id} style={styles.foodCard}>
                <h3 style={styles.foodTitle}>{food.name}</h3>
                <p style={styles.category}>{food.category}</p>
                <div style={styles.details}>
                  <p style={styles.detailItem}>Calories: {food.calories} kcal</p>
                  <p style={styles.detailItem}>Protein: {food.protein}g | Carbs: {food.carbs}g | Fat: {food.fat}g</p>
                  <p style={{...styles.detailItem, ...styles.rasaLabel}}>
                    Rasa: {food.ayurvedicProperties.rasa.join(', ')}
                  </p>
                  <p style={styles.detailItem}>Virya: {food.ayurvedicProperties.virya}</p>
                  <p style={styles.detailItem}>Suitable for: {food.suitableForDoshas.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;