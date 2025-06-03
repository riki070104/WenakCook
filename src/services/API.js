// src/services/API.js
import axios from 'axios';

const MOCKAPI_BASE_URL = 'https://683d7a54199a0039e9e5a10c.mockapi.io/api';
const RECIPES_ENDPOINT = `${MOCKAPI_BASE_URL}/Resep`;

// Helper untuk memetakan respons API ke format aplikasi
const mapApiRecipeToAppFormat = (apiRecipe) => {
  if (!apiRecipe) return null;
  return {
    id: apiRecipe.id,
    name: apiRecipe.NamaResep,
    // Pastikan image adalah objek {uri: string} atau null
    image: apiRecipe.Foto ? { uri: apiRecipe.Foto } : null,
    shortDescription: apiRecipe.DeskripsiSingkat,
    ingredients: Array.isArray(apiRecipe.BahanBahan) ? apiRecipe.BahanBahan : [],
    steps: Array.isArray(apiRecipe.Langkah) ? apiRecipe.Langkah : [],
    createdAt: apiRecipe.createdAt,
  };
};

export const getAllRecipesAPI = async () => {
  try {
    const response = await axios.get(RECIPES_ENDPOINT);
    return response.data.map(mapApiRecipeToAppFormat); // Map semua resep
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
};

export const getRecipeByIdAPI = async (recipeId) => { // Renamed for clarity from getRecipeById
  try {
    const response = await axios.get(`${RECIPES_ENDPOINT}/${recipeId}`);
    return mapApiRecipeToAppFormat(response.data);
  } catch (error) {
    console.error(`Error fetching recipe with ID ${recipeId}:`, error);
    throw error;
  }
};

export const addNewRecipeAPI = async (recipeDataFromApp) => {
  try {
    const payloadToApi = {
      NamaResep: recipeDataFromApp.name,
      Foto: recipeDataFromApp.image || "https://via.placeholder.com/300/CCCCCC/FFFFFF?text=ResepBaru", // image di form adalah URI string
      DeskripsiSingkat: recipeDataFromApp.shortDescription,
      BahanBahan: recipeDataFromApp.ingredients,
      Langkah: recipeDataFromApp.steps,
      createdAt: new Date().toISOString(),
    };
    const response = await axios.post(RECIPES_ENDPOINT, payloadToApi);
    return mapApiRecipeToAppFormat(response.data);
  } catch (error) {
    console.error("Error adding new recipe:", error);
    throw error;
  }
};

export const updateRecipeAPI = async (recipeId, recipeDataFromApp) => {
  try {
    const payloadToApi = {
      NamaResep: recipeDataFromApp.name,
      Foto: recipeDataFromApp.image || "https://via.placeholder.com/300/CCCCCC/FFFFFF?text=UpdateResep", // image di form adalah URI string
      DeskripsiSingkat: recipeDataFromApp.shortDescription,
      BahanBahan: recipeDataFromApp.ingredients,
      Langkah: recipeDataFromApp.steps,
      // createdAt biasanya tidak diupdate
    };
    const response = await axios.put(`${RECIPES_ENDPOINT}/${recipeId}`, payloadToApi);
    return mapApiRecipeToAppFormat(response.data);
  } catch (error) {
    console.error(`Error updating recipe with ID ${recipeId}:`, error);
    throw error;
  }
};

export const deleteRecipeAPI = async (recipeId) => {
  try {
    const response = await axios.delete(`${RECIPES_ENDPOINT}/${recipeId}`);
    return response.data; // Biasanya tidak ada konten atau konfirmasi
  } catch (error) {
    console.error(`Error deleting recipe with ID ${recipeId}:`, error);
    throw error;
  }
};