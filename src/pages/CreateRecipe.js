
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import handleUserID from "../components/User";
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import './CreateRecipe.css';

const initialState = {
  name: "",
  image: "",
  ingredients: [],
  instructions: "",
  cookingTime: "",
  username: "",
  useremail: "",
  userOwner: ""
}

const CreateRecipe = () => {

  const [recipe, setRecipe] = useState(initialState);
  const [cookie,] = useCookies(['jwtToken']);
  const userId = handleUserID()
  const navigate = useNavigate();
  const { recipeId } = useParams()



  useEffect(() => {
    const fetchRecipe = async () => {
      if (recipeId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recipes/${recipeId}`);
          setRecipe(response.data);
        } catch (error) {
          console.error('Error fetching recipe:', error);
        }
      } else {
        setRecipe(prevState => ({
          ...prevState,
          username: window.localStorage.getItem('username'),
          useremail: window.localStorage.getItem('useremail'),
          userOwner: userId
        }));
      }
    };

    fetchRecipe();

  }, [userId, recipeId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleIngredientChange = (e, index) => {
    const { value } = e.target;
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe(prevState => ({
      ...prevState,
      ingredients: updatedIngredients
    }));
  };

  const handleAddIngredient = () => {
    setRecipe(prevState => ({
      ...prevState,
      ingredients: [...prevState.ingredients, ""]
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setRecipe(prevState => ({
      ...prevState,
      image: file
    }));


  };
  const handleDeleteIngredient = (index) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe(prevState => ({
      ...prevState,
      ingredients: updatedIngredients
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.info("Please Login");
      return navigate("/auth");
    } else {

      const errors = [];
      if (recipe.name === "") {
        errors.push("Recipe Name");
      }
      if (recipe.ingredients.length === 0 || recipe.ingredients.some(ingredient => ingredient === "")) {
        errors.push("Ingredients or delte empty field");
      }
      if (recipe.instructions === "") {
        errors.push("Instructions");
      }
      if (recipe.image === "") {
        errors.push("Image ");
      }
      if (recipe.cookingTime === "") {
        errors.push("Cooking Time");
      }
      if (recipe.userOwner === "") {
        errors.push("User Owner");
      }

      if (errors.length > 0) {
        toast.error(`Please fill in the following fields: ${errors.join(", ")}.`);
        return;
      }


      const headers = {
        'Authorization': `Bearer ${cookie.jwtToken}`,
        'Content-Type': 'multipart/form-data'
      };
      try {

        if (recipeId) {
          // Update existing recipe
          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/recipes/${recipeId}`, recipe, { headers });
          toast.success("Recipe updated successfully!");

        } else {
          // Create new recipe
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recipes`, recipe, { headers });
          toast.success("Recipe created successfully!");
        }
        setRecipe(initialState)
        navigate("/")
      } catch (err) {
        console.log( "err.message");
        console.log( err.message);
        toast.error("Error creating recipe");
      }
    }
  };

  return (
    <div className="createRecipe container">

      <h2>{!recipeId ? "Create Recipe" : "Update Recipe"}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          className="inputTextBox"
        />
        <label htmlFor="image" className="inputFileLabel">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          className="inputFile"
        />


        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-container">
            <input
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
              className="inputTextBox"
            />
            <button
              type="button"
              onClick={() => handleDeleteIngredient(index)}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        ))}
        <button type="button" style={{ margin: "8px" }} onClick={handleAddIngredient} className="btn">
          Add Ingredient
        </button>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          className="inputTextBox"
        ></textarea>

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          className="inputTextBox"
        />
        <button type="submit" className="btn">
          {!recipeId ? "Create Recipe" : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
