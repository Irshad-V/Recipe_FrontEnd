import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import handleUserID from '../components/User';
import './SavedRecipes.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookie,] = useCookies(['jwtToken']);
  const userID = handleUserID();

  const headers = useMemo(() => ({
    'Authorization': `Bearer ${cookie.jwtToken}`,
    'Content-Type': 'multipart/form-data'
  }), [cookie]);


  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes/savedRecipes/${userID}`, { headers });
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };
    if (userID) {
      fetchSavedRecipes();
    }

  }, [userID, headers]);

  const deleteHandler = async (recipeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/recipes/users/${userID}/savedRecipes/${recipeId}`, { headers });

      toast.success("deleted....")
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe ID:', error);
    }
  };


  return (

    <div className="saved-recipes-container">
      <h1 className="saved-recipes-title">Saved Recipes</h1>
      <ul className="saved-recipes-list">
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className="recipe-item">
            <Link to={`/RecipeDeatails/${recipe._id}`} className="link-style recipe-footer">
              <div className="recipe-details">
                <h2 className="recipe-name">{recipe.name}</h2>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-image-container">
                  <img className="recipe-image" src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${recipe.image}`} alt={recipe.name} />
                </div>
                <p className="recipe-cooking-time">Cooking Time: {recipe.cookingTime} minutes</p>
              </div>
            </Link>
            <button className="delete" onClick={() => deleteHandler(recipe._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>


  );
}

export default SavedRecipes;
