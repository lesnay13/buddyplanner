import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/Axios';

const todayDate = () => new Date().toISOString().slice(0, 10);

export default function Journal() {
  const [form, setForm] = useState({
    entry_date: todayDate(),
    psychodrama_moment: '',
    feeling_about_it: '',
    real_feeling: '',
    peace_balance: '',
    energy_today: '',
    notes: '',
    nutrition_facts: {},
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const nutritionFacts = useMemo(() => form.nutrition_facts || {}, [form.nutrition_facts]);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const response = await axiosInstance.get('/api/journals/');
        const current = (response.data || []).find((entry) => entry.entry_date === form.entry_date);
        if (current) {
          setForm({
            entry_date: current.entry_date,
            psychodrama_moment: current.psychodrama_moment || '',
            feeling_about_it: current.feeling_about_it || '',
            real_feeling: current.real_feeling || '',
            peace_balance: current.peace_balance || '',
            energy_today: current.energy_today || '',
            notes: current.notes || '',
            nutrition_facts: current.nutrition_facts || {},
          });
        } else {
          setForm((prev) => ({
            ...prev,
            psychodrama_moment: '',
            feeling_about_it: '',
            real_feeling: '',
            peace_balance: '',
            energy_today: '',
            notes: '',
            nutrition_facts: {},
          }));
        }
      } catch {
        setError('Failed to load journal entry.');
      }
    };

    loadEntry();
  }, [form.entry_date]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/journals/upsert/', form);
      setForm((prev) => ({ ...prev, ...response.data }));
      setMessage('Journal saved.');
      setError('');
      window.dispatchEvent(new Event('buddyplanner-calendar-events-updated'));
    } catch {
      setError('Failed to save journal.');
      setMessage('');
    }
  };

  const nutritionRows = [
    ['servings', 'Servings'],
    ['calories', 'Calories'],
    ['protein', 'Protein (g)'],
    ['total_fat', 'Total Fat (g)'],
    ['carbohydrates', 'Carbohydrates (g)'],
    ['fiber', 'Fiber (g)'],
    ['sugar', 'Sugar (g)'],
  ];

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="task-page-title text-3xl font-bold text-center mb-6">Journal</h1>
      <div className="task-layout">
        <div className="task-panel max-w-4xl w-full">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-field">
              <label htmlFor="journal-date">Entry Date</label>
              <input
                id="journal-date"
                type="date"
                className="task-input"
                value={form.entry_date}
                onChange={(e) => handleFieldChange('entry_date', e.target.value)}
              />
            </div>

            <div className="journal-grid">
              <div className="task-field">
                <label htmlFor="psychodrama-moment">Psycodrama of the moment</label>
                <textarea
                  id="psychodrama-moment"
                  className="task-input task-textarea"
                  value={form.psychodrama_moment}
                  onChange={(e) => handleFieldChange('psychodrama_moment', e.target.value)}
                />
              </div>

              <div className="task-field">
                <label htmlFor="feeling-about-it">How do I feel about it</label>
                <input
                  id="feeling-about-it"
                  type="text"
                  className="task-input"
                  value={form.feeling_about_it}
                  onChange={(e) => handleFieldChange('feeling_about_it', e.target.value)}
                />
              </div>

              <div className="task-field">
                <label htmlFor="real-feeling">How do I really feel?</label>
                <textarea
                  id="real-feeling"
                  className="task-input task-textarea"
                  value={form.real_feeling}
                  onChange={(e) => handleFieldChange('real_feeling', e.target.value)}
                />
              </div>

              <div className="task-field">
                <label htmlFor="peace-balance">What brings me peace and balance</label>
                <textarea
                  id="peace-balance"
                  className="task-input task-textarea"
                  value={form.peace_balance}
                  onChange={(e) => handleFieldChange('peace_balance', e.target.value)}
                />
              </div>

              <div className="task-field">
                <label htmlFor="energy-today">What would bring me energy today?</label>
                <textarea
                  id="energy-today"
                  className="task-input task-textarea"
                  value={form.energy_today}
                  onChange={(e) => handleFieldChange('energy_today', e.target.value)}
                />
              </div>

              <div className="task-field">
                <label htmlFor="journal-notes">Notes</label>
                <textarea
                  id="journal-notes"
                  className="task-input task-textarea"
                  value={form.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="task-submit-button">Save Journal</button>
            {message && <small>{message}</small>}
            {error && <p className="task-error">{error}</p>}
          </form>
        </div>

        <div className="task-panel max-w-2xl w-full">
          <h2 className="home-panel-title">Nutrition Facts of the Day</h2>
          {Object.keys(nutritionFacts).length === 0 ? (
            <p className="nutrition-empty-state">No nutrition saved for this day yet.</p>
          ) : (
            <ul className="task-list">
              {nutritionRows.map(([key, label]) => (
                nutritionFacts[key] !== undefined ? (
                  <li key={key} className="task-list-item">
                    <strong>{label}</strong>
                    <span>{nutritionFacts[key]}</span>
                  </li>
                ) : null
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}