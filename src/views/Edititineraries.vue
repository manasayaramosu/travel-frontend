<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import IngredientServices from "../services/locationServices.js";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";

import HotelServices from "../services/hotelServices.js";
import RecipeHotelServices from "../services/RecipeHotelServices.js";


import RecipeStepServices from "../services/RecipeStepServices.js";
import RecipeServices from "../services/itinerariesServices.js";


const route = useRoute();
const router = useRouter();

// const recipe = ref({});
const ingredients = ref([]);
const selectedIngredient = ref({});
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const isAddIngredient = ref(false);
const isEditIngredient = ref(false);

const hotels = ref([]);
const selectedHotel = ref({});
const recipeHotels = ref([]);
const isAddHotel = ref(false);
const isEditHotel = ref(false);
const isAddStep = ref(false);
const isEditStep = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newStep = ref({
  id: undefined,
  stepNumber: undefined,
  instruction: undefined,
  recipeId: undefined,
  recipeIngredient: [],
});
const recipe = ref({
  startdate: null,
  enddate: null
});
const today = ref(null);

onMounted(() => {
  today.value = new Date().toISOString().split("T")[0];
  getRecipe();
});
const newIngredient = ref({
  id: undefined,
  // quantity: undefined,
  recipeId: undefined,
  recipeStepId: undefined,
  ingredientId: undefined,
});

const newHotel = ref({
  id: undefined,
  // quantity: undefined,
  recipeId: undefined,
  recipeStepId: undefined,
  hotelsId: undefined,
});
onMounted(async () => {
  await getRecipe();
  await getRecipeIngredients();
  await getIngredients();
  // await getRecipeSteps();
  await getHotels();
  await getRecipeHotels();

});




async function getRecipe() {
  try {
    const response = await RecipeServices.getRecipe(route.params.id);
    const responseData = response.data[0];
    recipe.value = responseData;

    // Convert the date strings to Date objects
    // stday = new Date(responseData.startdate);
    // edday = new Date(responseData.enddate);

    
    // recipe.value.startdate = moment(String(stday)).format('YYYY-MM-DD');
    // recipe.value.enddate = moment(String(edday)).format('YYYY-MM-DD');

  } catch (error) {
    console.log(error);
  }
}

