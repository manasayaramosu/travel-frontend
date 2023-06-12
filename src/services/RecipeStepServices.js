import apiClient from "./services";

export default {
  getRecipeSteps() {
    return apiClient.get("recipeSteps");
  },
  getRecipeStepsForRecipe(recipeId) {
    return apiClient.get("itineraries/" + recipeId + "/recipeSteps");
  },
  getRecipeStepsForRecipeWithIngredients(recipeId) {
    return apiClient.get("itineraries/" + recipeId + "/recipeStepsWithIngredients");
  },
  getRecipeStep(recipeStep) {
    return apiClient.get(
      "itineraries/" + recipeStep.recipeId + "/recipeSteps/" + recipeStep.id
    );
  },
  addRecipeStep(recipeStep) {
    return apiClient.post(
      "itineraries/" + recipeStep.recipeId + "/recipeSteps",
      recipeStep
    );
  },
  updateRecipeStep(recipeStep) {
    return apiClient.put(
      "itineraries/" + recipeStep.recipeId + "/recipeSteps/" + recipeStep.id,
      recipeStep
    );
  },
  deleteRecipeStep(recipeStep) {
    return apiClient.delete(
      "itineraries/" + recipeStep.recipeId + "/recipeSteps/" + recipeStep.id
    );
  },
};
