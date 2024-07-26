import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDeatails.css';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
    let { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes/${recipeId}`,);
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (!recipe) {
        return <div>Loading....</div>;
    }

    return (


        <div className="recipe-details-container">
            <h1 className="recipe-details-title">{recipe.name}</h1>
            <div className="recipe-details-content">
                <div className="recipe-details-left">
                    <img className="recipe-details-image" src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${recipe.image}`} alt={recipe.name} />
                    <p className="recipe-details-cooking-time">Cooking Time: {recipe.cookingTime} minutes</p>
                    <p className="recipe-details-owner">Recipe by: {recipe.username}</p>
                    <p className="recipe-details-owner">Email: {recipe.useremail}</p>
                </div>
                <div className="recipe-details-right">
                    <h2>Ingredients</h2>
                    <ul className="recipe-details-ingredients">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <h2>Instructions</h2>
                    <p className="recipe-details-instructions">{recipe.instructions}</p>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;
