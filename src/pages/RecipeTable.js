import React, { useEffect, useMemo, useState } from 'react';
import './RecipeTable.css';
import axios from 'axios';
import handleUserID from '../components/User';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const RecipeTable = () => {
    const [recipes, setRecipe] = useState("")
    const [cookie,] = useCookies(['jwtToken']);
    const userId = handleUserID()
    const username = window.localStorage.getItem("username")

    const headers = useMemo(() => ({
        'Authorization': `Bearer ${cookie.jwtToken}`,
    }), [cookie]);


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes/createdRecipe/user/${userId}`, { headers });
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [userId, headers]);

    const onDelete = async (recipeId, recipename) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/recipes/${recipeId}`, { headers });
            setRecipe(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId))
            toast.success(recipename + "deleted")

        } catch (error) {
            console.error('Error fetching recipe:', error);
        }

    }

    return (
        <div className="recipeTable">
            <h1 className='userName'>{username} created recipes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Recipe Name</th>
                        <th>Image</th>
                        <th>Ingredients</th>
                        <th>Instructions</th>
                        <th>Cooking Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes && recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <tr key={recipe._id}>
                                <td className='tableHead'>{recipe.name}</td>
                                <td>
                                    <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${recipe.image}`} alt={recipe.name} className="smallImage" />
                                </td>
                                <td>
                                    <ul className="ingredientList">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{recipe.instructions}</td>
                                <td>{recipe.cookingTime} minutes</td>
                                <td>
                                    <Link to={`/update/${recipe._id}`} ><button>Edit</button></Link>
                                    <button onClick={() => onDelete(recipe._id, recipe.name)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No recipes available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );
};

export default RecipeTable;
