import apiClient from "./services";

export default {
  getRecipeIngredients() {
    return apiClient.get("recipeIngredients");
  },
  getRecipeIngredientsForRecipe(recipeId) {
    return apiClient.get("itineraries/" + recipeId + "/recipeIngredients");
  },
  getRecipeIngredientsForRecipeStep(recipeId, recipeStepId) {
    return apiClient.get(
      "itineraries/" +
        recipeId +
        "/recipeSteps/" +
        recipeStepId +
        "/recipeIngredientsWithIngredients"
    );
  },
  getRecipeIngredient(recipeIngredient) {
    return apiClient.get(
      "itineraries/" +
        recipeIngredient.recipeId +
        "/recipeIngredients/" +
        recipeIngredient.id
    );
  },
  addRecipeIngredient(recipeIngredient) {
    return apiClient.post(
      "itineraries/" + recipeIngredient.recipeId + "/recipeIngredients",
      recipeIngredient
    );
  },
  updateRecipeIngredient(recipeIngredient) {
    return apiClient.put(
      "itineraries/" +
        recipeIngredient.recipeId +
        "/recipeIngredients/" +
        recipeIngredient.id,
      recipeIngredient
    );
  },
  deleteRecipeIngredient(recipeIngredient) {
    return apiClient.delete(
      "itineraries/" +
        recipeIngredient.recipeId +
        "/recipeIngredients/" +
        recipeIngredient.id
    );
  },
};
