import apiClient from "./services";

export default {
  getDestinations() {
    return apiClient.get("destinations");
  },
  getDestinationsByUserId(userId) {
    return apiClient.get("destinations/user/" + userId);
  },
  getDestination(id) {
    return apiClient.get("destinations/" + id);
  },
  addDestination(destination) {
    return apiClient.post("destinations", destination);
  },
  updateDestination(destinationId, destination) {
    return apiClient.put("destinations/" + destinationId, destination);
  },
  deleteDestination(destinationId) {
    return apiClient.delete("destinations/" + destinationId);
  },
};
