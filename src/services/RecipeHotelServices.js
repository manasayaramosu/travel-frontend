import apiClient from "./services";

export default {
  getRecipeHotels() {
    return apiClient.get("itern_hotel");
  },
  getRecipeHotelsForRecipe(recipeId) {
    return apiClient.get("itineraries/" + recipeId + "/itern_hotel");
  },
  getRecipeHotelsForRecipeStep(recipeId, recipeStepId) {
    return apiClient.get(
      "itineraries/" +
        recipeId +
        "/recipeSteps/" +
        recipeStepId +
        "/itern_hotelWithHotels"
    );
  },
  getRecipeHotel(recipeHotel) {
    return apiClient.get(
      "itineraries/" +
        recipeHotel.recipeId +
        "/itern_hotel/" +
        recipeHotel.id
    );
  },
  addRecipeHotel(recipeHotel) {
    return apiClient.post(
      "itineraries/" + recipeHotel.recipeId + "/itern_hotel",
      recipeHotel
    );
  },
  updateRecipeHotel(recipeHotel) {
    return apiClient.put(
      "itineraries/" +
        recipeHotel.recipeId +
        "/itern_hotel/" +
        recipeHotel.id,
      recipeHotel
    );
  },
  deleteRecipeHotel(recipeHotel) {
    return apiClient.delete(
      "itineraries/" +
        recipeHotel.recipeId +
        "/itern_hotel/" +
        recipeHotel.id
    );
  },
};
