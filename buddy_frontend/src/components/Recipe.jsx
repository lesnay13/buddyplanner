import React, { useState, useEffect } from 'react';
import style from './recipe.module.css';

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
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

  const getRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use local backend proxy to avoid CORS issues
      const response = await fetch(
        `/api/proxy/edamam/?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
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
      <div className={style.recipe} key={index}>
        <h2 className="text-xl font-bold mb-2">{recipe.label}</h2>
        <img className={style.image} src={recipe.image} alt={recipe.label} />
        <p className="mb-2"><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
        <div className="w-full px-4">
          <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient.text}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Recipe Search</h1>
      <form onSubmit={getSearch} className={style['search-form']}>
        <input
          className={style['search-bar']}
          type="text"
          value={search}
          onChange={updateSearch}
          placeholder="Enter an ingredient (e.g., chicken, broccoli)"
        />
        <button className={style['search-button']} type="submit">
          Search
        </button>
      </form>

      {loading && <p className="text-center my-4">Loading recipes...</p>}
      {error && <p className="text-center my-4 text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {recipes.length > 0 ? (
          recipes.map((recipeItem, index) => renderRecipeCard(recipeItem, index))
        ) : query ? (
          <p className="col-span-3 text-center">No recipes found for "{query}". Try another ingredient.</p>
        ) : null}
      </div>
    </div>
  );
};

export default Recipe;
