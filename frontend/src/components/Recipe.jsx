import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/Axios';
import style from './recipe.module.css';

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // You'll need to sign up for Edamam API to get these values
  // https://developer.edamam.com/edamam-recipe-api
  const APP_ID = import.meta.env.VITE_REACT_APP_EDAMAM_API_ID;
  const APP_KEY = import.meta.env.VITE_REACT_APP_EDAMAM_API_KEY;
  const API_URL = import.meta.env.VITE_REACT_APP_EDAMAM_API_URL;

  useEffect(() => {
    if (query) {
      getRecipes();
    }
  }, [query]);

  useEffect(() => {
    if (!selectedRecipe) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRecipe(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedRecipe]);

  const getRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use centralized axios instance
      const response = await axiosInstance.get(
        `/api/proxy/edamam/?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      
      const data = response.data;
      console.log("Edamam API response:", data);
      
      // Debugging: Alert the user with the raw response if something looks wrong
      if (!data.hits || data.hits.length === 0) {
        alert("API Response Debug:\n" + JSON.stringify(data, null, 2));
      }

      if (data.hits && data.hits.length > 0) {
        setRecipes(data.hits);
      } else {
        setRecipes([]);
        if (data.message) {
           // Edamam often returns error messages in a 'message' field (e.g. "API key not found")
           setError(`API Error: ${data.message}`);
        } else if (data.status === 'error') {
           setError('API Error: Check your API keys.');
        } else {
           // Genuine empty result
           // We don't set error here, we just let the UI show "No recipes found"
           console.warn("No hits found in response:", data);
        }
      }
    } catch (error) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSearch('');
  };

  // Recipe card renderer function
  const renderRecipeCard = ({ recipe }, index) => {
    return (
      <div
        className={`${style.recipe} task-panel cursor-pointer`}
        key={index}
        role="button"
        tabIndex={0}
        onClick={() => setSelectedRecipe(recipe)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedRecipe(recipe);
          }
        }}
      >
        <h2 className="text-xl font-bold mb-2">{recipe.label}</h2>
        <img className={style.image} src={recipe.image} alt={recipe.label} />
        <p className="mb-2"><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
        <div className={style.recipeDetails}>
          <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
          <ul className={style.recipeList}>
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient.text}</li>
            ))}
          </ul>
        </div>
        <div className={style.recipeLinkHint}>Open details</div>
      </div>
    );
  };

  return (
    <div className={`${style.recipePage} mx-auto max-w-6xl p-4`}>
      <h1 className="text-3xl font-bold text-center mb-6">Recipe Search</h1>
      <form onSubmit={getSearch} className={style.searchForm}>
        <input
          className={`${style.searchBar} task-input`}
          type="text"
          value={search}
          onChange={updateSearch}
          placeholder="Enter an ingredient (e.g., chicken, broccoli)"
        />
        <button className={`${style.searchButton} task-submit-button`} type="submit">
          Search
        </button>
      </form>

      {loading && <p className="text-center my-4">Loading recipes...</p>}
      {error && <p className="text-center my-4 task-error">{error}</p>}

      <div className={style.recipeGrid}>
        {recipes.length > 0 ? (
          recipes.map((recipeItem, index) => renderRecipeCard(recipeItem, index))
        ) : query ? (
          <p className="col-span-3 text-center">No recipes found for "{query}". Try another ingredient.</p>
        ) : null}
      </div>

      {selectedRecipe && (
        <div
          className={style.modalOverlay}
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className={`${style.modalPanel} task-panel`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={style.modalHeader}>
              <div>
                <h2 className="text-2xl font-bold">{selectedRecipe.label}</h2>
                <div className={style.modalSource}>
                  {selectedRecipe.source ? `Source: ${selectedRecipe.source}` : null}
                </div>
              </div>
              <button
                type="button"
                className={`${style.modalClose} task-submit-button`}
                onClick={() => setSelectedRecipe(null)}
              >
                Close
              </button>
            </div>

            {selectedRecipe.image && (
              <img
                className={style.modalImage}
                src={selectedRecipe.image}
                alt={selectedRecipe.label}
              />
            )}

            <div className={style.modalMeta}>
              <div><strong>Calories:</strong> {Math.round(selectedRecipe.calories || 0)}</div>
              {typeof selectedRecipe.totalTime === 'number' && selectedRecipe.totalTime > 0 ? (
                <div><strong>Total time:</strong> {selectedRecipe.totalTime} min</div>
              ) : null}
              {typeof selectedRecipe.yield === 'number' && selectedRecipe.yield > 0 ? (
                <div><strong>Servings:</strong> {selectedRecipe.yield}</div>
              ) : null}
            </div>

            <div className={style.modalSection}>
              <h3 className="text-lg font-semibold">Ingredients</h3>
              <ul className={style.recipeList}>
                {(selectedRecipe.ingredients || []).map((ingredient, idx) => (
                  <li key={idx}>{ingredient.text}</li>
                ))}
              </ul>
            </div>

            <div className={style.modalSection}>
              <h3 className="text-lg font-semibold">Steps</h3>
              <div className={style.modalText}>
                Edamam does not return step-by-step instructions directly. Use the source link to view the full directions.
              </div>
              {selectedRecipe.url ? (
                <a
                  className={`${style.recipeActionLink} task-submit-button`}
                  href={selectedRecipe.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open full instructions
                </a>
              ) : (
                <div className={style.modalMuted}>No source URL available for this recipe.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
