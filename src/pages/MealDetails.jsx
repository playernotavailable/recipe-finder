import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MealDetails() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}lookup.php?i=${id}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
          setMeal(data.meals[0]);
        } else {
          setError("Meal not found");
        }
      } catch (err) {
        setError("Could not load recipe details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [id]);

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
        ingredients.push({
          ingredient: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`]
        });
      }
    }
    return ingredients;
  };

  const backToRecipes = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div id="result-heading">Loading recipe details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div id="error-container">
          <p>{error}</p>
        </div>
        <button id="back-btn" onClick={backToRecipes}>
          <i className="fa-solid fa-arrow-left"></i> Back to recipes
        </button>
      </div>
    );
  }

  if (!meal) return null;

  return (
    <div className="container">
      <button id="back-btn" onClick={backToRecipes}>
        <i className="fa-solid fa-arrow-left"></i> Back to recipes
      </button>

      <div id="meal-details">
        <div className="meal-details-content">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="meal-details-img"
          />
          <h2 className="meal-details-title">{meal.strMeal}</h2>
          <div className="meal-details-category">
            <span>{meal.strCategory || "Uncategorized"}</span>
          </div>

          <div className="meal-details-instructions">
            <h3>Instructions</h3>
            <p>{meal.strInstructions}</p>
          </div>

          <div className="meal-details-ingredients">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {getIngredients(meal).map((item, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle"></i> {item.measure} {item.ingredient}
                </li>
              ))}
            </ul>
          </div>

          {meal.strYoutube && (
            
              <a href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-link"
            >
              <i className="fab fa-youtube"></i> Watch Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealDetails;