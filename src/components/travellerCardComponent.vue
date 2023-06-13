<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices.js";
import RecipeHotelServices from "../services/RecipeHotelServices.js";
import itinerariesServices from "../services/itinerariesServices";
import DestinationServices from "../services/itinerariesServices.js";

const router = useRouter();

const showDetails = ref(false);
const recipeIngredients = ref([]);
const recipeHotels = ref([]);
const recipeSteps = ref([]);
const user = ref(null);
const destinations = ref([]);

const props = defineProps({
  recipe: {
    required: true,
  },
});

onMounted(async () => {
  await getRecipeIngredients();
  await getRecipeHotels();
  await getMyDestinations();

  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(props.recipe.id)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    props.recipe.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addItinerary() {
  const itineraryId = props.recipe.id; // Assuming the itinerary ID is available as a prop

  try {
    await itinerariesServices.addItinerary(itineraryId);
    await getMyDestinations(); // Fetch the updated mydestinations after adding the itinerary
  } catch (error) {
    console.error(error);
  }
}

async function getRecipeHotels() {
  await RecipeHotelServices.getRecipeHotelsForRecipe(props.recipe.id)
    .then((response) => {
      recipeHotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getMyDestinations() {
  // Assuming you have the logged-in user's ID stored in `userId`
  const userId = user.value.id; // Get the logged-in user's ID from the user ref
  try {
    const response = await DestinationServices.getDestinationsByUserId(userId);
    destinations.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="showDetails = !showDetails">
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          <span class="text-h5 font-weight-bold">{{ recipe.location }} to {{ recipe.name }}</span>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn color="accent" @click="addItinerary()">Add</v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3 class="headline mb-2">Description</h3>
        <p class="body-1">{{ recipe.description }}</p>

        <v-chip class="ma-2" color="primary" label>
          <strong>Start Date:</strong> {{ new Date(recipe.startdate).toLocaleDateString() }}
        </v-chip>
        <v-chip class="ma-2" color="primary" label>
          <strong>End Date:</strong> {{ new Date(recipe.enddate).toLocaleDateString() }}
        </v-chip>

        <h3 class="headline mb-2">Locations</h3>
        <v-list>
          <v-list-item v-for="recipeIngredient in recipeIngredients" :key="recipeIngredient.id">
            <div>
              <span class="font-weight-bold">Day {{ recipeIngredient.quantity }}: </span>
              <span>{{ recipeIngredient.ingredient.Touristspots }} in {{recipeIngredient.ingredient.Destinations }} </span>
            </div>
          </v-list-item>
        </v-list>
        <h3 class="headline mb-2">Hotels</h3>
        <v-list>
          <v-list-item v-for="recipeIngredient in recipeHotels" :key="recipeIngredient.id">
            <div>
              <span class="font-weight-bold">Day {{ recipeIngredient.quantity }}: </span>
              <span>{{ recipeIngredient.hotels.name }}</span>
            </div>
          </v-list-item>
        </v-list>

      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
