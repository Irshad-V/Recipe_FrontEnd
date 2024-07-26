import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import handleUserID from '../components/User';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [cookie,] = useCookies(['jwtToken']);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userId = handleUserID()
  

    const headers = {
        'Authorization': `Bearer ${cookie.jwtToken}`,
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes`)
            .then(response => {
                setRecipes(response.data);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
        if (userId) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes/savedRecipes/allId/${userId}`)
                .then(response => {
                    setSavedRecipes(response.data.savedRecipes);
                

                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                });
        }


    }, [userId]);

    const saveRecipe = async (id) => {
        try {
            if (userId) {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/recipes`, { userId, recipeId: id }, { headers })
                    .then(response => {
                        setSavedRecipes([...savedRecipes, response.data]);
                    })

            } else {
                toast.info("login......")
            }
        } catch (err) {
            console.log(err)
        }
        setSavedRecipes([...savedRecipes, id]);
    };


    const isRecipeSaved = (id) => savedRecipes.includes(id);
  

    if (!recipes) {
        return <div>Loading....</div>;
    }

    return (
        <div className="recipes-container">
            <h1>Recipes</h1>
            <ul className="recipe-list">
                {recipes.map((recipe) => (

                    <li key={recipe._id} className="recipe-card">
                        <div className="recipe-header">
                            <h2>{recipe.name}</h2>
                            <button
                                className={`save-button ${isRecipeSaved(recipe._id) ? 'saved' : ''}`}
                                onClick={() => saveRecipe(recipe._id)}
                                disabled={isRecipeSaved(recipe._id)}
                            >
                                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                            </button>
                        </div>
                        <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${recipe.image}`}
                            alt={recipe.name}
                            className="recipe-image"
                        />


                        <div className="recipe-details">
                            <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                            <p>{recipe.instructions}</p>
                        </div>
                        <Link to={`/RecipeDeatails/${recipe._id}`} className="link-style recipe-footer">
                            <p><strong>Author:</strong> {recipe.username}</p>
                            <p><strong>Email:</strong> {recipe.useremail}</p>
                        </Link>
                    </li>

                ))}
            </ul>
        </div >
    );
};

export default Home;
 