<template>
    <div>
      <h1>My Destinations</h1>
      <v-list>
        <v-list-item v-for="destination in destinations" :key="destination._id">
          <v-list-item-content>
            <v-list-item-title>{{ destination.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ destination.location }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </template>
  
  <script>
  import ItinerariesServices from "../services/itinerariesServices.js";
  
  export default {
    data() {
      return {
        destinations: [],
      };
    },
    mounted() {
      // Assuming you have the logged-in user's ID stored in `userId`
      ItinerariesServices.getDestinationsByUserId(userId)
        .then((response) => {
          this.destinations = response.data;
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    },
  };
  </script>
  