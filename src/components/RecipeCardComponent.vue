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
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ recipe.name }}
          <v-chip class="ma-2" color="primary" label>
            <!-- <v-icon start icon="mdi-earth-circle-outline"></v-icon> -->
            <strong>Location:</strong>
				   
													
															
            {{ recipe.location }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ recipe.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>description</h3>
        <v-chip class="ma-2"  label>
            <!-- <v-icon start icon="mdi-account-circle-outline"></v-icon> -->
            <strong>startdate</strong>
            {{ recipe.startdate }} 
          </v-chip>
          <v-chip class="ma-2"  label>
            <!-- <v-icon start icon="mdi-account-circle-outline"></v-icon> -->
            <strong>enddate</strong>
            {{ recipe.enddate }} 
													  
													  
          </v-chip>     
          <v-chip class="ma-2" color="primary" label>
            <!-- <v-icon start icon="mdi-earth-circle-outline"></v-icon> -->
            <strong>hotels:</strong>
            {{ recipe.hotels }}
          </v-chip>
          <v-chip class="ma-2" color="primary" label>
            <!-- <v-icon start icon="mdi-earth-circle-outline"></v-icon> -->
            <strong>touristspots:</strong>
            {{ recipe.touristspots }}
				  
				  
          </v-chip>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
