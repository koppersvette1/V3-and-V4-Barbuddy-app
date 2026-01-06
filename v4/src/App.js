import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('cocktails');
  const [cocktails, setCocktails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [myBar, setMyBar] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch initial cocktails
  useEffect(() => {
    fetchCocktails();
  }, []);

  const fetchCocktails = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      setCocktails(data.drinks || []);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCocktails = async (term) => {
    if (!term) {
      fetchCocktails();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`);
      const data = await response.json();
      setCocktails(data.drinks || []);
    } catch (error) {
      console.error('Error searching cocktails:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cocktail) => {
    const isFavorite = favorites.some(fav => fav.idDrink === cocktail.idDrink);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.idDrink !== cocktail.idDrink));
    } else {
      setFavorites([...favorites, cocktail]);
    }
  };

  const toggleBarIngredient = (ingredient) => {
    if (myBar.includes(ingredient)) {
      setMyBar(myBar.filter(i => i !== ingredient));
    } else {
      setMyBar([...myBar, ingredient]);
    }
  };

  const canMakeCocktail = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      if (ingredient) ingredients.push(ingredient.toLowerCase());
    }
    return ingredients.every(ing => 
      myBar.some(barIng => barIng.toLowerCase() === ing)
    );
  };

  const filteredCocktails = cocktails.filter(cocktail => {
    if (filterCategory === 'canMake') {
      return canMakeCocktail(cocktail);
    }
    if (filterCategory === 'alcoholic') {
      return cocktail.strAlcoholic === 'Alcoholic';
    }
    if (filterCategory === 'nonAlcoholic') {
      return cocktail.strAlcoholic === 'Non alcoholic';
    }
    return true;
  });

  const CocktailCard = ({ cocktail }) => {
    const isFavorite = favorites.some(fav => fav.idDrink === cocktail.idDrink);
    
    return (
      <div style={styles.cocktailCard} onClick={() => setSelectedCocktail(cocktail)}>
        <img 
          src={cocktail.strDrinkThumb} 
          alt={cocktail.strDrink}
          style={styles.cocktailImage}
        />
        <div style={styles.cocktailInfo}>
          <h3 style={styles.cocktailName}>{cocktail.strDrink}</h3>
          <p style={styles.cocktailCategory}>{cocktail.strCategory}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(cocktail);
            }}
            style={{...styles.favoriteButton, color: isFavorite ? '#f59e0b' : '#9ca3af'}}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    );
  };

  const CocktailModal = ({ cocktail, onClose }) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      if (cocktail[`strIngredient${i}`]) {
        ingredients.push({
          name: cocktail[`strIngredient${i}`],
          measure: cocktail[`strMeasure${i}`] || ''
        });
      }
    }

    return (
      <div style={styles.modal} onClick={onClose}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} style={styles.modalImage} />
          <h2 style={styles.modalTitle}>{cocktail.strDrink}</h2>
          <p style={styles.modalCategory}>{cocktail.strCategory} • {cocktail.strAlcoholic}</p>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Ingredients</h3>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={styles.ingredient}>
                <span>{ing.name}</span>
                <span style={{color: '#9ca3af'}}>{ing.measure}</span>
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Instructions</h3>
            <p style={styles.instructions}>{cocktail.strInstructions}</p>
          </div>

          {cocktail.strGlass && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Glass</h3>
              <p style={styles.instructions}>{cocktail.strGlass}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>🍸 MixMaster</h1>
        {activeTab === 'cocktails' && (
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search cocktails..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchCocktails(e.target.value);
              }}
              style={styles.searchInput}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === 'cocktails' && (
          <div style={styles.content}>
            <div style={styles.filters}>
              <button 
                onClick={() => setFilterCategory('all')}
                style={{...styles.filterButton, ...(filterCategory === 'all' ? styles.filterButtonActive : {})}}
              >
                All
              </button>
              <button 
                onClick={() => setFilterCategory('alcoholic')}
                style={{...styles.filterButton, ...(filterCategory === 'alcoholic' ? styles.filterButtonActive : {})}}
              >
                Alcoholic
              </button>
              <button 
                onClick={() => setFilterCategory('nonAlcoholic')}
                style={{...styles.filterButton, ...(filterCategory === 'nonAlcoholic' ? styles.filterButtonActive : {})}}
              >
                Non-Alcoholic
              </button>
              <button 
                onClick={() => setFilterCategory('canMake')}
                style={{...styles.filterButton, ...(filterCategory === 'canMake' ? styles.filterButtonActive : {})}}
              >
                Can Make ✨
              </button>
            </div>

            {loading ? (
              <div style={styles.loading}>Loading cocktails...</div>
            ) : (
              <div style={styles.grid}>
                {filteredCocktails.map(cocktail => (
                  <CocktailCard key={cocktail.idDrink} cocktail={cocktail} />
                ))}
                {filteredCocktails.length === 0 && (
                  <div style={styles.empty}>No cocktails found</div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mybar' && (
          <div style={styles.content}>
            <h2 style={styles.tabTitle}>My Bar</h2>
            <p style={styles.subtitle}>Add ingredients you have on hand</p>
            
            <div style={styles.barContainer}>
              {myBar.length === 0 ? (
                <div style={styles.empty}>No ingredients added yet. Add some to see what you can make!</div>
              ) : (
                <div style={styles.ingredientList}>
                  {myBar.map((ingredient, idx) => (
                    <div key={idx} style={styles.barIngredient}>
                      <span>{ingredient}</span>
                      <button 
                        onClick={() => toggleBarIngredient(ingredient)}
                        style={styles.removeButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div style={styles.addIngredientContainer}>
                <input
                  type="text"
                  placeholder="Add ingredient (press Enter)"
                  style={styles.addIngredientInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      toggleBarIngredient(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div style={styles.content}>
            <h2 style={styles.tabTitle}>Favorites</h2>
            {favorites.length === 0 ? (
              <div style={styles.empty}>No favorites yet. Tap the heart on any cocktail to save it!</div>
            ) : (
              <div style={styles.grid}>
                {favorites.map(cocktail => (
                  <CocktailCard key={cocktail.idDrink} cocktail={cocktail} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        {[
          { id: 'cocktails', emoji: '🍸', label: 'Cocktails' },
          { id: 'mybar', emoji: '🍾', label: 'My Bar' },
          { id: 'favorites', emoji: '❤️', label: 'Favorites' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navButton,
              color: activeTab === tab.id ? '#f59e0b' : '#6b7280'
            }}
          >
            <span style={{ fontSize: 24 }}>{tab.emoji}</span>
            <span style={{
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 600 : 400
            }}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal */}
      {selectedCocktail && (
        <CocktailModal cocktail={selectedCocktail} onClose={() => setSelectedCocktail(null)} />
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#fff',
    paddingBottom: 80
  },
  header: {
    padding: '20px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  searchContainer: {
    width: '100%'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#334155',
    color: '#fff',
    fontSize: 16
  },
  main: {
    padding: 20
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto'
  },
  filters: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    overflowX: 'auto',
    paddingBottom: 10
  },
  filterButton: {
    padding: '8px 16px',
    borderRadius: 20,
    border: '1px solid #334155',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: 14
  },
  filterButtonActive: {
    backgroundColor: '#f59e0b',
    color: '#000',
    borderColor: '#f59e0b',
    fontWeight: 600
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20
  },
  cocktailCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  cocktailImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover'
  },
  cocktailInfo: {
    padding: 15,
    position: 'relative'
  },
  cocktailName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 5
  },
  cocktailCategory: {
    fontSize: 14,
    color: '#94a3b8'
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 20
  },
  barContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20
  },
  ingredientList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  barIngredient: {
    backgroundColor: '#334155',
    padding: '8px 12px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: 14
  },
  addIngredientContainer: {
    marginTop: 20
  },
  addIngredientInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: 16
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#94a3b8'
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#94a3b8'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    borderTop: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    zIndex: 20
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    padding: '8px 16px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
    overflowY: 'auto'
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    maxWidth: 600,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    background: '#334155',
    border: 'none',
    color: '#fff',
    fontSize: 20,
    width: 36,
    height: 36,
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 1
  },
  modalImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    borderRadius: '16px 16px 0 0'
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: '20px 20px 10px',
    margin: 0
  },
  modalCategory: {
    color: '#94a3b8',
    padding: '0 20px 20px',
    borderBottom: '1px solid #334155'
  },
  section: {
    padding: 20,
    borderBottom: '1px solid #334155'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12
  },
  ingredient: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: 14
  },
  instructions: {
    lineHeight: 1.6,
    color: '#cbd5e1'
  }
};

export default App;
