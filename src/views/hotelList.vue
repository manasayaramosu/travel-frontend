<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import DestCard from "../components/destCard.vue";
import HotelServices from "../services/hotelServices.js";

const hotels = ref([]);
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newHotel = ref({
  name: "",
  description: ""
});
const publishValid=ref(false);
const today = new Date().toISOString().split("T")[0];

onMounted(async () => {
  await getHotels();
  user.value = JSON.parse(localStorage.getItem("user"));
});
async function deleteHotel(recipeId) {
  await HotelServices.deleteHotel(recipeId)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = " deleted successfully!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotels();
}
async function getHotels() {
  user.value = JSON.parse(localStorage.getItem("user"));
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

async function addHotel() {
  isAdd.value = false;
  console.log(newHotel.value);
  newHotel.value.userId = user.value.id;
    await HotelServices.addHotel(newHotel.value)
      .then(() => {
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `${newHotel.value.name} added successfully!`;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
    await getHotels();

}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
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
            >Hotels
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <DestCard
  v-for="recipe in hotels"
  :key="recipe.id"
  :recipe="recipe"
  @deletedList="getLists()"
  @deleteHotel="deleteHotel(recipe.id)"
/>

<v-dialog persistent v-model="isAdd" width="800">
  <v-card class="rounded-lg elevation-5">
    <v-card-title class="headline mb-2">Add Hotel</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="newHotel.name"
        label="Hotel"
        required
      ></v-text-field>      
      <v-textarea
        v-model="newHotel.description"
        label="Description"
      ></v-textarea>
      
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
      <v-btn variant="flat" color="primary" @click="addHotel()" :disabled="newHotel.name === ''">
        Add Hotel
      </v-btn>
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
