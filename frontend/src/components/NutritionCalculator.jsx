import React, { useState } from 'react';
import axiosInstance from '../api/Axios';

const CALENDAR_STORAGE_KEY = 'buddyplanner-calendar-events';

const NutritionCalculator = () => {
  const [ingredients, setIngredients] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [servingsOverride, setServingsOverride] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [calendarMessage, setCalendarMessage] = useState('');

  // Use separate env vars for Nutrition API if available, otherwise fallback to Recipe Search keys
  // Note: Nutrition Analysis API usually requires different keys than Recipe Search API
  const APP_ID = import.meta.env.VITE_REACT_APP_EDAMAM_NUTRITION_ID || import.meta.env.VITE_REACT_APP_EDAMAM_API_ID;
  const APP_KEY = import.meta.env.VITE_REACT_APP_EDAMAM_NUTRITION_KEY || import.meta.env.VITE_REACT_APP_EDAMAM_API_KEY;

  const sumNutrient = (data, code) => {
    const ingredientsArr = data?.ingredients;
    if (!Array.isArray(ingredientsArr)) return 0;

    let total = 0;
    for (const ing of ingredientsArr) {
      const parsed = ing?.parsed;
      if (!Array.isArray(parsed)) continue;
      for (const p of parsed) {
        const qty = p?.nutrients?.[code]?.quantity;
        if (typeof qty === 'number' && !Number.isNaN(qty)) total += qty;
      }
    }
    return total;
  };

  const suggestedServings = typeof nutritionData?.yield === 'number' && nutritionData.yield > 0 ? nutritionData.yield : 1;
  const servings = Math.max(1, Math.floor(Number(servingsOverride || suggestedServings) || 1));
  const perServing = (code) => sumNutrient(nutritionData, code) / servings;

  const dietLabels = Array.isArray(nutritionData?.dietLabels) ? nutritionData.dietLabels : [];
  const healthLabels = Array.isArray(nutritionData?.healthLabels) ? nutritionData.healthLabels : [];

  const analyzeNutrition = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    setCalendarMessage('');
    setNutritionData(null);

    // Split ingredients by new line
    const ingrList = ingredients.split('\n').filter(line => line.trim() !== '');

    try {
      const response = await axiosInstance.post(
        `/api/proxy/nutrition/?app_id=${APP_ID}&app_key=${APP_KEY}`,
        {
          title: "User Recipe",
          ingr: ingrList
        }
      );

      const data = response.data;
      
      setNutritionData(data);
      setServingsOverride(String((data && typeof data.yield === 'number' && data.yield > 0 ? data.yield : 1)));
    } catch (err) {
      console.error("Nutrition API Error:", err);
      // Axios stores the response in err.response
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      
      if (err.response?.status === 401) {
         setError("Unauthorized: please verify your Edamam Nutrition Analysis API keys.");
      } else {
         setError(msg || "Failed to analyze nutrition. Please check your API keys.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToCalendar = async () => {
    if (!nutritionData || !calendarDate) return;

    const storedEvents = JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEY) || '[]');
    const calories = Math.round(perServing('ENERC_KCAL'));
    const protein = Math.round(perServing('PROCNT'));

    const nextEvent = {
      id: `nutrition-${Date.now()}`,
      title: `Nutrition: ${calories} cal`,
      start: calendarDate,
      allDay: true,
      extendedProps: {
        type: 'nutrition',
        servings,
        calories,
        protein,
        ingredients: ingredients.split('\n').filter((line) => line.trim() !== ''),
      },
    };

    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify([...storedEvents, nextEvent]));
    window.dispatchEvent(new Event('buddyplanner-calendar-events-updated'));

    try {
      await axiosInstance.post('/api/journals/upsert/', {
        entry_date: calendarDate,
        nutrition_facts: {
          servings,
          calories,
          protein,
          total_fat: Math.round(perServing('FAT')),
          carbohydrates: Math.round(perServing('CHOCDF')),
          fiber: Math.round(perServing('FIBTG')),
          sugar: Math.round(perServing('SUGAR')),
        },
      });
      setCalendarMessage(`Saved nutrition summary to ${calendarDate}.`);
    } catch {
      setCalendarMessage(`Saved to calendar, but failed to store journal nutrition for ${calendarDate}.`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="nutrition-page-title text-3xl font-bold text-center mb-6">Nutrition Calculator</h1>
      <div className="task-layout nutrition-layout">
        <div className="task-panel nutrition-panel">
          <h2>Enter Ingredients</h2>
          <p className="nutrition-helper-text">One ingredient per line (e.g., "1 cup rice", "10 oz chicken")</p>
          <form onSubmit={analyzeNutrition} className="task-form">
            <div className="task-field">
              <textarea
                className="task-input task-textarea nutrition-textarea"
                placeholder="1 cup rice&#10;10 oz chicken breast&#10;2 tbsp olive oil"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !ingredients.trim()}
              className="task-submit-button nutrition-submit-button"
            >
              {loading ? 'Analyzing...' : 'Analyze Nutrition'}
            </button>
          </form>
          {error && <div className="nutrition-message nutrition-message-error">{error}</div>}
        </div>

        <div className="task-panel nutrition-panel">
          <h2>Nutrition Facts</h2>
          {nutritionData ? (
            <div className="nutrition-results">
              <div className="nutrition-summary">
                <h3>Amount Per Serving</h3>
                <div className="nutrition-calories-row">
                  <span>Calories</span>
                  <span>{Math.round(perServing('ENERC_KCAL'))}</span>
                </div>
                <div className="nutrition-servings-row">
                  <span>Servings:</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={servingsOverride}
                    onChange={(e) => setServingsOverride(e.target.value)}
                    className="task-input nutrition-servings-input"
                  />
                  <span>(Suggested: {suggestedServings})</span>
                </div>
              </div>

              <div className="nutrition-facts-list">
                <div className="nutrition-fact-row nutrition-fact-row-strong"><span>Total Fat</span><span>{Math.round(perServing('FAT'))}g</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-nested"><span>Saturated Fat</span><span>{Math.round(perServing('FASAT'))}g</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-strong"><span>Cholesterol</span><span>{Math.round(perServing('CHOLE'))}mg</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-strong"><span>Sodium</span><span>{Math.round(perServing('NA'))}mg</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-strong"><span>Total Carbohydrate</span><span>{Math.round(perServing('CHOCDF'))}g</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-nested"><span>Dietary Fiber</span><span>{Math.round(perServing('FIBTG'))}g</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-nested"><span>Sugars</span><span>{Math.round(perServing('SUGAR'))}g</span></div>
                <div className="nutrition-fact-row nutrition-fact-row-strong"><span>Protein</span><span>{Math.round(perServing('PROCNT'))}g</span></div>
              </div>

              <div className="nutrition-labels-section">
                <h4>Labels</h4>
                {dietLabels.length === 0 && healthLabels.length === 0 ? (
                  <div className="nutrition-empty-state">None</div>
                ) : (
                  <div className="nutrition-labels">
                    {dietLabels.map((label, idx) => (
                      <span key={`diet-${idx}`} className="nutrition-label-badge">{label}</span>
                    ))}
                    {healthLabels.map((label, idx) => (
                      <span key={`health-${idx}`} className="nutrition-label-badge">{label}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="nutrition-calendar-save">
                <h4>Save to Calendar</h4>
                <div className="nutrition-calendar-save-controls">
                  <div className="task-field nutrition-calendar-date-field">
                    <label htmlFor="nutrition-calendar-date">Calendar day</label>
                    <input
                      id="nutrition-calendar-date"
                      type="date"
                      value={calendarDate}
                      onChange={(e) => setCalendarDate(e.target.value)}
                      className="task-input"
                    />
                  </div>
                  <button
                    type="button"
                    className="task-submit-button nutrition-save-button"
                    onClick={saveToCalendar}
                  >
                    Store in Calendar
                  </button>
                </div>
                {calendarMessage && (
                  <div className="nutrition-message nutrition-message-success">{calendarMessage}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="nutrition-empty-state nutrition-empty-panel">
              {loading ? 'Processing...' : 'Enter ingredients to see nutrition facts'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionCalculator;
