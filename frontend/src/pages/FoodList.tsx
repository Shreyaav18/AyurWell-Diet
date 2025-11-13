import React, { useState, useEffect } from 'react';
import { foodService, Food } from '../services/foodService';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await foodService.getCategories();
        setCategories(Array.isArray(response) ? response : (response.categories || []));
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
        setFoods(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch foods', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchFoods();
  }, [category, search]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Format numbers to 2 decimal places
  const formatNumber = (num: number): string => {
    return Number(num).toFixed(2);
  };

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
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <Link to="/dashboard" style={styles.navBrand}>
            <div style={styles.logoIcon}>🌿</div>
            <span style={styles.brandText}>Ayurwell</span>
          </Link>
          
          <div style={styles.navLinks}>
            <Link 
              to="/dashboard" 
              style={styles.navLink}
              onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Dashboard
            </Link>
            <Link 
              to="/patients" 
              style={styles.navLink}
              onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Patients
            </Link>
            <Link 
              to="/foods" 
              style={{...styles.navLink, ...styles.navLinkActive}}
            >
              Foods
            </Link>
          </div>

          <div style={styles.navRight}>
            <span style={styles.userName}>{user?.firstName}</span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#7d8f78';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#96A78D';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.maxWidth}>
          {/* Header */}
          <div style={styles.headerSection}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>Ayurvedic Food Database</h1>
              <p style={styles.subtitle}>
                Browse comprehensive food items with nutritional and Ayurvedic properties
              </p>
            </div>
            <div style={styles.statsContainer}>
              <div style={styles.statBadge}>
                <span style={styles.statNumber}>{foods.length}</span>
                <span style={styles.statText}>Foods</span>
              </div>
              <div style={styles.statBadge}>
                <span style={styles.statNumber}>{categories.length}</span>
                <span style={styles.statText}>Categories</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={styles.filterContainer}>
            <div style={getFilterGridStyle()}>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search foods by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📁</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.select}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Food Grid */}
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.loadingSpinner}>⏳</div>
              <p>Loading foods...</p>
            </div>
          ) : foods.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🥗</div>
              <h3 style={styles.emptyTitle}>No foods found</h3>
              <p style={styles.emptyText}>
                {search || category ? 'Try adjusting your filters' : 'No food items available'}
              </p>
            </div>
          ) : (
            <div style={getGridStyle()}>
              {foods.map((food) => (
                <div 
                  key={food._id} 
                  style={styles.foodCard}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(150, 167, 141, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(150, 167, 141, 0.08)';
                  }}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.foodTitle}>{food.name}</h3>
                    <span style={styles.categoryBadge}>{food.category}</span>
                  </div>

                  <div style={styles.nutritionSection}>
                    <h4 style={styles.sectionTitle}>Nutrition (per 100g)</h4>
                    <div style={styles.nutritionGrid}>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Calories</span>
                        <span style={styles.nutritionValue}>
                          {formatNumber(food.calories)} kcal
                        </span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Protein</span>
                        <span style={styles.nutritionValue}>
                          {formatNumber(food.protein)}g
                        </span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Carbs</span>
                        <span style={styles.nutritionValue}>
                          {formatNumber(food.carbs)}g
                        </span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Fat</span>
                        <span style={styles.nutritionValue}>
                          {formatNumber(food.fat)}g
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.ayurvedicSection}>
                    <h4 style={styles.sectionTitle}>Ayurvedic Properties</h4>
                    <div style={styles.propertyRow}>
                      <span style={styles.propertyLabel}>Rasa:</span>
                      <span style={styles.propertyValue}>
                        {food.ayurvedicProperties.rasa.join(', ')}
                      </span>
                    </div>
                    <div style={styles.propertyRow}>
                      <span style={styles.propertyLabel}>Virya:</span>
                      <span style={styles.propertyValue}>
                        {food.ayurvedicProperties.virya}
                      </span>
                    </div>
                    <div style={styles.propertyRow}>
                      <span style={styles.propertyLabel}>Suitable for:</span>
                      <div style={styles.doshaContainer}>
                        {food.suitableForDoshas.map((dosha) => (
                          <span key={dosha} style={styles.doshaBadge}>
                            {dosha}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #F0F0F0, #D9E9CF)',
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '2px solid #D9E9CF',
    padding: '1rem 1.5rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 8px rgba(150, 167, 141, 0.1)',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.625rem',
    background: 'linear-gradient(135deg, #96A78D, #B6CEB4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 2px 8px rgba(150, 167, 141, 0.3)',
  },
  brandText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
  },
  navLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    padding: '0.5rem 0',
    borderBottom: '2px solid transparent',
  },
  navLinkActive: {
    color: '#96A78D',
    borderBottom: '2px solid #96A78D',
    fontWeight: '600',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#4a5568',
    fontSize: '0.9375rem',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#96A78D',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  mainContent: {
    padding: '2.5rem 1.5rem',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '2rem',
    flexWrap: 'wrap' as const,
  },
  headerLeft: {
    flex: 1,
    minWidth: '280px',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  statsContainer: {
    display: 'flex',
    gap: '1rem',
  },
  statBadge: {
    backgroundColor: 'white',
    padding: '0.875rem 1.25rem',
    borderRadius: '0.75rem',
    border: '2px solid #D9E9CF',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#96A78D',
  },
  statText: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.08)',
    marginBottom: '2rem',
    border: '2px solid #D9E9CF',
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
  inputWrapper: {
    position: 'relative' as const,
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.125rem',
    opacity: 0.5,
  },
  input: {
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #D9E9CF',
    borderRadius: '0.625rem',
    outline: 'none',
    width: '100%',
    fontSize: '0.9375rem',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
  },
  select: {
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #D9E9CF',
    borderRadius: '0.625rem',
    outline: 'none',
    width: '100%',
    fontSize: '0.9375rem',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '4rem 0',
    color: '#64748b',
  },
  loadingSpinner: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '2px solid #D9E9CF',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.25rem',
  },
  foodGridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
  },
  foodGridLg: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.25rem',
  },
  foodCard: {
    backgroundColor: 'white',
    padding: '1.75rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.08)',
    border: '2px solid #D9E9CF',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  },
  cardHeader: {
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #F0F0F0',
  },
  foodTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '0.375rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    backgroundColor: 'rgba(150, 167, 141, 0.15)',
    color: '#96A78D',
    textTransform: 'capitalize' as const,
  },
  nutritionSection: {
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#4a5568',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 0.875rem 0',
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
  },
  nutritionItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  nutritionLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '500',
  },
  nutritionValue: {
    fontSize: '0.9375rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  ayurvedicSection: {
    paddingTop: '1rem',
    borderTop: '2px solid #F0F0F0',
  },
  propertyRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.625rem',
    alignItems: 'flex-start',
  },
  propertyLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    minWidth: '90px',
  },
  propertyValue: {
    fontSize: '0.875rem',
    color: '#64748b',
    flex: 1,
    textTransform: 'capitalize' as const,
  },
  doshaContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    flex: 1,
  },
  doshaBadge: {
    padding: '0.25rem 0.625rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: 'rgba(182, 206, 180, 0.3)',
    color: '#7d8f78',
    textTransform: 'capitalize' as const,
  },
};

export default FoodList;