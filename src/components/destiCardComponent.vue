<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices.js";

const router = useRouter();

const showDetails = ref(false);
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const user = ref(null);

const props = defineProps({
  recipe: {
    required: true,
  },
});

onMounted(async () => {
  await getRecipeIngredients();
  await getRecipeSteps();
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

function navigateToEdit() {
  router.push({ name: "editRecipe", params: { id: props.recipe.id } });
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
          <v-icon v-if="user !== null" size="24" class="text-primary" @click="navigateToEdit">mdi-pencil</v-icon>
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

        <h3 class="headline mb-2">Destinations</h3>
        <v-list>
          <v-list-item v-for="recipeIngredient in recipeIngredients" :key="recipeIngredient.id">
            <div>
              <span class="font-weight-bold">{{ recipeIngredient.Destinations }}</span>
              <span>{{ recipeIngredient.ingredient.Touristspots }}</span>
            </div>
            <div>
              Stay at {{ recipeIngredient.ingredient.Hotels }} {{ recipeIngredient.ingredient.Destinations }}
            </div>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
