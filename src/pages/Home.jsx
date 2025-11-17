import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');
  const [resultHeading, setResultHeading] = useState('');
  const navigate = useNavigate();

  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  const searchMeals = async () => {
    const term = searchTerm.trim();

    if (!term) {
      setError("Please enter a search term");
      return;
    }

    try {
      setResultHeading(`Searching for "${term}"...`);
      setMeals([]);
      setError('');

      const response = await fetch(`${BASE_URL}search.php?s=${term}`);
      const data = await response.json();

      if (data.meals === null) {
        setResultHeading('');
        setMeals([]);
        setError(`No recipes found for "${term}". Try another search term!`);
      } else {
        setResultHeading(`Search results for "${term}":`);
        setMeals(data.meals.slice(0, 6));
        setSearchTerm('');
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchMeals();
  };

  const handleMealClick = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="container">
      <header>
        <h1>
          <i className="fa-solid fa-utensils"></i> Recipe Finder
        </h1>
        <p>Find delicious recipes from around the world</p>
      </header>

      <p className="api-link">
        Data from <a href="https://www.themealdb.com/api.php">TheMealDB</a>
      </p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for meals or keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={searchMeals}>Search</button>
      </div>

      {error && (
        <div id="error-container">
          <p>{error}</p>
        </div>
      )}

      {resultHeading && <div id="result-heading">{resultHeading}</div>}

      <div className="meals-container">
        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className="meal"
            onClick={() => handleMealClick(meal.idMeal)}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="meal-info">
              <h3 className="meal-title">{meal.strMeal}</h3>
              {meal.strCategory && (
                <div className="meal-category">{meal.strCategory}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;