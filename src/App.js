import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SavedRecipes from './pages/SavedRecipes'
import RecipeDetails from './pages/RecipeDeatails'
import CreateRecipe from './pages/CreateRecipe'
import Auth from './pages/Auth'
import RecipeTable from './pages/RecipeTable'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './pages/Admin'
import NotFound from './pages/notFound'


function App() {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createrecipe" element={<CreateRecipe />} />
          <Route path="/update/:recipeId" element={<CreateRecipe />} />
          <Route path="/savedrecipes" element={<SavedRecipes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/RecipeDeatails/:recipeId" element={< RecipeDetails />} />
          <Route path="/RecipeTable" element={< RecipeTable />} />
          <Route path="/Admin" element={< Admin />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>

  )
}

export default App