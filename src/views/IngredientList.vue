<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import IngredientServices from "../services/IngredientServices.js";

const Destinations = [
  "Oklahoma",
"Dallas",
"Austin",
"Newyork",
"Chicago",
"Las Vegas",
"San Francisco",
"Colorado",
"Boston",
"Miami",
"Houston",
"San Antonio",
"Nashville",
"Charleston",
"South Carolina",
"Denver",
];

const ingredients = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newIngredient = ref({
  id: undefined,
  Destinations: undefined,
  Touristspots: undefined,
  Hotels: undefined,
});

onMounted(async () => {
  await getIngredients();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getIngredients() {
  try {
    const response = await IngredientServices.getIngredients();
    ingredients.value = response.data;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function addIngredient() {
  isAdd.value = false;
  delete newIngredient.value.id;
  try {
    await IngredientServices.addIngredient(newIngredient.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${newIngredient.value.Destinations} added successfully!`;
    await getIngredients();
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function updateIngredient() {
  isEdit.value = false;
  try {
    await IngredientServices.updateIngredient(newIngredient.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${newIngredient.value.Destinations} updated successfully!`;
    await getIngredients();
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

function openAdd() {
  newIngredient.value.id = undefined;
  newIngredient.value.Destinations = undefined;
  newIngredient.value.Touristspots = undefined;
  newIngredient.value.Hotels = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newIngredient.value.id = item.id;
  newIngredient.value.Destinations = item.Destinations;
  newIngredient.value.Touristspots = item.Touristspots;
  newIngredient.value.Hotels = item.Hotels;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Destinations
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
            >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Destinations</th>
            <th class="text-left">Touristspots</th>
            <th class="text-left">Hotels</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ingredients" :key="item.Destinations">
            <td>{{ item.Destinations }}</td>
            <td>{{ item.Touristspots }}</td>
            <td>{{ item.Hotels }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Destination" : isEdit ? "Edit Destination" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            
            <v-select
              v-model="newIngredient.Destinations"
              :items="Destinations"
              label="Destinations"
              required
            >
            </v-select>
            <v-text-field
              v-model="newIngredient.Touristspots"
              label="Touristspots"
              required
            ></v-text-field>
            <v-text-field
              v-model="newIngredient.Hotels"
              label="Hotels"
              
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addIngredient() : isEdit ? updateIngredient() : false
              "
              >{{
                isAdd ? "Add Destinations" : isEdit ? "Update Destinations" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>