async function updateRecipe() {
  try {
    await RecipeServices.updateRecipe(recipe.value.id, recipe.value);

    // Fetch the updated recipe data from the API
    const updatedRecipe = await RecipeServices.getRecipe(recipe.value.id);
    const responseData = updatedRecipe.data[0];

    // Convert the date strings to Date objects
    // recipe.value.startdate = new Date(responseData.startdate);
    // recipe.value.enddate = new Date(responseData.enddate);

    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${recipe.value.name} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}
async function deleteRecipe(recipeId) {
  await RecipeServices.deleteRecipe(recipeId)
    .then(() => {
      // const updatedRecipe = await RecipeServices.getRecipe(recipe.value.id);
      router.push({ name: "itineraries"});
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Destination deleted successfully!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipe();
}



async function getIngredients() {
  await IngredientServices.getIngredients()
    .then((response) => {
      ingredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(route.params.id)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getHotels() {
  await HotelServices.getHotels()
    .then((response) => {
      hotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getRecipeHotels() {
  await RecipeHotelServices.getRecipeHotelsForRecipe(route.params.id)
    .then((response) => {
      recipeHotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addIngredient() {
  isAddIngredient.value = false;
  newIngredient.value.recipeId = recipe.value.id;
  newIngredient.value.ingredientId = selectedIngredient.value.id;
  delete newIngredient.value.id;
  await RecipeIngredientServices.addRecipeIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Ingredient added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}
async function addHotel() {
  isAddHotel.value = false;
  newHotel.value.recipeId = recipe.value.id;
  newHotel.value.hotelsId = selectedHotel.value.id;
  delete newHotel.value.id;
  await RecipeHotelServices.addRecipeHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Hotel added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeHotels();
}

async function updateIngredient() {
  isEditIngredient.value = false;
  newIngredient.value.recipeId = recipe.value.id;
  newIngredient.value.ingredientId = selectedIngredient.value.id;
  console.log(newIngredient);

  await RecipeIngredientServices.updateRecipeIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedIngredient.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}
async function updateHotel() {
  isEditHotel.value = false;
  newHotel.value.recipeId = recipe.value.id;
  newHotel.value.hotelId = selectedHotel.value.id;
  console.log(newHotel);

  await RecipeHotelServices.updateRecipeHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedHotel.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeHotels();
}

async function deleteIngredient(ingredient) {
  await RecipeIngredientServices.deleteRecipeIngredient(ingredient)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${ingredient.ingredient.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}

async function deleteHotel(ingredient) {
  await RecipeHotelServices.deleteRecipeHotel(ingredient)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${ingredient.ingredient.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeHotels();
}

async function checkUpdateIngredient() {
  if (newStep.value.recipeIngredient.length > 0) {
    console.log(newStep.value.recipeIngredient);
    for (let i = 0; i < newStep.value.recipeIngredient.length; i++) {
      newIngredient.value.id = newStep.value.recipeIngredient[i].id;
      // newIngredient.value.quantity = newStep.value.recipeIngredient[i].quantity;
      newIngredient.value.recipeStepId = newStep.value.id;
      selectedIngredient.value.id =
        newStep.value.recipeIngredient[i].ingredientId;
      await updateIngredient();
    }
  }
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    route.params.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addStep() {
  isAddStep.value = false;
  newStep.value.recipeId = recipe.value.id;
  delete newStep.value.id;
  await RecipeStepServices.addRecipeStep(newStep.value)
    .then((data) => {
      newStep.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateIngredient();

  await getRecipeSteps();
}

async function updateStep() {
  isEditStep.value = false;
  await RecipeStepServices.updateRecipeStep(newStep.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateIngredient();

  await getRecipeSteps();
}

async function deleteStep(step) {
  await RecipeStepServices.deleteRecipeStep(step)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getRecipeSteps();
}

function openAddIngredient() {
  newIngredient.value.id = undefined;
  // newIngredient.value.quantity = undefined;
  newIngredient.value.recipeStepId = undefined;
  newIngredient.value.ingredientId = undefined;
  selectedIngredient.value = undefined;
  isAddIngredient.value = true;
}

function openEditIngredient(ingredient) {
  newIngredient.value.id = ingredient.id;
  newIngredient.value.quantity = ingredient.quantity;
  newIngredient.value.recipeStepId = ingredient.recipeStepId;
  newIngredient.value.ingredientId = ingredient.ingredientId;
  selectedIngredient.value = Destinations.Destinations;
  isEditIngredient.value = true;
}

function openAddHotel() {
  newHotel.value.id = undefined;
  // newHotel.value.quantity = undefined;
  newHotel.value.recipeStepId = undefined;
  newHotel.value.hotelId = undefined;
  selectedHotel.value = undefined;
  isAddHotel.value = true;
}

function openEditHotel(hotel) {
  newHotel.value.id = hotel.id;
  newHotel.value.quantity = hotel.quantity;
  newHotel.value.recipeStepId = hotel.recipeStepId;
  newHotel.value.hotelId = hotel.hotelId;
  selectedHotel.value = Destinations.Destinations;
  isEditHotel.value = true;
}
function openAddStep() {
  newStep.value.id = undefined;
  newStep.value.stepNumber = undefined;
  newStep.value.instruction = undefined;
  newStep.value.recipeIngredient = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newStep.value.id = step.id;
  newStep.value.stepNumber = step.stepNumber;
  newStep.value.instruction = step.instruction;
  newStep.value.recipeIngredient = step.recipeIngredient;
  isEditStep.value = true;
}

function closeAddIngredient() {
  isAddIngredient.value = false;
}

function closeEditIngredient() {
  isEditIngredient.value = false;
}

function closeAddHotel() {
  isAddHotel.value = false;
}

function closeEditHotel() {
  isEditHotel.value = false;
}
function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          Edit Itinerary
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="recipe.location" label="current destination" required></v-text-field>
                <v-text-field v-model="recipe.name" label="Desired destination" required></v-text-field>
                
                <v-text-field v-model="recipe.startdate" :min="today" label="Start Date" type="date"></v-text-field>
                <v-text-field v-model="recipe.enddate" :min="today" label="End Date" type="date"></v-text-field>

                <v-switch v-model="recipe.isPublished" hide-details inset :label="`Publish? ${recipe.isPublished ? 'Yes' : 'No'}`"></v-switch>
              </v-col>
              <v-col>
                <v-textarea v-model="recipe.description" rows="10" label="Description"></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
  <v-btn variant="flat" color="primary" @click="updateRecipe()">Update Destination</v-btn>
  <v-btn icon color="error" @click="deleteRecipe(recipe.id)">
    <v-icon>mdi-delete</v-icon>
  </v-btn>
  <v-spacer></v-spacer>
  <v-btn variant="flat" color="primary" class="ml-2" :to="{ name: 'itineraries' }">destinations</v-btn>
</v-card-actions>

        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Locations </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddIngredient()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="recipeIngredient in recipeIngredients"
                :key="recipeIngredient.id"
              >
                
                  Day <b>{{ recipeIngredient.quantity }}</b> at Tourist Spot: <b>{{ recipeIngredient.ingredient.Touristspots }} </b> in <b> {{ recipeIngredient.ingredient.Destinations }}</b>

                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditIngredient(recipeIngredient)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteIngredient(recipeIngredient)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Hotels </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddHotel()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="recipeIngredient in recipeHotels"
                :key="recipeIngredient.id"
              >
                
                  Day <b>{{ recipeIngredient.quantity }}</b> at Hotel : <b>{{ recipeIngredient.hotels.name }}</b>

                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditHotel(recipeIngredient)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteHotel(recipeIngredient)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

          
    <v-dialog
      persistent
      :model-value="isAddIngredient || isEditIngredient"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddIngredient
            ? "Add Locations"
            : isEditIngredient
            ? "Edit Locations"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newIngredient.quantity"
                label="Days"
                type="number"
                
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
              v-model="selectedIngredient"

              :items="ingredients"
              :item-title="item => `${item.Touristspots}-${item.Destinations}`"
              item-value="touristspots"
              label="Tourist Spot"
              return-object
              required
              >
                <!-- <template v-slot:prepend>
                  {{
                    `${
                      selectedIngredient && selectedIngredient.Destinations
                        ? selectedIngredient.Destinations
                        : ""
                    }`
                  }}
                </template> -->
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddIngredient
                ? closeAddIngredient()
                : isEditIngredient
                ? closeEditIngredient()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddIngredient
                ? addIngredient()
                : isEditIngredient
                ? updateHotel()
                : false
            "
            >{{
              isAddIngredient
                ? "Add Locations"
                : isEditIngredient
                ? "Update Locations"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      :model-value="isAddHotel || isEditHotel"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddHotel
            ? "Add Hotel"
            : isEditHotel
            ? "Edit Hotel"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newHotel.quantity"
                label="Days"
                type="number"
                
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
              v-model="selectedHotel"

              :items="hotels"
              :item-title="item => `${item.name}`"
              item-value="hotels"
              label="Hotels"
              return-object
              required
              >
                <!-- <template v-slot:prepend>
                  {{
                    `${
                      selectedHotel && selectedHotel.Destinations
                        ? selectedHotel.Destinations
                        : ""
                    }`
                  }}
                </template> -->
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddHotel
                ? closeAddHotel()
                : isEditHotel
                ? closeEditHotel()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddHotel
                ? addHotel()
                : isEditHotel
                ? updateHotel()
                : false
            "
            >{{
              isAddHotel
                ? "Add Hotel"
                : isEditHotel
                ? "Update Hotel"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>



   
  </v-container>
</template>