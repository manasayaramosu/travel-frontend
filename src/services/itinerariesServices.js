import apiClient from "./services";

export default {
  getRecipes() {
    return apiClient.get("itineraries");
  },
  getRecipesByUserId(userId) {
    return apiClient.get("itineraries/user/" + userId);
  },
  addDestination(destination) {
    return apiClient.post("destinations", destination);
  },
  addDestinationForUser(userId, destination) {
    return apiClient.post(`mydestinations/user/${userId}`, destination);
  },
  getRecipe(id) {
    return apiClient.get("itineraries/" + id);
  },
  addRecipe(recipe) {
    return apiClient.post("itineraries", recipe);
  },
  updateRecipe(recipeId, recipe) {
    return apiClient.put("itineraries/" + recipeId, recipe);
  },
  deleteRecipe(recipeId) {
    return apiClient.delete("itineraries/" + recipeId);
  },
};
