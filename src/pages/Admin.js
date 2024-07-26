
import React, { useEffect, useState } from 'react';
import './RecipeTable.css';
import axios from 'axios';
import handleUserID from '../components/User';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

const Admin = () => {
    const [recipes, setRecipe] = useState("")
    const [cookie,] = useCookies(['jwtToken']);
    const userId = handleUserID()
    const headers = {
        'Authorization': `Bearer ${cookie.jwtToken}`,
    };
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes`);
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [userId]);

    const onDelete = async (recipeId, recipename, username) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/recipes/${recipeId}`, { headers });
            setRecipe(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId))
            toast.success(recipename + "deleted created by " + username)

        } catch (error) {
            console.error('Error fetching recipe:', error);
        }

    }

    return (
        <div className="recipeTable">
            <h1 className='userName'>Admin page </h1>
            <table>
                <thead>
                    <tr>
                        <th>Recipe Name</th>
                        <th>Image</th>
                        <th>Ingredients</th>
                        <th>Instructions</th>
                        <th>userName</th>
                        <th>userEmail</th>
                        <th>Cooking Time</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {!recipes ?  <tr>
                        <td colSpan="6">No recipes available</td>
                    </tr> :
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
                                <td>{recipe.username}</td>
                                <td>{recipe.useremail}</td>
                                <td>{recipe.cookingTime} minutes</td>
                                <td>

                                    <button onClick={() => onDelete(recipe._id, recipe.name, recipe.username)}>Delete</button>
                                </td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
