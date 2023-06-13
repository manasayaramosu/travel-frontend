<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import TravellerView from "../views/traveller_view.vue";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  reenterPassword: "",
  isAdmin: false,
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "itineraries" });
  }
});

async function loginAsTraveler() {
  // Perform the same username and password validations as the regular login button
  if (
    user.value.email &&
    user.value.password
  ) {
    console.log(user.value);
    await UserServices.loginUser(user)
      .then((data) => {
        window.localStorage.setItem("user", JSON.stringify(data.data));
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Login successful!";
        router.push({ name: "traveller_view" }); // Redirect to the traveler view
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill in all fields.";
  }
}

function navigateToRecipes() {
  router.push({ name: "itineraries" });
}

async function createAccount() {
  // Check if all fields are filled
  if (
    user.value.firstName &&
    user.value.lastName &&
    user.value.email &&
    user.value.password &&
    user.value.reenterPassword
  ) {
    // Check if passwords match
    if (user.value.password !== user.value.reenterPassword) {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Passwords do not match.";
      return;
    }

    await UserServices.addUser(user.value)
      .then(() => {
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Account created successfully!";
        router.push({ name: "login" });

        const userData = {
          ...toRaw(user),
          isAdmin: user.isAdmin,
        };
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill in all fields.";
  }
}

async function login() {
  console.log(user.value);
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "itineraries" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

// Email validation rule
const emailRules = [
  v => !!v || "Email is required",
  v => /.+@.+\..+/.test(v) || "Please enter a valid email address",
];
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Login </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.email"
            label="Email"
            required
            type="email"
            :rules="emailRules"
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            label="Password"
            required
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()"
            >Create Account</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>
          <v-btn variant="flat" color="primary" @click="loginAsTraveler">Login as Traveler</v-btn>

        </v-card-actions>
      </v-card>

      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline">
          <v-btn
            class="ml-2"
            variant="flat"
            color="secondary"
            @click="navigateToRecipes()"
          >
            View Published Destinations
          </v-btn>
          <TravellerView v-if="router.currentRoute.name === 'traveller_view'" />
        </v-card-title>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.firstName"
              label="First Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.lastName"
              label="Last Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.email"
              label="Email"
              required
              type="email"
              :rules="emailRules"
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              label="Password"
              required
              type="password"
            ></v-text-field>

            <v-text-field
              v-model="user.reenterPassword"
              label="Re-enter Password"
              required
              type="password"
            ></v-text-field>
            <v-checkbox v-model="user.isAdmin" label="Is an admin"></v-checkbox>
            <!-- Add a validation message if passwords don't match -->
            <v-alert
              v-if="user.password !== user.reenterPassword"
              color="error"
              dense
            >
              Passwords do not match.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="closeCreateAccount()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="createAccount()"
              >Create Account</v-btn
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